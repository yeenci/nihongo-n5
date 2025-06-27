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
import { updateProfile } from "firebase/auth";

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
        setIsLoading(false)
      };
      fetchProfile()
    } else {
      setIsLoading(false)
    }
  }, [user]);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2*1024*1024) {
        setError("File is too large. Please select an image under 2MB.")
        return
      }
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!user) return;

    setIsProfileSaving(true)
    setError(null)
    setSuccessMessage(null)

    try {
      let photoUrl = user.photoURL;

      if (avatarFile) {
        const storageRef = ref(storage, `avatars/${user.uid}`)
        await uploadBytes(storageRef, avatarFile)
        photoUrl = await getDownloadURL(storageRef)
      }

      await updateProfile(auth.currentUser!, {
        displayName: displayName, photoURL: photoUrl
      })

      const userDocRef = doc(db, 'users', user.uid)
      await setDoc(userDocRef, {
        displayName: displayName, email: user.email, photoUrl: photoUrl
      }, {merge: true})

      setSuccessMessage("Profile updated successfully!");
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProfileSaving(false);
    }
  };
}
