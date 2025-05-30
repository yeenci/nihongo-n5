/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { FilePlus } from "lucide-react";
import { ChangeEvent, FormEvent, ReactNode, useRef, useState } from "react";

interface AddPostPopoverProps {
  onPostAdded: () => void;
  userEmail: string | null | undefined;
  triggerBtn?: ReactNode;
}

export default function AddPostPopover({
  onPostAdded,
  userEmail,
  triggerBtn,
}: AddPostPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [showConfirmCloseModal, setShowConfirmCloseModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isFormDirty = () => {
    return (
      title !== "" || description !== "" || tags.length > 0 || files.length > 0
    );
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setTags([]);
    setCurrentTag("");
    setFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setError(null);
    setSuccessMsg(null);
  };

  const handleCloseAttempt = () => {
    if (isFormDirty() && !successMsg) {
      setShowConfirmCloseModal(true);
    } else {
      closePopoverAndReset();
    }
  };

  const closePopoverAndReset = () => {
    setIsOpen(false);
    resetForm();
    setShowConfirmCloseModal(false);
  };

  const handleConfirmClose = () => {
    closePopoverAndReset();
  };

  const handleTagInput = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentTag(e.target.value);
  };

  const addTag = () => {
    if (
      currentTag.trim() !== "" &&
      !tags.includes(currentTag.trim().toLowerCase())
    ) {
      setTags([...tags, currentTag.trim().toLowerCase()]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    if (!userEmail) {
      setError("User email is not available. Please login.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("email", userEmail);
    formData.append("tags", JSON.stringify(tags));

    files.forEach((file) => {
      formData.append("resources", file);
    });

    try {
      const response = await fetch("/api/posts/upload-post", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "An unknown error occurred." }));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      setSuccessMsg("Post Uploaded successfully!");
      onPostAdded();
      resetForm();

      setTimeout(() => {
        setIsOpen(false);
        setSuccessMsg(null);
      }, 1500);
    } catch (error: any) {
      setError(error.message || "Failed to add post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Popover
        open={isOpen}
        onOpenChange={(openState) => {
          if (!openState) {
            handleCloseAttempt();
          } else {
            setIsOpen(true);
          }
        }}
      >
        <PopoverTrigger asChild>
          {triggerBtn ? (
            triggerBtn
          ) : (
            <Button variant="default" size="sm">
              <FilePlus className="mr-1 h-4 w-4" />
              Upload Post
            </Button>
          )}
        </PopoverTrigger>
      </Popover>
    </>
  );
}
