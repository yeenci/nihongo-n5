"use client";

import KanaTable from "@/app/components/kanatable";
import { hiragana, katakana } from "@/app/constants/alphabets";

export default function Alphabets() {
  return (
    <div className="p-12 grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:px-2 sm:gap-2 md:gap-10 lg:gap-16 lg:px-16 xl:px-32 xl:gap-20">
      <KanaTable title="Hiragana" alphabet={hiragana} />
      <KanaTable title="Katakana" alphabet={katakana} />
    </div>
  );
}
