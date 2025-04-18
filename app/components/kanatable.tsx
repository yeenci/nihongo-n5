import { Expand, Minimize2 } from "lucide-react";
import {
  column_headers,
  dakuon_labels,
  row_labels,
  yoon_headers,
  yoon_labels,
} from "../constants/alphabets";
import { speakJapanese } from "@/lib/speech";
import { useVoiceFemale } from "@/hooks/useVoice";

export default function KanaTable({
  title,
  alphabet,
  dakuon,
  yoon,
  onClick,
  isFocused,
  isHidden,
}: {
  title: string;
  alphabet: [string, string][][];
  dakuon: [string, string][][];
  yoon: [string, string][][];
  onClick: () => void;
  isFocused: boolean;
  isHidden: boolean;
}) {
  // const { speak } = useVoiceMale();
  const { femaleVoice } = useVoiceFemale();

  if (isHidden) return null;
  return (
    <div
      className={`border rounded-lg px-6 group w-full transition-all duration-300 ${
        isFocused ? "block" : ""
      }`}
    >
      <div className="flex justify-between items-center py-1 my-4">
        {/* Title */}
        <h2 className="text-xl xl:text-3xl font-semibold" onClick={onClick}>
          {title}{" "}
          <span className="text-muted-foreground text-xs xl:text-sm">
            (清音 - seion)
          </span>
        </h2>

        {/* Expand - Minimize */}
        {isFocused ? (
          <Minimize2
            className="text-muted group-hover:text-muted-foreground group-hover:cursor-pointer
          w-[16px] h-[16px] xl:w-[20px] xl:h-[20px]"
            onClick={onClick}
          />
        ) : (
          <Expand
            className="text-muted group-hover:text-muted-foreground group-hover:cursor-pointer
          w-[16px] h-[16px] xl:w-[20px] xl:h-[20px]"
            onClick={onClick}
          />
        )}
      </div>

      <div
        className={`flex flex-col md:flex-row w-full ${
          isFocused && "sm:gap-2 md:gap-6 lg:gap-16 xl:gap-10"
        }`}
      >
        {/* Kana Table */}
        <table className={`mb-4 ${isFocused ? "w-full md:w-3/5" : "w-full "}`}>
          <thead>
            <tr className="text-ring bg-muted ">
              {column_headers.map((header, index) => (
                <th
                  key={index}
                  className="p-2  py-4 font-medium text-base xl:text-2xl"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="border border-muted">
            {alphabet.map((row, rIndex) => (
              <tr key={rIndex}>
                <td className="py-2 px-1 text-center font-medium text-primary text-base xl:text-2xl border border-muted">
                  {row_labels[rIndex]}
                </td>
                {row.map(([kana, romaji], cIndex) => (
                  <td
                    key={cIndex}
                    className="text-center py-2 border border-muted cursor-pointer"
                    onClick={() => {
                      // speak(kana);
                      // speakJapanese(kana, femaleVoice ?? undefined);
                      speakJapanese(kana, femaleVoice ?? undefined);
                      // console.log("Speak " + kana);
                    }}
                  >
                    <div className="text-base xl:text-lg">{kana}</div>
                    <div className="text-xs xl:text-sm text-muted-foreground mt-[-4px]">
                      {romaji}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
            {isFocused && (
              <>
                {dakuon.map((row, rIndex) => (
                  <tr key={rIndex}>
                    <td className="py-2 px-1 text-center font-medium text-primary text-base xl:text-2xl border border-muted">
                      {dakuon_labels[rIndex]}
                    </td>
                    {row.map(([kana, romaji], cIndex) => (
                      <td
                        key={cIndex}
                        className="text-center py-2 border border-muted cursor-pointer"
                        onClick={() => {
                          // speak(kana);
                          speakJapanese(kana, femaleVoice ?? undefined);
                          // console.log("Speak " + kana);
                        }}
                      >
                        <div className="text-base xl:text-lg">{kana}</div>
                        <div className="text-xs xl:text-sm text-muted-foreground mt-[-4px]">
                          {romaji}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>

        {/* Yoon Table  */}
        {isFocused && (
          <table
            className={`border border-muted mb-4 ${
              isFocused && "w-full md:w-2/5"
            }`}
          >
            <thead>
              <tr className="text-ring bg-muted">
                {yoon_headers.map((header, index) => (
                  <th
                    key={index}
                    className="p-2 font-medium text-base xl:text-2xl"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {yoon.map((row, rIndex) => (
                <tr key={rIndex}>
                  <td className="py-2 px-1 text-center font-medium text-primary text-base xl:text-2xl border border-muted">
                    {yoon_labels[rIndex]}
                  </td>
                  {row.map(([kana, romaji], cIndex) => (
                    <td
                      key={cIndex}
                      className="text-center py-2 border border-muted cursor-pointer"
                      onClick={() => {
                        // speak(kana);

                        speakJapanese(kana, femaleVoice ?? undefined);
                        // console.log("Speak " + kana);
                      }}
                    >
                      <div className="text-base xl:text-lg">{kana}</div>
                      <div className="text-xs xl:text-sm text-muted-foreground mt-[-4px]">
                        {romaji}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
