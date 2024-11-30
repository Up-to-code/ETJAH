"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { firebase as db } from "@/firebase";

export default function Middleware({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (loading) return; // Avoid running this logic while loading
    if (error) {
      console.error("Error with authentication:", error);
      return;
    }

    const checkAndCreateUser = async () => {
      if (!user) {
        router.push("/");
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const userSnapshot = await getDoc(userRef);

      if (!userSnapshot.exists()) {
        // User doesn't exist in the database, create a new one
        const userData = {
          name: user.displayName || "Anonymous",
          photoURL: user.photoURL || "",
          type: "user",
          createdAt: new Date(),
        };

        await setDoc(userRef, userData);
        console.log("New user added to database:", userData);
      } else {
        console.log("User already exists in the database.");
      }
    };

    checkAndCreateUser();
  }, [user, loading, error, router]);

  return <>{children}</>;
}
