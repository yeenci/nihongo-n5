/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { useLecturePartData } from "@/hooks/useLecturePartData";
import { speakJapanese } from "@/lib/speech";
import { Volume2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function VocabularyPage() {
  const { data, loading } = useLecturePartData();
  const [jpVoice, setJpVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      const voice =
        voices.find(
          (v) =>
            v.name.includes("Nanami") ||
            (v.name.includes("Kyoko") && v.lang === "ja-JP")
        ) || voices.find((v) => v.lang === "ja-JP");
      setJpVoice(voice || null);
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  return (
    <div className="">
      {loading && <p className="text-gray-500">Loading...</p>}
      {!loading && data && (
        <table className="table-auto border w-full">
          <thead>
            <tr>
              {Object.keys(data[0] || {}).map((key) => (
                <th key={key} className="border p-2 bg-gray-100">
                  {key}
                </th>
              ))}
              <th className="border p-2 bg-gray-100">Pronounce</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row: any, idx: number) => (
              <tr key={idx}>
                {Object.values(row).map((val: any, i: number) => (
                  <td key={i} className="border p-2">
                    {val}
                  </td>
                ))}
                <td className="border p-2">
                  <Button
                    variant={"outline"}
                    className="sm"
                    onClick={() =>
                      speakJapanese(row.vocabulary, jpVoice ?? undefined)
                    }
                  >
                    <Volume2 />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
