import { BookOpenText, Text } from "lucide-react";
import React from "react";

interface TOCProps {
  groups: string[];
  scrollRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
}

export default function TOC({ groups, scrollRefs }: TOCProps) {
  return (
    <div>
      {/* Table of Content - Desktop */}
      <div className="block w-fit sticky top-6 self-start space-y-2">
        <h2 className="font-semibold text-base flex gap-2">
          <BookOpenText width={20} height={20} /> Table of Content
        </h2>
        {groups.map((group) => (
          <div
            key={group}
            className="flex text-sm text-left cursor-pointer items-center justify-start gap-2 px-2 hover:underline"
            onClick={() =>
              scrollRefs.current[group]?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <Text width={15} height={15} /> {group}
          </div>
        ))}
      </div>
    </div>
  );
}
