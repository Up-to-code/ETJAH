"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageIcon, Film, Music, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useMediaItems } from "@/hooks/useMediaItems";
import MediaItem from "../MediaItem";
import { useAuth } from "@/hooks/useAuth";

export function MediaGallery() {
  const [filter, setFilter] = useState<"all" | "image" | "video" | "audio">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { mediaItems, loading, error } = useMediaItems();
  const { user } = useAuth();

  // Filter media based on selected type and search term
  const filteredMedia = mediaItems.filter(
    (item) =>
      (filter === "all" || item.type === filter) &&
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle loading state
  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  // Handle error state
  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        Error: {error.message}
      </div>
    );
  }

  // Handle empty state
  if (!filteredMedia.length) {
    return (
      <div className="text-center py-10 text-gray-500">
        No media found. Try a different filter or search term.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 md:mb-0 flex items-center">
          <Link href="/" className="mr-4">
            <Button variant="ghost" size="icon" aria-label="Go back">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          Media Gallery
        </h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search media..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          <Link href="/upload">
            <Button>Upload Media</Button>
          </Link>
        </div>
      </div>
      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" onClick={() => setFilter("all")}>
            All
          </TabsTrigger>
          <TabsTrigger value="image" onClick={() => setFilter("image")}>
            <ImageIcon className="w-4 h-4 mr-2" />
            Images
          </TabsTrigger>
          <TabsTrigger value="video" onClick={() => setFilter("video")}>
            <Film className="w-4 h-4 mr-2" />
            Videos
          </TabsTrigger>
          <TabsTrigger value="audio" onClick={() => setFilter("audio")}>
            <Music className="w-4 h-4 mr-2" />
            Audio
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMedia.map((item) => (
          <MediaItem
            key={item.id}
            item={{
              ...item,
              userId: user?.uid ?? "",
            }}
          />
        ))}
      </div>
    </div>
  );
}
