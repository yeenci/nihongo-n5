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
  DialogFooter,
} from "@/components/ui/dialog";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { FormEvent, ReactNode, useEffect, useState } from "react";
import { RichTextEditor } from "@/components/RichTextEditor";
import { Post } from "@/app/redux/postSlice";

interface EditPostDialogProps {
  postToEdit: Post;
  onPostEdited: () => void;
  userEmail: string | null | undefined;
  triggerBtn: ReactNode;
}

export default function EditPostDialog({
  postToEdit,
  onPostEdited,
  userEmail,
  triggerBtn,
}: EditPostDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [title, setTitle] = useState(postToEdit.title);
  const [description, setDescription] = useState(postToEdit.description);
  const [tags, setTags] = useState<string[]>(postToEdit.tags || []);
  const [currentTag, setCurrentTag] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTitle(postToEdit.title);
      setDescription(postToEdit.description);
      setTags(postToEdit.tags || []);
      setError(null);
      setSuccessMsg(null);
    }
  }, [isOpen, postToEdit]);

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim().toLowerCase())) {
      setTags([...tags, currentTag.trim().toLowerCase()]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
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
    formData.append("postId", postToEdit.id.toString());
    formData.append("title", title);
    formData.append("description", description);
    formData.append("email", userEmail);
    formData.append("tags", JSON.stringify(tags));

    try {
      const response = await fetch("/api/posts/edit-post", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(
          result.message || `HTTP error! status: ${response.status}`
        );
      }

      setSuccessMsg("Post updated successfully!");
      onPostEdited();

      setTimeout(() => {
        setIsOpen(false);
      }, 1000);
    } catch (error: any) {
      setError(error.message || "Failed to edit post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{triggerBtn}</DialogTrigger>
      <DialogContent className="w-96 md:w-[500px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Your Resource</DialogTitle>
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
            <div>
              <Label htmlFor="edit-dialog-title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-dialog-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="edit-dialog-description">
                Description<span className="text-red-500">*</span>
              </Label>
              <RichTextEditor value={description} onChange={setDescription} />
            </div>

            <div>
              <Label htmlFor="edit-dialog-tags-input">
                Tags<span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  id="edit-dialog-tags-input"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  required={tags.length === 0}
                  placeholder="Add a tag and press Enter"
                />
                <Button type="button" onClick={addTag} disabled={!currentTag}>
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

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
