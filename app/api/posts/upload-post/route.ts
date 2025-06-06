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

const ALL_POSTS_KEY = "posts/all-posts.json";
const RESOURCES_BASE_PATH = "resources/";

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
    const filesToUpload = formData.getAll("resources") as File[];

    if (!title) {
      return NextResponse.json(
        { error: "Title is required." },
        { status: 400 }
      );
    }
    if (!description) {
      return NextResponse.json(
        { error: "Description is required." },
        { status: 400 }
      );
    }
    if (!tagsString || tags.length === 0) {
      return NextResponse.json(
        { error: "Tags are required." },
        { status: 400 }
      );
    }
    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const timestamp = getCurrentTimestamp();
    const postIdName = `post-${timestamp}`;
    const isoCreatedAt = new Date().toISOString();
    const uploadedResources: string[] = [];

    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
      const fileExtension = file.name.split(".").pop() || "";
      const uniqueFilename = `${postIdName}-${i + 1}${
        fileExtension ? "." + fileExtension : ""
      }`;
      const resourceKey = `${RESOURCES_BASE_PATH}${uniqueFilename}`;

      const arrayBuffer = await file.arrayBuffer();
      await s3.send(
        new PutObjectCommand({
          Bucket: "nihongo-n5",
          Key: `posts/${resourceKey}`,
          Body: new Uint8Array(arrayBuffer),
          ContentType: file.type || "application/octet-stream",
        })
      );
      uploadedResources.push(uniqueFilename);
    }

    // --- Update all-posts.json ---
    let allPostsData: Post[] = [];

    try {
      const getObjectCmd = new GetObjectCommand({
        Bucket: "nihongo-n5",
        Key: ALL_POSTS_KEY,
      });
      const response = await s3.send(getObjectCmd);
      const bodyString = await response.Body?.transformToString();

      if (bodyString) {
        try {
          allPostsData = JSON.parse(bodyString);
        } catch (parseError) {
          console.error(
            `Error parsing existing "${allPostsData}":`,
            parseError,
            "Body was:",
            bodyString
          );
          return NextResponse.json(
            {
              error: `Failed to parse existing posts data. ${
                (parseError as Error).message
              }`,
            },
            { status: 500 }
          );
        }
      }
    } catch (err: any) {
      if (err.name === "NoSuchKey") {
        console.log(
          `File "${allPostsData}" not found. A new one will be created.`
        );
        return NextResponse.json([], { status: 200 });
      } else {
        console.error(`Error fetching "${allPostsData}":`, err);
        return NextResponse.json(
          { error: `Failed to retrieve posts index. ${err.message}` },
          { status: 500 }
        );
      }
    }

    // const contentJson = {
    //   title,
    //   description,
    //   tags,
    //   email,
    //   createdAt: isoCreatedAt,
    // };


    const newId =
      allPostsData.length > 0
        ? Math.max(0, ...allPostsData.map((post) => post.id)) + 1
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
      comments: [],
      resourceFileNames: uploadedResources.length > 0 ? uploadedResources : undefined,
    };

    allPostsData.push(newPostEntry);

    // Upload the updated all-posts.json
    await s3.send(
      new PutObjectCommand({
        Bucket: "nihongo-n5",
        Key: ALL_POSTS_KEY,
        Body: JSON.stringify(allPostsData, null, 2),
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
