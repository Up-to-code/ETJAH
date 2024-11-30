/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, ChangeEvent, FormEvent } from "react"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { addDoc, collection } from "firebase/firestore"
import { firebase as db, storage } from "@/firebase"
import { useRouter } from "next/navigation"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface UploadProps {
  user: {
    uid: string
  }
}

type MediaType = "image" | "video" | "audio"

const Upload: React.FC<UploadProps> = ({ user }) => {
  const [title, setTitle] = useState<string>("")
  const [type, setType] = useState<MediaType>("image")
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState<boolean>(false)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [error, setError] = useState<string>("")
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false)
  const router = useRouter()

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) {
      setError("Please select a file to upload.")
      return
    }
    setUploadProgress(0)
    setUploading(true)
    setError("")
    setUploadSuccess(false)

    const storageRef = ref(storage, `media/${user.uid}/${Date.now()}_${file.name}`)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setUploadProgress(progress)
      },
      (error) => {
        console.error("Upload error: ", error)
        setError("An error occurred while uploading. Please try again.")
        setUploading(false)
      },
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref)
          await addDoc(collection(db, "mediaItems"), {
            title,
            type,
            url,
            userId: user.uid,
            createdAt: new Date()
          })
          setUploadSuccess(true)
          setUploadProgress(100)
          setTimeout(() => router.push("/media"), 2000)
        } catch (error) {
          console.error("Error adding document: ", error)
          setError("An error occurred while saving the file information. Please try again.")
        } finally {
          setUploading(false)
        }
      }
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Upload Media</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={type}
              onValueChange={(value: MediaType) => setType(value)}
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="file" className="cursor-pointer">Choose File</Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
              required
            />
          </div>
          {error && (
            <Alert variant="destructive" className="mt-2" aria-live="assertive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {uploadSuccess && (
            <Alert className="mt-2" aria-live="polite">
              <AlertDescription>Upload successful!</AlertDescription>
            </Alert>
          )}
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Uploading...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}
          <Button type="submit" className="w-full mt-4" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default Upload
