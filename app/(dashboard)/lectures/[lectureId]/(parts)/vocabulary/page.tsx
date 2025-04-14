/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Flashcard from "@/app/components/flashcard";
import FlashcardButton from "@/app/components/flashcard-btn";
import Spinner from "@/app/components/spinner";
import TOC from "@/app/components/toc";
// import { Button } from "@/components/ui/button";
import { useLecturePartData } from "@/hooks/useLecturePartData";
// import { speakJapanese } from "@/lib/speech";
// import { cn } from "@/lib/utils";
// import { List, SquareAsterisk, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Vocab = {
  // id: string;
  vocabulary: string;
  chinese_char: string;
  yin_han: string;
  meaning: string;
  group: "word" | "phrase";
};

const vocab: Vocab[] = [
  {
    vocabulary: "わたし",
    chinese_char: "",
    yin_han: "",
    meaning: "tôi",
    group: "word",
  },
  {
    vocabulary: "あなた",
    chinese_char: "",
    yin_han: "",
    meaning: "anh/chị, ông/bà, bạn (ngôi thứ II số ít)",
    group: "word",
  },
  {
    vocabulary: "あのひと",
    chinese_char: "あの人",
    yin_han: "NHÂN",
    meaning: "người kia, người đó, anh kia, chị kia",
    group: "word",
  },
  {
    vocabulary: "あのかた",
    chinese_char: "あの方",
    yin_han: "",
    meaning: "(あのかた: là cách nói lịch sự của あのひと)",
    group: "word",
  },
  {
    vocabulary: "〜さん",
    chinese_char: "",
    yin_han: "",
    meaning: "anh, chị, ông, bà (hậu tố thể hiện lịch sự)",
    group: "word",
  },
  {
    vocabulary: "〜ちゃん",
    chinese_char: "",
    yin_han: "",
    meaning: "(hậu tố thêm vào sau tên của trẻ em thay cho ～さん)",
    group: "word",
  },
  {
    vocabulary: "〜じん",
    chinese_char: "〜人",
    yin_han: "NHÂN",
    meaning: "(hậu tố mang nghĩa “người ~”, ví dụ アメリカじん: người Mỹ)",
    group: "word",
  },
  {
    vocabulary: "せんせい",
    chinese_char: "先生",
    yin_han: "TIÊN SINH",
    meaning:
      "thầy/cô (không dùng khi giới thiệu về nghề giáo viên của chính mình)",
    group: "word",
  },
  {
    vocabulary: "いいえ",
    chinese_char: "",
    yin_han: "",
    meaning: "không",
    group: "word",
  },
  {
    vocabulary: "はじめまして",
    chinese_char: "初めまして",
    yin_han: "",
    meaning: "Rất hân hạnh được gặp anh/chị. (Câu chào lần đầu khi giới thiệu)",
    group: "phrase",
  },
  {
    vocabulary: "〜からきました",
    chinese_char: "〜から来ました",
    yin_han: "",
    meaning: "Tôi đến từ ~.",
    group: "phrase",
  },
  {
    vocabulary: "よろしくおねがいします",
    chinese_char: "[どうぞ] よろしく [お願いします]",
    yin_han: "",
    meaning: "Rất vui được làm quen với anh/chị. (Rất mong được giúp đỡ)",
    group: "phrase",
  },
  {
    vocabulary: "しつれいですが",
    chinese_char: "失礼ですが",
    yin_han: "",
    meaning:
      "Xin lỗi... (dùng để mở đầu câu hỏi thông tin cá nhân như tên, địa chỉ)",
    group: "phrase",
  },
  {
    vocabulary: "おなまえは？",
    chinese_char: "お名前は？",
    yin_han: "",
    meaning: "Tên anh/chị là gì?",
    group: "phrase",
  },
  {
    vocabulary: "こちらは〜さんです",
    chinese_char: "",
    yin_han: "",
    meaning: "Đây là anh/chị/ông/bà ~.",
    group: "phrase",
  },
];

export default function VocabularyPage() {
  const { data, loading } = useLecturePartData();

  // Table of Content Scroll
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  // Flashcard
  const [flashcardMode, setFlashcardMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Search
  const [search, setSearch] = useState("");
  const filtered = vocab.filter((w) =>
    [w.vocabulary, w.chinese_char, w.meaning].some((s) =>
      s.toLowerCase().includes(search.toLowerCase())
    )
  );

  // Group
  const groups = ["Words", "Phrases"];
  const grouped = groups.map((grp) => ({
    group: grp,
    vocab: filtered.filter((w) => w.group === grp),
  }));

  // Current Item
  const currentItem = filtered[currentIndex] || null;

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold my-4 text-primary">Vocabulary</h1>
        {!loading && data && (
          <FlashcardButton
            flashcardMode={flashcardMode}
            setFlashcardMode={setFlashcardMode}
          />
        )}
      </div>
      {loading && <Spinner />}
      {!loading && data && (
        <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:px-2 sm:gap-2 md:gap-10">
          {/* Flashcard Mode */}
          {flashcardMode && currentItem && (
            <Flashcard isFlipped={isFlipped}/>
          )}
        </div>
      )}
      <TOC groups={groups} scrollRefs={refs} />
    </div>
    // <div className="">
    //   {loading && <p className="text-gray-500">Loading...</p>}
    //   {!loading && data && (
    //     <table className="table-auto border w-full">
    //       <thead>
    //         <tr>
    //           {Object.keys(data[0] || {}).map((key) => (
    //             <th key={key} className="border p-2 bg-gray-100">
    //               {key}
    //             </th>
    //           ))}
    //           <th className="border p-2 bg-gray-100">pronounce</th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {data.map((row: any, idx: number) => (
    //           <tr key={idx}>
    //             {Object.values(row).map((val: any, i: number) => (
    //               <td key={i} className="border p-2">
    //                 {val}
    //               </td>
    //             ))}
    //             <td className="border p-2">
    //               <Button
    //                 variant={"outline"}
    //                 className="sm"
    //                 onClick={() =>
    //                   speakJapanese(row.vocabulary, jpVoice ?? undefined)
    //                 }
    //               >
    //                 <Volume2 />
    //               </Button>
    //             </td>
    //           </tr>
    //         ))}
    //       </tbody>
    //     </table>
    //   )}
    // </div>
  );
}
