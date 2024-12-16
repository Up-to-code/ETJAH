"use client";
 import { UploadDropzone } from "@/lib/uploadthing";
import { addDoc, collection } from "firebase/firestore";
import { ClientUploadedFileData } from "uploadthing/types";
  import { firebase as db } from "@/firebase";
import TableFiles from "@/components/storge/Storge";

  const PushFilesToDB = (res: ClientUploadedFileData<{
    uploadedBy: string;
  }>[]) => { 
     const ref = collection(db, "files");
     res.forEach(async (file) => {
      await addDoc(ref ,{
         name : file.name,
         size : file.size,
         type : file.type,
         key : file.key,
         url  : file.url,
      })
    });
  };


 export default function Home() {




  return (
    <main className="flex min-h-screen flex-col items-center ">
      <UploadDropzone
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res);
          alert("Upload Completed");
          PushFilesToDB(res);
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
      <div className="max-w-[800px]">
        <TableFiles />
      </div>
    </main>
  );
}
