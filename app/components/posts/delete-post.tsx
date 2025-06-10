/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/dialogs/DeletePostDialog.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Post } from "@/app/redux/postSlice";
import { ReactNode, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DeletePostDialogProps {
  postToDelete: Post;
  onPostDeleted: () => void;
  userEmail: string | null | undefined;
  triggerBtn: ReactNode;
}

export default function DeletePostDialog({
  postToDelete,
  onPostDeleted,
  userEmail,
  triggerBtn,
}: DeletePostDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    if (!userEmail) {
      setError("You must be logged in to delete a post.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/posts/delete-post", {
        method: "POST", // Or 'DELETE', depending on your API. Using POST to send a body.
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: postToDelete.id,
          email: userEmail, // Send user email for backend authorization
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to delete the post.");
      }
      
      // On success, call the callback to refetch data and close the dialog
      onPostDeleted();
      setIsOpen(false);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Reset error when dialog is opened or closed
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setError(null);
    }
    setIsOpen(open);
  };


  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        {triggerBtn}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will mark the post titled &quot;<strong>{postToDelete.title}</strong>&quot; as deleted. It will be hidden from public view but not permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>


        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Deleting..." : "Yes, Delete Post"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}