/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useLecturePartData } from "@/hooks/useLecturePartData";

export default function VocabularyPage() {
  const { data, loading } = useLecturePartData();

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
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
