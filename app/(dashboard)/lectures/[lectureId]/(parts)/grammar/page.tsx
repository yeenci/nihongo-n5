"use client";

export default function GrammarPage() {
  return (
    <div className="flex flex-col h-full justify-center w-full">
      <h1 className="text-3xl font-bold my-4 text-primary">Grammar</h1>
      <div className="w-full flex flex-row gap-4">
        {/* <div className="w-full lg:w-4/5 xl:w-3/5 2xl:w-1/2"> */}
        <div className="flex flex-col justify-between">
          {grammarData.map((item) => (
            <section
              key={item.id}
              id={`section-${item.id}`}
              className="mb-12 scoll-mt-20"
            >
              <div className="sticky top-0 z-10 bg-background border-b border-muted py-2 mb-4">
                <h2 className="text-xl font-bold text-primary">{item.type}</h2>
              </div>
              <div className="space-y-6">
                <div className="bg-background border border-muted rounded-lg p-5 shadow-sm">
                  <h3 className="text-lg font-semibold text-primary">
                    {item.title}
                  </h3>
                  <p className="text-gray-700 mt-2">{item.theory}</p>
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-500">
                      Example(s):
                    </p>
                    <ul className="list-disc list-inside mt-1 text-gray-800">
                      {item.examples.map((ex, i) => (
                        <li key={i}>{ex}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
        {/* <p className="text-gray-700 text-base mb-8">
          Dưới đây là các điểm ngữ pháp cơ bản, trình bày theo cách dễ hiểu và có ví dụ minh họa.
        </p> */}
        <aside className="w-1/3 lg:w-1/4 sticky top-16 h-fit mt-4">
          <div className="bg-background border border-muted shadow-sm rounded-lg p-4">
            <h3 className="text-lg font-bold text-muted-foreground mb-3">
              Content
            </h3>
            <ul className="space-y-2 text-sm">
              {grammarData.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#section-${item.id}`}
                    className="text-primary hover:underline"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

type GrammarPoint = {
  id: string;
  title: string;
  theory: string;
  examples: string[];
  type: string;
};

const grammarData: GrammarPoint[] = [
  {
    id: "1",
    title: "N は N です",
    theory: "Câu khẳng định danh từ, dùng để giới thiệu bản thân hoặc sự vật.",
    examples: ["わたし は がくせい です。", "たなかさん は せんせい です。"],
    type: "Khẳng định",
  },
  {
    id: "2",
    title: "N は N じゃ ありません",
    theory: 'Câu phủ định danh từ, dùng để nói "không phải".',
    examples: ["これは にほんご の ほん じゃ ありません。"],
    type: "Phủ định",
  },
  {
    id: "3",
    title: "～か？",
    theory: "Câu hỏi nghi vấn, kết thúc bằng か.",
    examples: ["あなた は がくせい です か。"],
    type: "Nghi vấn",
  },
  {
    id: "4",
    title: "N の N",
    theory: 'Dùng để nói "của", kết nối 2 danh từ với nhau.',
    examples: ["これは わたし の かばん です。"],
    type: "Trợ từ",
  },
];
