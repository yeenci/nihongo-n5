import React, { useEffect, useState } from "react";
import { Vocab, vocab } from "../constants/flashcard";

interface ListViewProps {
  vocab: Vocab[];
  refs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
}

export default function ListView({ vocab, refs }: ListViewProps) {
  const [search, setSearch] = useState("");
  const filtered = vocab.filter((w) =>
    [w.vocabulary, w.chinese_char, w.meaning].some((s) =>
      s.toLowerCase().includes(search.toLowerCase())
    )
  );
  const groups = ["Words", "Phrases"];
  const grouped = groups.map((g) => ({
    group: g,
    vocab: filtered.filter((w) => w.group === g),
  }));

  return (
    <div className="flex flex-col items-center justify-center space-y-4 mt-8">
      {grouped.map(({ group, vocab }) =>
        vocab.length ? (
          <div key={group} ref={(el) => (refs.current[vocab] = el)}></div>
        ) : null
      )}
    </div>
  );
}
