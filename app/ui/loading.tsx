"use client";

import React from "react";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex w-full items-center justify-center min-h-screen bg-primary/40">
      <Image
        src="/assets/playful-cat-animate.svg"
        width={200}
        height={200}
        alt=""
      />
    </div>
  );
}
