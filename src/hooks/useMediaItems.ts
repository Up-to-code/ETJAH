import { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { firebase as db } from '@/firebase/index';

export interface MediaItem {
  id: string;
  title: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  createdAt: Date;
}

export function useMediaItems() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'mediaItems'));
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const items: MediaItem[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as MediaItem);
        });
        setMediaItems(items);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { mediaItems, loading, error };
}
