/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/components/posts/comment-list.tsx

import { Comment } from "@/app/redux/postSlice";
import { useAuth } from "@/app/context/AuthContext";
import { useState } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, Loader2, MoreHorizontal, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import SimpleAvatar, {
  formatDate,
  getInitials,
  getNameFromEmail,
} from "../comment-helper";

interface CommentItemProps {
  comment: Comment;
  postId: number;
  onCommentChange: () => void;
}

function CommentItem({ comment, postId, onCommentChange }: CommentItemProps) {
  const { user } = useAuth();
  const isOwner = user?.email === comment.userEmail;

  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.text);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSaveEdit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/posts/edit-comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          commentId: comment.id,
          userEmail: user!.email,
          newText: editedText,
        }),
      });
      if (!response.ok)
        throw new Error(
          (await response.json()).message || "Failed to save comment"
        );
      setIsEditing(false);
      onCommentChange();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/posts/delete-comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          commentId: comment.id,
          userEmail: user!.email,
        }),
      });
      if (!response.ok)
        throw new Error(
          (await response.json()).message || "Failed to delete comment"
        );
      onCommentChange();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (comment.status === "deleted") {
    if (isOwner) {
      return (
        <div className="flex items-center gap-3 text-sm italic text-gray-500">
          <SimpleAvatar initials={getInitials(comment.userEmail)} />
          <div className="flex items-center justify-between w-full">
            <p>This comment was deleted.</p>
          </div>

          {/* <Button variant="link" className="hover:underline">Reset</Button> */}
        </div>
      );
    } else {
      return <></>;
    }
  }

  return (
    <div className="flex items-center gap-3">
      <SimpleAvatar initials={getInitials(comment.userEmail)} />
      <div className="flex-1">
        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
          <div className="w-full mr-2">
            <div className="flex items-baseline gap-2">
              <p className="font-semibold text-sm text-muted-foreground">
                {getNameFromEmail(comment.userEmail)}
              </p>
              <p className="text-xs text-gray-500">
                {formatDate(comment.commentedAt)}
              </p>
              {comment.status === "edited" && (
                <p className="text-xs text-gray-500">(edited)</p>
              )}
            </div>
            {isEditing ? (
              <div className="mt-2 space-y-2 w-full">
                <Textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="bg-white "
                />
                {error && <p className="text-xs text-red-500">{error}</p>}
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveEdit}
                    disabled={isLoading}
                  >
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}{" "}
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground/90 mt-1 whitespace-pre-wrap">
                {comment.text}
              </p>
            )}
          </div>
          {isOwner && !isEditing && (
            <AlertDialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem className="text-red-500 focus:text-red-500">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will delete your comment. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </div>
  );
}

interface CommentListProps {
  comments: Comment[];
  postId: number;
  onCommentChange: () => void;
}

export const CommentList = ({
  comments,
  postId,
  onCommentChange,
}: CommentListProps) => (
  <div className="w-full space-y-6 pt-4 border-t">
    <h3 className="text-lg font-semibold text-muted-foreground/95 px-1">
      Comments
    </h3>
    {comments.length > 0 ? (
      comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          postId={postId}
          onCommentChange={onCommentChange}
        />
      ))
    ) : (
      <p className="text-sm text-gray-500 text-center py-4">No comments yet.</p>
    )}
  </div>
);
