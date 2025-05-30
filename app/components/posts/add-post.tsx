/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, FilePlus, Loader2, X } from "lucide-react";
import { ChangeEvent, FormEvent, ReactNode, useRef, useState } from "react";
import ConfirmationModal from "../modal";

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

  const inputClass = `border border-muted rounded-md shadow-sm focus:outline-none focus:ring-primary/80 focus:border-primary/80 mt-1`;

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
        <PopoverContent
          className="w-96 md:w-[500px] p-0"
          sideOffset={5}
          align="end"
        >
          <div className="p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-primary/90">
                Share Your Resource
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCloseAttempt}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" /> {error}
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded-md text-sm">
                {successMsg}
              </div>
            )}

            {!successMsg && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Add title */}
                <div className="">
                  <Label htmlFor="popover-title">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="popover-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="Enter post title"
                    className="mt-1"
                  />
                </div>

                {/* Add description */}
                <div className="">
                  <Label htmlFor="popover-description">
                    Description<span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="popover-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Describe your resource"
                    className="mt-1"
                  />
                </div>

                {/* Add tags */}
                <div className="">
                  <Label htmlFor="popover-tags-input">
                    Tags<span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      id="popover-tags-input"
                      value={currentTag}
                      onChange={handleTagInput}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag();
                        }
                      }}
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

                {/* Upload resources */}
                <div>
                  <Label htmlFor="popover-files">Resource Files</Label>
                  <Input
                    id="popover-files"
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

                <div className="flex justify-end space-x-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseAttempt}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {loading ? "Adding..." : "Add Resource"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </PopoverContent>
      </Popover>

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
