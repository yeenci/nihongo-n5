"use client";
import React, { createContext, useContext, useState } from "react";

const LectureLoadingContext = createContext<{
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}>({
  isLoading: false,
  setIsLoading: () => {},
});

export const useLectureLoading = () => useContext(LectureLoadingContext);

export function LectureLoadingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LectureLoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LectureLoadingContext.Provider>
  );
}

export default LectureLoadingContext;
