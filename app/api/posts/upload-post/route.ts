/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Post } from "@/app/redux/postSlice";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

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

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const title = formData.get("title")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const tagsString = formData.get("tags")?.toString();
    let tags: string[] = [];
    if (tagsString) {
      try {
        tags = JSON.parse(tagsString);
        if (!Array.isArray(tags)) tags = [];
      } catch (e) {
        console.warn(
          "Failed to parse tags, defaulting to empty array:",
          tagsString
        );
        tags = [];
      }
    }
    const files = formData.getAll("resources") as File[];

    if (!title) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }
    if (!description) { // Made description mandatory as per your previous code
      return NextResponse.json({ error: "Description is required." }, { status: 400 });
    }
    if (!tagsString || tags.length === 0) { // Made tags mandatory
      return NextResponse.json({ error: "Tags are required." }, { status: 400 });
    }
    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const timestamp = getCurrentTimestamp();
    const postIdName = `post-${timestamp}`;
    const postFolder = `posts/${postIdName}/`;
    const isoCreatedAt = new Date().toISOString();

    const contentJson = {
      title,
      description,
      tags,
      email,
      createdAt: isoCreatedAt,
    };

    // Upload content.json, comments.json, and resource files
    // (Assuming this part is correct and not causing early returns for this specific error)
    await s3.send(
      new PutObjectCommand({
        Bucket: "nihongo-n5",
        Key: `${postFolder}content.json`,
        Body: JSON.stringify(contentJson, null, 2),
        ContentType: "application/json",
      })
    );
    await s3.send(
      new PutObjectCommand({
        Bucket: "nihongo-n5",
        Key: `${postFolder}comments.json`,
        Body: JSON.stringify([]),
        ContentType: "application/json",
      })
    );
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      await s3.send(
        new PutObjectCommand({
          Bucket: "nihongo-n5",
          Key: `${postFolder}resources/${file.name}`,
          Body: new Uint8Array(arrayBuffer),
          ContentType: file.type || "application/octet-stream",
        })
      );
    }

    // --- Update all-posts.json ---
    const indexKey = `posts/all-posts.json`;
    let indexData: Post[] = [];

    try {
      const getObjectCmd = new GetObjectCommand({
        Bucket: "nihongo-n5",
        Key: indexKey,
      });
      const response = await s3.send(getObjectCmd);
      const bodyString = await response.Body?.transformToString();

      if (bodyString) {
        try {
          indexData = JSON.parse(bodyString);
        } catch (parseError) {
          console.error(
            `Error parsing existing "${indexKey}":`,
            parseError,
            "Body was:",
            bodyString
          );
          return NextResponse.json( // RETURN here if parsing fails
            {
              error: `Failed to parse existing posts index. ${
                (parseError as Error).message
              }`,
            },
            { status: 500 }
          );
        }
      }
    } catch (err: any) { // This catch is ONLY for errors from s3.send(getObjectCmd)
      if (err.name === "NoSuchKey") {
        console.log(`File "${indexKey}" not found. A new one will be created.`);
        // indexData remains empty, which is correct. Execution continues below.
      } else {
        // For other S3 errors during fetch
        console.error(`Error fetching "${indexKey}":`, err);
        return NextResponse.json( // RETURN here for other S3 fetch errors
          { error: `Failed to retrieve posts index. ${err.message}` },
          { status: 500 }
        );
      }
    }

    // THIS SECTION NOW EXECUTES REGARDLESS OF THE GetObjectCommand OUTCOME (if no hard error occurred)
    const newId =
      indexData.length > 0
        ? Math.max(0, ...indexData.map((post) => post.id)) + 1
        : 1;

    const newPostEntry: Post = {
      id: newId,
      name: postIdName,
      title: title,
      description: description,
      email: email,
      likes: [],
      status: "available",
      reports: [],
      createdAt: isoCreatedAt,
      tags: tags,
    };

    indexData.push(newPostEntry);

    // Upload the updated all-posts.json
    await s3.send(
      new PutObjectCommand({
        Bucket: "nihongo-n5",
        Key: indexKey,
        Body: JSON.stringify(indexData, null, 2),
        ContentType: "application/json",
      })
    );

    // FINAL SUCCESS RESPONSE
    return NextResponse.json(
      {
        message: "Post uploaded successfully!",
        postId: newId,
        postName: postIdName,
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Overall error in POST /api/posts/upload-post:", error);
    return NextResponse.json(
      { error: `Failed to upload post. ${error.message}` },
      { status: 500 }
    );
  }
}