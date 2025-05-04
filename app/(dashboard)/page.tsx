"use client";

import { Button } from "@/components/ui/button";
import { useAutoFetchImages } from "@/hooks/useAutoFetchImages";
import {
  ArrowRight,
  BookOpen,
  FileText,
  Headphones,
  Pen,
  Search,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

export default function HomePage() {
  useAutoFetchImages();
  const router = useRouter();

  return (
    <div className="py-4 px-4">
      <section className="grid grid-cols-1 lg:grid-cols-2 items-center px-8 pt-4 pb-16 bg-background">
        <div className="flex justify-center">
          <div className="relative w-[400px] h-[400px] lg:w-[560px] lg:h-[560px]">
            <Image
              src="/assets/homepage.png"
              alt="Home Page"
              fill
              className="object-contain"
            />
          </div>
        </div>
        <div className="px-2 sm:px-8">
          <p className="text-center lg:text-start text-primary text-lg sm:text-xl md:text-xl xl:text-xl font-medium mb-2">
            <strong className="font-bold text-xl sm:text-2xl md:text-2xl xl:text-2xl rounded">
              Nihongo N5
            </strong>{" "}
            is your all-in-one website to master the basics of Japanese.
          </p>
          <ul className="hidden lg:block list-none text-sm sm:text-base md:text-sm xl:text-base text-muted-foreground mb-4 space-y-2">
            <li className="flex gap-2 items-center">
              <BookOpen className="w-5" /> Study vocabulary, grammar, and
              sentence patterns
            </li>
            <li className="flex gap-2 items-center">
              <Headphones className="w-5" /> Listen to native pronunciations
            </li>
            <li className="flex gap-2 items-center">
              <FileText className="w-5" /> Practice with exercises and quizzes
            </li>
            <li className="flex gap-2 items-center">
              <Pen className="w-5" /> Write your answers with handwriting or
              typing
            </li>
            <li className="flex gap-2 items-center">
              <Search className="w-5" /> Save and review hard-to-remember words
            </li>
          </ul>
          <div className="flex justify-center lg:justify-start items-start gap-2 pt-2">
            <Button
              className="w-fit text-sm sm:text-base md:text-base xl:text-base"
              onClick={() => router.push(`/lectures/lecture1`)}
            >
              Get Started
            </Button>
            <Button
              variant="link"
              className="w-fit text-xs sm:text-sm md:text-sm xl:text-sm"
              onClick={() => router.push(`/lectures`)}
            >
              View All Lectures <ArrowRight />
            </Button>
          </div>
        </div>
      </section>

      {/* <section className="text-center bg-muted text-background mx-0 px-8 lg:mx-16 lg:px-12 py-12 rounded">
        <h2 className="text-xl lg:text-2xl font-semibold text-primary mb-6">
          Explore Your Japanese Study Companion
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-12">
          <div className="bg-background text-muted-foreground p-6 rounded-md shadow-md">
            <h3 className="font-bold text-md lg:text-lg mb-2">Vocabulary & Grammar</h3>
            <p className="text-sm">
              Build a strong foundation with N5-level vocabulary lists and
              easy-to-understand grammar explanations tailored for beginners.
            </p>
          </div>
          <div className="bg-background text-muted-foreground p-6 rounded-md shadow-md">
            <h3 className="font-bold text-lg mb-2">Alphabets</h3>
            <p className="text-sm">
              Learn Hiragana and Katakana with interactive tables, pronunciation
              guides, and stroke order visuals - perfect for first-time.
              learners.
            </p>
          </div>
          <div className="bg-background text-muted-foreground p-6 rounded-md shadow-md">
            <h3 className="font-bold text-lg mb-2">Shared Resources</h3>
            <p className="text-sm">
              Access downloadable worksheets, learning schedules, and
              recommended tools contributed by fellow learners to boost your
              study routine.
            </p>
          </div>
        </div>
      </section> */}
    </div>
  );
}
