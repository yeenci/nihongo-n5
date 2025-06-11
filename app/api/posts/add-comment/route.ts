/* eslint-disable @typescript-eslint/no-explicit-any */
import { Post, Comment } from "@/app/redux/postSlice";
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
    const body = await req.json();
    const { postId, userEmail, text } = body;

    if (!postId) {
      return NextResponse.json(
        { message: "Post ID is required." },
        { status: 400 }
      );
    }
    if (!userEmail) {
      return NextResponse.json(
        { message: "User email is required to comment." },
        { status: 401 }
      );
    }
    if (!text || text.trim() === "") {
      return NextResponse.json(
        { message: "Comment text cannot be empty." },
        { status: 400 }
      );
    }

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
          { message: "Posts index not found. Cannot add comment." },
          { status: 404 }
        );
      }
      throw err;
    }

    const postIndex = allPostsData.findIndex((p) => p.id === postId);
    if (postIndex === -1) {
      return NextResponse.json(
        { message: `Post with ID ${postId} not found.` },
        { status: 404 }
      );
    }

    const postToUpdate = allPostsData[postIndex];

    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      userEmail: userEmail,
      text: text,
      commentedAt: new Date().toISOString(),
      status: "available",
    };

    if (!Array.isArray(postToUpdate.comments)) {
      postToUpdate.comments = [];
    }
    postToUpdate.comments.unshift(newComment);

    allPostsData[postIndex] = postToUpdate;
    await s3.send(
      new PutObjectCommand({
        Bucket: "nihongo-n5",
        Key: ALL_POSTS_KEY,
        Body: JSON.stringify(allPostsData, null, 2),
        ContentType: "application/json",
      })
    );

    return NextResponse.json(
      { message: "Comment added successfully!", comment: newComment },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in POST /api/posts/add-comment:", error);
    return NextResponse.json(
      { message: `Failed to add comment. ${error.message}` },
      { status: 500 }
    );
  }
}
