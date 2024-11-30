import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Download, Film, Music, X } from "lucide-react";
import Image from "next/image";
import { doc, getDoc } from "firebase/firestore";
import { firebase as db } from "@/firebase";

interface MediaItem {
  id: string;
  title: string;
  url: string;
  type: "image" | "video" | "audio";
  userId: string; // Added userId
}

function MediaItem({ item }: { item: MediaItem }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [userData, setUserData] = useState<{ name: string; avatar: string } | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const getFileExtension = (type: MediaItem["type"]): string => {
    switch (type) {
      case "image":
        return "jpg";
      case "video":
        return "mp4";
      case "audio":
        return "mp3";
      default:
        return "bin";
    }
  };

  const handleDownload = async () => {
    if (!item.url) {
      console.error("No URL provided for download");
      return;
    }

    setIsDownloading(true);
    try {
      const link = document.createElement("a");
      link.href = item.url;
      link.download = `${item.title}.${getFileExtension(item.type)}`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  // Fetch user data based on userId
  useEffect(() => {
    const fetchUserData = async () => {
      setLoadingUser(true);
      try {
        const userDoc = await getDoc(doc(db, "users", item.userId));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData({ name: data.name, avatar: data.photoURL });
        } else {
          console.error("User not found");
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserData();
  }, [item.userId]);

  return (
    <Card>
      {/* User Info */}
      <div className="flex items-center space-x-4 p-4 border-b">
        {loadingUser ? (
          <div className="w-full flex items-center justify-center">Loading user...</div>
        ) : userData ? (
          <>
            <Image
              src={userData.avatar}
              alt={userData.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="font-semibold text-gray-800">{userData.name}</span>
          </>
        ) : (
          <span className="text-sm text-gray-500">User not found</span>
        )}
      </div>

      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Dialog>
          <DialogTrigger asChild>
            <div className="cursor-pointer">
              {item.type === "image" && (
                <Image
                  src={item.url}
                  alt={item.title}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover rounded-md"
                />
              )}
              {item.type === "video" && (
                <div className="relative w-full h-48 bg-gray-200 flex items-center justify-center rounded-md">
                  <Film className="w-12 h-12 text-gray-400" />
                </div>
              )}
              {item.type === "audio" && (
                <div className="relative w-full h-48 bg-gray-200 flex items-center justify-center rounded-md">
                  <Music className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px]">
            <div className="relative">
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 rounded-full"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </Button>
              </DialogTrigger>
            </div>
            {item.type === "image" && (
              <Image
                src={item.url}
                alt={item.title}
                width={800}
                height={600}
                className="w-full h-auto rounded-lg"
              />
            )}
            {item.type === "video" && (
              <video controls className="w-full h-auto rounded-lg">
                <source src={item.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            {item.type === "audio" && (
              <audio controls className="w-full">
                <source src={item.url} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            )}
            <h2 className="text-2xl font-bold mt-4">{item.title}</h2>
          </DialogContent>
        </Dialog>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Label className="text-sm text-gray-600 capitalize">{item.type}</Label>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleDownload()}
          disabled={isDownloading}
        >
          {isDownloading ? (
            "Downloading..."
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Download
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default MediaItem;
