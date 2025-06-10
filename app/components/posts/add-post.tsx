/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { AlertTriangle, FilePlus, Loader2, X } from "lucide-react";
import { ChangeEvent, FormEvent, ReactNode, useRef, useState } from "react";
import ConfirmationModal from "../modal";
import { RichTextEditor } from "@/components/RichTextEditor";

interface AddPostDialogProps {
  onPostAdded: () => void;
  userEmail: string | null | undefined;
  triggerBtn?: ReactNode;
  btnVariant:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
  btnIcon?: boolean | undefined;
}

export default function AddPostDialog({
  onPostAdded,
  userEmail,
  triggerBtn,
  btnVariant,
  btnIcon,
}: AddPostDialogProps) {
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
      title !== "" ||
      (description !== "<p></p>" && description !== "") ||
      tags.length > 0 ||
      files.length > 0
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

  const handleOpenChange = (open: boolean) => {
    if (!open && isFormDirty() && !successMsg) {
      setShowConfirmCloseModal(true);
      return false; // Prevent closing
    }
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
    return true;
  };

  const handleConfirmClose = () => {
    setShowConfirmCloseModal(false);
    setIsOpen(false);
    resetForm();
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
      }, 100);
    } catch (error: any) {
      setError(error.message || "Failed to add post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          {triggerBtn ? (
            triggerBtn
          ) : (
            <Button variant={btnVariant} size="sm">
              {btnIcon && <FilePlus className="mr-1 h-4 w-4" />}
              Upload Post
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="w-96 md:w-[500px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Share Your Resource</DialogTitle>
          </DialogHeader>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" /> {error}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-green-50 text-green-700 border border-green-200 rounded-md text-sm">
              {successMsg}
            </div>
          )}

          {!successMsg && (
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="">
                <Label htmlFor="dialog-title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dialog-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Enter post title"
                  className="mt-1"
                />
              </div>

              <div className="">
                <Label htmlFor="dialog-description">
                  Description<span className="text-red-500">*</span>
                </Label>
                <RichTextEditor
                  value={description}
                  onChange={setDescription}
                  placeholder="Describe your resource"
                />
              </div>

              <div className="">
                <Label htmlFor="dialog-tags-input">
                  Tags<span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="dialog-tags-input"
                    value={currentTag}
                    onChange={handleTagInput}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    required={tags.length === 0}
                    placeholder="Add a tag and press Enter"
                    className="flex-grow"
                  />
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={addTag}
                    disabled={currentTag === ""}
                  >
                    Add
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center bg-muted text-muted-foreground px-2 py-0.5 rounded-md text-xs"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 opacity-70 hover:opacity-100"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="dialog-files">Resource Files</Label>
                <Input
                  id="dialog-files"
                  type="file"
                  ref={fileInputRef}
                  multiple
                  onChange={handleFileChange}
                  className="mt-1"
                />
                {files.length > 0 && (
                  <div className="mt-1.5 text-xs text-muted-foreground">
                    Selected: {files.map((file) => file.name).join(", ")}
                  </div>
                )}
              </div>

              <DialogFooter className="pt-2">
                <DialogClose asChild>
                  <Button type="button" variant="outline" disabled={loading}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? "Adding..." : "Add Resource"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmationModal
        open={showConfirmCloseModal}
        title="You have unsaved changes. Are you sure you want to close and discard them?"
        onCancel={() => setShowConfirmCloseModal(false)}
        onConfirm={handleConfirmClose}
        confirmText="Discard"
      />
    </>
  );
}
