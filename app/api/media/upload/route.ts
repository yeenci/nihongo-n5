// API routes to upload files
import B2 from "backblaze-b2";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const b2 = new B2({
    applicationKeyId: process.env.BACKBLAZE_KEY_ID!,
    applicationKey: process.env.BACKBLAZE_APP_KEY!,
  });

  await b2.authorize();
  const { data: uploadUrlData } = await b2.getUploadUrl({
    bucketId: process.env.BACKBLAZE_BUCKET_ID!,
  });

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const fileBuffer = Buffer.from(await file.arrayBuffer());

  const uploadResponse = await fetch(uploadUrlData.uploadUrl, {
    method: "POST",
    headers: {
      Authorization: uploadUrlData.authorizationToken,
      "X-Bz-File-Name": file.name,
      "Content-Type": file.type,
      "Content-Length": fileBuffer.length.toString(),
      "X-Bz-Content-Sha1": "do_not_verify",
    },
    body: fileBuffer,
  });

  const responseData = await uploadResponse.json();
  return NextResponse.json(responseData);
}

export const config = {
  api: { bodyParser: false },
};
