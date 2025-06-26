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
    const body = await req.json();
    const { postId, userEmail } = body;

    if (!postId || !userEmail) {
      return NextResponse.json(
        { message: "Post ID and User Email are required." },
        { status: 400 }
      );
    }

    const command = new GetObjectCommand({
      Bucket: "nihongo-n5",
      Key: ALL_POSTS_KEY,
    });
    const response = await s3.send(command);
    const allPosts: Post[] = JSON.parse(
      (await response.Body?.transformToString()) || "[]"
    );

    const postIndex = allPosts.findIndex((p) => p.id === postId);
    if (postIndex === -1) {
      return NextResponse.json({ message: "Post not found." }, { status: 404 });
    }

    // Authorization: Check if the user is the post owner
    if (allPosts[postIndex].email !== userEmail) {
      return NextResponse.json(
        { message: "Forbidden: You are not the owner of this post." },
        { status: 403 }
      );
    }

    // Restore the post status
    allPosts[postIndex].status = "available"; // Or 'edited' if you want to preserve that state
    allPosts[postIndex].updatedAt = new Date().toISOString();

    await s3.send(
      new PutObjectCommand({
        Bucket: "nihongo-n5",
        Key: ALL_POSTS_KEY,
        Body: JSON.stringify(allPosts, null, 2),
      })
    );

    return NextResponse.json(
      { message: "Post has been restored." },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to restore post." },
      { status: 500 }
    );
  }
}
