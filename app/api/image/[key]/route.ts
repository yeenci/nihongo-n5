/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

const s3 = new S3Client({
  endpoint: "https://s3.us-west-004.backblazeb2.com",
  region: "us-west-004",
  credentials: {
    accessKeyId: process.env.B2_KEY_ID!,
    secretAccessKey: process.env.B2_APP_KEY!,
  },
  forcePathStyle: true,
});

export async function GET(request: NextRequest,
  context: any) {
  // const key = searchParams.get("key");
  // const key = params.key;
  // const key = context.params;
  const key = context.params.key;

  if (!key) {
    console.log("Missing key: ", key)
    return new NextResponse("Missing key", { status: 400 });
  }

  try {
    const command = new GetObjectCommand({
      Bucket: "nihongo-n5",
      Key: `images/lectures/${key}`,
    });

    const response = await s3.send(command);
    const stream = response.Body as ReadableStream;

    return new NextResponse(stream, {
      status: 200,
      headers: {
        "Content-Type": response.ContentType || "image/png",
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    return new NextResponse("Image fetch error", { status: 500 });
  }
}
