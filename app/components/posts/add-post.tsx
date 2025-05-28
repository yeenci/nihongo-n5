/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReactNode, useRef, useState } from "react";

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
}
