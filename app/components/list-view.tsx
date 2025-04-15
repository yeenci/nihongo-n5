import React from "react";
import { Vocabulary } from "../constants/flashcard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Volume2 } from "lucide-react";
import { speakJapanese } from "@/lib/speech";
import { useVoiceFemale, useVoiceMale } from "@/hooks/useVoice";

interface ListViewProps {
  vocabulary: Vocabulary[];
  refs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  type: string;
}

export default function ListView({ vocabulary, refs, type }: ListViewProps) {
  const { maleVoice } = useVoiceMale();
  const { femaleVoice } = useVoiceFemale();

  return (
    <div>
      <div
        ref={(el) => {
          refs.current[type] = el;
        }}
      >
        <h3 className="text-xl font-semibold mb-2">{type}</h3>
        {vocabulary.map((word) => (
          <Card key={word.id} className="my-4">
          <CardContent className="w-full px-4 flex flex-col">
            <div className="flex justify-between">
              <p className="text-lg font-bold text-primary">
                {word.vocabulary}
                {word.chinese_char !== "" && (
                  <span className="text-muted-foreground">
                    【{word.chinese_char}】
                  </span>
                )}
              </p>
              <div className="flex gap-4">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    speakJapanese(word.vocabulary, maleVoice ?? undefined);
                  }}
                  className="flex cursor-pointer gap-1 text-xs items-center text-muted-foreground hover:text-primary font-semibold"
                >
                  Male
                  <Volume2 size={16} />
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    speakJapanese(word.vocabulary, femaleVoice ?? undefined);
                  }}
                  className="flex cursor-pointer gap-1 text-xs items-center text-muted-foreground hover:text-primary font-semibold"
                >
                  Female
                  <Volume2 size={16} />
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{word.meaning}</p>
            <Badge variant="secondary" className="mt-2">
              {word.type}
            </Badge>
          </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
