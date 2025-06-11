/* eslint-disable prefer-const */
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
    const { postId, commentId, userEmail } = body;

    if (!postId || !commentId || !userEmail) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    let allPosts: Post[] = JSON.parse(
      (await (
        await s3.send(
          new GetObjectCommand({ Bucket: "nihongo-n5", Key: ALL_POSTS_KEY })
        )
      ).Body?.transformToString()) || "[]"
    );
    const postIndex = allPosts.findIndex((p) => p.id === postId);
    if (postIndex === -1)
      return NextResponse.json({ message: "Post not found." }, { status: 404 });

    const commentIndex = allPosts[postIndex].comments.findIndex(
      (c) => c.id === commentId
    );
    if (commentIndex === -1)
      return NextResponse.json(
        { message: "Comment not found." },
        { status: 404 }
      );

    const commentToDelete = allPosts[postIndex].comments[commentIndex];
    if (commentToDelete.userEmail !== userEmail)
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });

    commentToDelete.status = "deleted";
    allPosts[postIndex].comments[commentIndex] = commentToDelete;

    await s3.send(
      new PutObjectCommand({
        Bucket: "nihongo-n5",
        Key: ALL_POSTS_KEY,
        Body: JSON.stringify(allPosts, null, 2),
      })
    );

    return NextResponse.json({ message: "Comment deleted." }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
