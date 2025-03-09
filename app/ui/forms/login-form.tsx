"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/config";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/context/AuthContext";
import Loading from "../loading";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user && !loading) {
      router.push("/dashboard");
    }
  }, [user, router, loading]);

  if (user && loading) {
    return <Loading />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is required.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    try {
      const res = await signInWithEmailAndPassword(email, password);
      if (!res) {
        throw new Error("Login Failed. Please Check your Credentials.");
      }
      return router.push("/dashboard");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="relative w-fit md:w-full md:mx-2 max-w-4xl flex shadow-lg bg-white/40 rounded-xl p-8">
      {/* form */}
      <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
        <h2 className="text-xl font-semibold text-primary mb-6">Nihongo N5</h2>
        <h1 className="text-3xl font-bold mb-4">Login</h1>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <div className="form-input">
              <Input
                className="border-none bg-transparent shadow-none focus-visible:border-none focus-visible:ring-0"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <div className="form-input">
              <Input
                className="border-none bg-transparent shadow-none focus-visible:border-none focus-visible:ring-0"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className=" text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full" onClick={handleLogin}>
            Sign in
          </Button>

          {error && (
            <p className="text-destructive mb-3 text-xs justify-center text-center">
              {error}
            </p>
          )}

          <p className="text-center text-sm mt-4">
            Don&apos;t have an account yet?{" "}
            <Link
              href="/register"
              className="font-semibold  text-primary hover:underline"
            >
              Register for free
            </Link>
          </p>
        </div>
      </div>

      {/* image */}
      <div className="w-1/2 items-center justify-center hidden md:flex">
        <Image
          src="/assets/cat-throwing-a-vase-animate.svg"
          width={400}
          height={400}
          alt=""
        />
      </div>
    </div>
  );
}
