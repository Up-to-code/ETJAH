"use client"
import { LoggedInState } from "@/components/home/logged-in-state"
import { ErrorState } from "@/components/home/error-state"
import { LoadingState } from "@/components/home/loading-state"
import { LoggedOutState } from "@/components/home/logged-out-state"
import { auth } from "@/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
 

export default function Home() {
  const [user, loading, error] = useAuthState(auth)

  if (loading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState message={error.message} />
  }

  if (!user) {
    return <LoggedOutState />
  }

  return <LoggedInState user={user} />
}

