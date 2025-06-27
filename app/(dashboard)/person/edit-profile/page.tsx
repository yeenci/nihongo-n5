/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(your-route)/person/page.tsx (or wherever you place it)

"use client";

import React, {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  FormEvent,
} from "react";
import { useAuth } from "@/app/context/AuthContext";
import { auth, db, storage } from "@/app/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import Spinner from "@/app/components/spinner";

export default function EditProfilePage() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for profile info
  const [displayName, setDisplayName] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // State for password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI/Feedback State
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");

      const fetchProfile = async () => {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setDisplayName(data.displayName || "");
        }
        setIsLoading(false);
      };
      fetchProfile();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        setError("File is too large. Please select an image under 2MB.");
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsProfileSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      let photoUrl = user.photoURL;

      if (avatarFile) {
        const storageRef = ref(storage, `avatars/${user.uid}`);
        await uploadBytes(storageRef, avatarFile);
        photoUrl = await getDownloadURL(storageRef);
      }

      await updateProfile(auth.currentUser!, {
        displayName: displayName,
        photoURL: photoUrl,
      });

      const userDocRef = doc(db, "users", user.uid);
      await setDoc(
        userDocRef,
        {
          displayName: displayName,
          email: user.email,
          photoUrl: photoUrl,
        },
        { merge: true }
      );

      setSuccessMessage("Profile updated successfully!");
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !user.email) return;

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsPasswordSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, newPassword);

      setSuccessMessage("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      if (err.code === "auth/wrong-password") {
        setError("The current password you entered is incorrect.");
      } else if (err.code === "auth/weak-password") {
        setError("The new password is too weak.");
      } else {
        setError(err.message);
      }
    } finally {
      setIsPasswordSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center p-8">Please log in to edit your profile.</div>
    );
  }

  return <div className="flex flex-row h-full justify-center w-full p-4"></div>;
}
