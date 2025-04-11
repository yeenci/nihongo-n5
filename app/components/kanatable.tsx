import { Expand } from "lucide-react";
import { column_headers, row_labels } from "../constants/alphabets";

export default function KanaTable({
  title,
  alphabet,
}: {
  title: string;
  alphabet: [string, string][][];
}) {
  return (
    <div className="border rounded-lg px-6">
      <div className="flex justify-between items-center py-1 my-4">
        <h2 className="text-xl font-semibold">
          {title}{" "}
          <span className="text-muted-foreground text-xs">(清音 - seion)</span>
        </h2>
        <Expand size={16} className="text-muted hover:text-muted-foreground" />
      </div>
      <table className="w-full border border-muted mb-4">
        {/* <thead className="border-b border-b-muted"> */}
        <thead>
          <tr className="text-ring">
            {column_headers.map((header, index) => (
              <th key={index} className="p-2 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {alphabet.map((row, rIndex) => (
            <tr key={rIndex}>
              <td className="py-2 px-1 text-center font-medium text-primary">
                {row_labels[rIndex]}
              </td>
              {row.map(([kana, romaji], cIndex) => (
                <td key={cIndex} className="text-center py-2">
                  <div className="text-base">{kana}</div>
                  <div className="text-xs text-muted-foreground mt-[-2px]">
                    {romaji}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
