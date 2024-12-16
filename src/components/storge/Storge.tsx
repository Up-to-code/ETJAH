"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
   TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import {firebase as db } from "@/firebase";
import { collection, getDocs, DocumentData } from "firebase/firestore";

// Define an interface for file data
interface FileData {
  id: string;
  name: string;
  size: number;
  type: string;
  key: string;
  url: string;
}

function TableFiles() {
  const [data, setData] = useState<FileData[]>([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const ref = collection(db, "files");
        const snapshot = await getDocs(ref);
        const filesData: FileData[] = snapshot.docs.map((doc) => {
          const data = doc.data() as DocumentData;
          return {
            id: doc.id,
            name: data.name,
            size: data.size,
            type: data.type,
            key: data.key,
            url: data.url
          };
        });
        setData(filesData);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, []);

  // Format file size to be more readable
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Table className="min-w-[800px]">
      <TableCaption>List of uploaded files</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>URL</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length > 0 ? (
          data.map((file) => (
            <TableRow key={file.id}>
              <TableCell className="font-medium">{file.name}</TableCell>
              <TableCell>{file.type}</TableCell>
              <TableCell>{formatFileSize(file.size)}</TableCell>
              <TableCell>
                <a 
                  href={file.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:underline"
                >
                  View File
                </a>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              No files available
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default TableFiles;