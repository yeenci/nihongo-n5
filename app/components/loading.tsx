"use client";

import React from "react";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex inset-0 z-50 fixed items-center justify-center bg-primary/40">
      <Image
        src="/assets/playful-cat-animate.svg"
        width={200}
        height={200}
        alt="Loading"
      />
    </div>
  );
}
