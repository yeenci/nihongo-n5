/* eslint-disable @typescript-eslint/no-explicit-any */
import { Post } from "@/app/redux/postSlice";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
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

const ALL_POSTS_KEY = "posts/all-posts.json";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const postId = Number(formData.get("postId"));
    const title = formData.get("title")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const tagsString = formData.get("tags")?.toString();

    let tags: string[] = [];
    if (tagsString) {
      tags = JSON.parse(tagsString);
    }

    if (!postId)
      return NextResponse.json(
        { message: "Post ID is required." },
        { status: 400 }
      );
    if (!email)
      return NextResponse.json(
        { message: "User email is required for authentication." },
        { status: 401 }
      );
    if (!title)
      return NextResponse.json(
        { message: "Title is required." },
        { status: 400 }
      );
    if (!description)
      return NextResponse.json(
        { message: "Description is required." },
        { status: 400 }
      );
    if (tags.length === 0)
      return NextResponse.json(
        { message: "At least one tag is required." },
        { status: 400 }
      );

    let allPostsData: Post[] = [];
    try {
      const command = new GetObjectCommand({
        Bucket: "nihongo-n5",
        Key: ALL_POSTS_KEY,
      });
      const response = await s3.send(command);
      const bodyString = await response.Body?.transformToString();
      if (bodyString) {
        allPostsData = JSON.parse(bodyString);
      }
    } catch (err: any) {
      if (err.name === "NoSuchKey") {
        return NextResponse.json(
          { message: "Posts index not found. Cannot edit." },
          { status: 404 }
        );
      }
      throw err;
    }

    // --- Find the post and authorize the user ---
    const postIndex = allPostsData.findIndex((p) => p.id === postId);
    if (postIndex === -1) {
      return NextResponse.json(
        { message: `Post with ID ${postId} not found.` },
        { status: 404 }
      );
    }

    const postToEdit = allPostsData[postIndex];

    // Ensure the user trying to edit is the original owner.
    if (postToEdit.email !== email) {
      return NextResponse.json(
        { message: "Forbidden: You are not the owner of this post." },
        { status: 403 }
      );
    }

    // --- Update the post data ---
    postToEdit.title = title;
    postToEdit.description = description;
    postToEdit.tags = tags;
    postToEdit.updatedAt = new Date().toISOString();
    postToEdit.status = "edited";

    allPostsData[postIndex] = postToEdit;

    await s3.send(
      new PutObjectCommand({
        Bucket: "nihongo-n5",
        Key: ALL_POSTS_KEY,
        Body: JSON.stringify(allPostsData, null, 2),
        ContentType: "application/json",
      })
    );

    return NextResponse.json(
      { message: "Post updated successfully!", post: postToEdit },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in POST /api/posts/edit-post:", error);
    return NextResponse.json(
      { message: `Failed to edit post. ${error.message}` },
      { status: 500 }
    );
  }
}
