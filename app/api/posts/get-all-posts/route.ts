/* eslint-disable @typescript-eslint/no-explicit-any */
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { Readable } from "stream";

const s3 = new S3Client({
  endpoint: "https://s3.us-west-004.backblazeb2.com",
  region: "us-west-004",
  credentials: {
    accessKeyId: process.env.B2_KEY_ID!,
    secretAccessKey: process.env.B2_APP_KEY!,
  },
  forcePathStyle: true,
});

export async function GET() {
  const key = "posts/all-posts.json";

  try {
    const command = new GetObjectCommand({
      Bucket: "nihongo-n5",
      Key: key,
    });

    const result = await s3.send(command);
    const stream = result.Body as Readable;
    const chunks: any[] = [];

    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    const json = JSON.parse(Buffer.concat(chunks).toString("utf-8"));
    return NextResponse.json(json);
  } catch (error) {
    console.error("Failed to fetch all-posts.json", error);
    return new Response("Error fetching all posts", { status: 500 });
  }
}
