import React, { useState } from "react";
import { Vocabulary } from "../constants/flashcard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Volume2 } from "lucide-react";
import { speakJapanese } from "@/lib/speech";
import { useVoiceFemale, useVoiceMale } from "@/hooks/useVoice";
// import { Button } from "@/components/ui/button";

interface ListViewProps {
  vocabulary: Vocabulary[];
  // refs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  // type: string;
}

export default function ListView({ vocabulary }: ListViewProps) {
  const { maleVoice } = useVoiceMale();
  const { femaleVoice } = useVoiceFemale();

  const [selectedType, setSelectedType] = useState<string>("All");
  const types = [...new Set(vocabulary.map((t) => t.type))];

  const filtered =
    selectedType === "All"
      ? vocabulary
      : vocabulary.filter((t) => t.type === selectedType);

  const grouped = filtered.reduce((lists, item) => {
    lists[item.type] = lists[item.type] || [];
    lists[item.type].push(item);
    return lists;
  }, {} as Record<string, Vocabulary[]>);

  return (
    <div>
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {/* Tabs */}
        <button
          onClick={() => setSelectedType("All")}
          className={`px-4 py-2 rounded-full border text-sm font-medium ${
            selectedType === "All"
              ? "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90"
              : "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
          }`}
        >
          All
        </button>
        {types.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2 rounded-full border text-sm font-medium ${
              selectedType === type
                ? "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90"
                : "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Vocabulary */}
      {Object.entries(grouped).map(([type, items]) => (
        <div key={type}>
          <div className="space-y-6">
            {items.map((vocab) => (
              <Card key={vocab.id} className="my-4">
                <CardContent className="w-full px-4 flex flex-col">
                  <div className="flex justify-between mb-2">
                    <Badge variant="secondary" className="">
                      {vocab.type}
                    </Badge>
                    <div className="flex gap-4">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          speakJapanese(
                            vocab.vocabulary,
                            maleVoice ?? undefined
                          );
                        }}
                        className="flex cursor-pointer gap-1 text-xs items-center text-muted-foreground hover:text-primary font-semibold"
                      >
                        Male
                        <Volume2 size={16} />
                      </div>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          speakJapanese(
                            vocab.vocabulary,
                            femaleVoice ?? undefined
                          );
                        }}
                        className="flex cursor-pointer gap-1 text-xs items-center text-muted-foreground hover:text-primary font-semibold"
                      >
                        Female
                        <Volume2 size={16} />
                      </div>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-primary">
                    {vocab.vocabulary}
                    {vocab.chinese_char !== "" && (
                      <span className="text-muted-foreground">
                        【{vocab.chinese_char}】
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {vocab.meaning}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
