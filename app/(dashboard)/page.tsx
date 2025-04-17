"use client";

import { Button } from "@/components/ui/button";
import { useAutoFetchImages } from "@/hooks/useAutoFetchImages";
import {
  ArrowRight,
  BookText,
  FileText,
  Headphones,
  PawPrint,
  Pen,
  Search,
} from "lucide-react";
import Image from "next/image";
import React from "react";

export default function HomePage() {
  useAutoFetchImages();

  return (
    <div className="py-6 px-4 h-full">
      {/* <h1 className="text-3xl font-bold text-primary">Nihongo N5</h1>
      <p className="text-muted-foreground">
        Let&apos;s start learning! You can view lectures now.
      </p> */}
      <section className="relative flex flex-col md:flex-row items-center md:justify-between justify-center h-full overflow-hidden">
        <div className="absolute w-full top-6 md:top-1/2 -left-12 -translate-y-1/2 md:-rotate-90 z-0">
          <h1 className="text-[10vw] md:text-[7vw] tracking-tight font-extrabold text-muted select-none whitespace-nowrap">
            NIHONGO N5
          </h1>
        </div>

        <div className="relative z-10 w-[50vw] h-[50vw] md:ml-20">
          <Image
            src={"/assets/homepage.svg"}
            alt="Home Image"
            fill
            className="object-contain"
          />
        </div>

        <div className="z-10 max-w-md">
          {/* <h1 className="text-3xl font-bold text-primary mb-2">Nihongo N5</h1> */}
          <p className="text-primary text-lg font-medium mb-2">
            <strong className="font-bold text-xl rounded">Nihongo N5</strong> is
            your all-in-one website to master the basics of Japanese.
          </p>
          <ul className="list-none text-sm text-muted-foreground mb-4">
            <li className="flex gap-2 items-center">
              <BookText width={16} /> Study vocabulary, grammar, and sentence
              patterns
            </li>
            <li className="flex gap-2 items-center">
              <Headphones width={16} /> Listen to native pronunciations
            </li>
            <li className="flex gap-2 items-center">
              <FileText width={16} /> Practice with exercises and quizzes
            </li>
            <li className="flex gap-2 items-center">
              <Pen width={16} /> Write your answers with handwriting or typing
            </li>
            <li className="flex gap-2 items-center">
              <Search width={16} /> Save and review hard-to-remember words
            </li>
          </ul>
          <div className="flex items-start gap-2">
            <Button>Get Started</Button>
            <Button variant="link" className="w-fit">
              View All Lectures <ArrowRight />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
