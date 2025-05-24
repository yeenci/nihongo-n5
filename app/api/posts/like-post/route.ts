/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
  endpoint: "https://s3.us-west-004.backblazeb2.com",
  region: "us-west-004",
  credentials: {
    accessKeyId: process.env.B2_KEY_ID!,
    secretAccessKey: process.env.B2_APP_KEY!,
  },
  forcePathStyle: true,
});

export async function POST(req: Request) {
  const { name, email } = await req.json();
  if (!name || !email) return new Response("Missing data", { status: 400 });
  const indexKey = `posts/index.json`;

  try {
    const res = await s3.send(
      new GetObjectCommand({
        Bucket: "nihongo-n5",
        Key: indexKey,
      })
    );
    const body = await res.Body?.transformToString();
    const indexData = JSON.parse(body || "[]");

    const post = indexData.find((p: any) => p.name === name);
    if (!post) return new Response("Post not found", { status: 404 });

    if (!post.likes.includes(email)) {
      post.likes.push(email);
    }

    await s3.send(
      new PutObjectCommand({
        Bucket: "nihongo-n5",
        Key: indexKey,
        Body: JSON.stringify(indexData, null, 2),
        ContentType: "application/json",
      })
    );

    return new Response("Liked!", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Error liking post", { status: 500 });
  }
}
