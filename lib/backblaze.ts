// This is for Backblaze API
import B2 from "backblaze-b2"

const b2 = new B2({
    applicationKeyId: process.env.BACKBLAZE_KEY_ID!,
    applicationKey: process.env.BACKBLAZE_APP_KEY!,
});

export async function listFiles(bucketId: string) {
    await b2.authorize();
    const {data} = await b2.listFileNames({
        bucketId,
        startFileName: "",
        maxFileCount: 0,
        delimiter: "",
        prefix: ""
    })
    return data
}