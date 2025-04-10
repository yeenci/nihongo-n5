import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { text } = await req.json();

  try {
    const res = await fetch(
      `https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(
        text
      )}`
    );
    const data = await res.json();

    const firstEntry = data.data?.[0];
    const reading = firstEntry?.japanese?.[0]?.reading || "";
    const meaningList = firstEntry?.senses?.[0]?.english_definitions || [];
    const meaning = meaningList.join(", ");

    return NextResponse.json({ reading, meaning });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch data from Jisho" },
      { status: 500 }
    );
  }
}
