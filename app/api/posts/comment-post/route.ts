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
  const { name, comment, user } = await req.json();
  if (!name || !comment || !user)
    return new Response("Missing data", { status: 400 });
  const commentKey = `posts/${name}/comments.json`;

  try {
    let comments: any[] = [];
    try {
      const res = await s3.send(
        new GetObjectCommand({
          Bucket: "nihongo-n5",
          Key: commentKey,
        })
      );
      const body = await res.Body?.transformToString();
      comments = JSON.parse(body || "[]");
    } catch (e) {
      console.error(e);
      comments = [];
    }

    comments.push({ user, comment, time: new Date().toISOString() });

    await s3.send(
      new PutObjectCommand({
        Bucket: "nihongo-n5",
        Key: commentKey,
        Body: JSON.stringify(comments, null, 2),
        ContentType: "application/json",
      })
    );

    return new Response("Comment added!", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Error commenting", { status: 500 });
  }
}
