import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

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
  try {
    const res = await s3.send(new GetObjectCommand({
      Bucket: "nihongo-n5",
      Key: "posts/index.json",
    }));

    const body = await res.Body?.transformToString();
    const json = body ? JSON.parse(body) : [];

    return Response.json(json);
  } catch (error) {
    console.error("Failed to fetch index.json", error);
    return new Response("Error fetching index", { status: 500 });
  }
}