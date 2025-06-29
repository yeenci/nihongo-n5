/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getInitials } from "@/app/components/comment-helper";
import Spinner from "@/app/components/spinner";
import { useAuth } from "@/app/context/AuthContext";
import { auth, db, storage } from "@/app/firebase/config";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Label } from "@radix-ui/react-label";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { AlertTriangle, Camera } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";

export default function EditProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (user) {
      const fetchProfile = async () => {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const data = userDoc.data();
            setDisplayName(data.displayName || user.displayName || "");
          } else {
            setDisplayName(user.displayName || "");
          }
        } catch (err: any) {
          console.error("Firestore fetch failed:", err);
          setError("Could not load your profile data. Please try again later.");
        }
      };

      fetchProfile();
    }
  }, [user, authLoading]);

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
      let photoURL = user.photoURL;

      if (avatarFile) {
        const storageRef = ref(storage, `avatars/${user.uid}`);
        await uploadBytes(storageRef, avatarFile);
        photoURL = await getDownloadURL(storageRef);
      }

      await updateProfile(auth.currentUser!, {
        displayName: displayName,
        photoURL: photoURL,
      });

      const userDocRef = doc(db, "users", user.uid);
      await setDoc(
        userDocRef,
        {
          displayName: displayName,
          email: user.email,
          photoURL: photoURL,
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
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      setSuccessMessage("Password changed successfully!");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      if (err.code === "auth/wrong-password") {
        setError("The current password you entered is incorrect.");
      } else if (err.code === "auth/weak-password") {
        setError("The new password is too weak.");
      } else {
        setError("Failed to change password. Please check your credentials.");
      }
    } finally {
      setIsPasswordSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-full pt-20">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center p-8">Please log in to edit your profile.</div>
    );
  }

  // Main component render
  return (
    <div className="flex flex-row h-full justify-center w-full p-4 pt-6">
      <div className="w-full max-w-2xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">Edit Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and profile information.
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {successMessage && (
          <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        {/* Profile Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your display name and profile picture.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="flex items-center gap-6">
                {/* <div className="relative group">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={avatarPreview || user.photoURL || ''} alt={displayName} />
                    <AvatarFallback>{getInitials(displayName || user.email)}</AvatarFallback>
                  </Avatar>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center rounded-full transition-opacity"
                    aria-label="Change profile picture"
                  >
                    <Camera className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp"
                  />
                </div> */}
                <div className="w-full">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your Name"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isProfileSaving}>
                  {isProfileSaving ? 'Saving...' : 'Save Profile'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Change Password Card */}
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              For your security, you must enter your current password to make changes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isPasswordSaving}>
                  {isPasswordSaving ? 'Changing...' : 'Change Password'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}