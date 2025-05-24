/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
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

function getCurrentTimestamp() {
  return Date.now();
}

// Email in Firestore !!!!!!!!!!!!!!!!!!
export async function POST(req: Request) {
  const formData = await req.formData();
  const title = formData.get("title")?.toString() || "";
  const description = formData.get("description")?.toString() || "";
  const email = formData.get("email")?.toString() || "";
  const tags = JSON.parse(formData.get("tags")?.toString() || "[]");
  const files = formData.getAll("resources") as File[];

  const timestamp = getCurrentTimestamp();
  const postFolder = `posts/post-${timestamp}/`;

  const contentJson = {
    title,
    description,
    tags,
    email,
    createdAt: new Date().toISOString(),
  };

  // Upload content.json
  await s3.send(
    new PutObjectCommand({
      Bucket: "nihongo-n5",
      Key: `${postFolder}content.json`,
      Body: JSON.stringify(contentJson),
      ContentType: "application/json",
    })
  );

  // Upload empty comments.json
  await s3.send(
    new PutObjectCommand({
      Bucket: "nihongo-n5",
      Key: `${postFolder}comments.json`,
      Body: JSON.stringify([]),
      ContentType: "application/json",
    })
  );

  // Upload each file
  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    await s3.send(
      new PutObjectCommand({
        Bucket: "nihongo-n5",
        Key: `${postFolder}resources/${file.name}`,
        Body: new Uint8Array(arrayBuffer),
        ContentType: file.type,
      })
    );
  }

  // Update index.json
  const indexKey = `posts/index.json`;
  let indexData: any[] = [];

  try {
    const res = await s3.send(
      new GetObjectCommand({
        Bucket: "nihongo-n5",
        Key: indexKey,
      })
    );
    const body = await res.Body?.transformToString();
    if (body) indexData = JSON.parse(body);
  } catch (e) {
    console.log("index.json not found, will create a new one.");
  }

  const newId = indexData.length ? indexData[indexData.length - 1].id + 1 : 1;

  indexData.push({
    id: newId,
    name: `post-${timestamp}`,
    email,
    likes: [],
    reports: [],
    status: "available",
  });

  await s3.send(
    new PutObjectCommand({
      Bucket: "nihongo-n5",
      Key: indexKey,
      Body: JSON.stringify(indexData, null, 2),
      ContentType: "application/json",
    })
  );

  return new Response("Post uploaded successfully!", { status: 200 });
}
