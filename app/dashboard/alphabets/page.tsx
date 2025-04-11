"use client";

import KanaTable from "@/app/components/kanatable";
import { hiragana, katakana } from "@/app/constants/alphabets";

export default function Alphabets() {
  return (
    <div className="p-12 grid grid-cols-1 md:grid-cols-2 gap-12">
      <KanaTable title="Hiragana" alphabet={hiragana} />
      <KanaTable title="Katakana" alphabet={katakana} />
    </div>
  );
}
