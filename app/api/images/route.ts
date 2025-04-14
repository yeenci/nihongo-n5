import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
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

export async function GET() {
  try {
    const command = new ListObjectsV2Command({
      Bucket: "nihongo-n5",
      Prefix: "images/lectures/",
    });

    const result = await s3.send(command);
    const files =
      result.Contents?.filter((object) => object.Key?.endsWith(".png")) ?? [];

    const imageMap: { [id: string]: string } = {};

    for (const file of files) {
      const key = file.Key!;
      const id = key.split("/").pop()?.replace(".png", "") || key;
      // const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
      // imageMap[id] = `${baseUrl}/api/image/${encodeURIComponent(key.replace("images/lectures/", ""))}`
      imageMap[id] = `/api/image/${encodeURIComponent(
        key.replace("images/lectures/", "")
      )}`;
    }

    return NextResponse.json(imageMap);
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to fetch image list", { status: 500 });
  }
}
