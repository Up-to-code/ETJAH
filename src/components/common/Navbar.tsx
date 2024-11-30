"use client";

import { useState } from "react";
import { auth } from "@/firebase";
import { GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { Bell, Menu, Search, Settings, UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

function Navbar() {
  const [user, loading, error] = useAuthState(auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleGoogleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const handleSignOut = () => {
    auth.signOut();
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <span className="text-2xl font-bold">ETJAH</span>
            </Link>
          </div>

          <div className="hidden md:block">
            {/* <div className="ml-4 flex items-center md:ml-6">
              <form className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  className="w-full bg-gray-100 pl-8 pr-4"
                  placeholder="Search..."
                  type="search"
                />
              </form>
            </div> */}
          </div>

          <div className="hidden md:block">
            {loading && <Skeleton className="h-10 w-[200px]" />}
            {error && <div>Error: {error.message}</div>}
            {!loading && !error && (
              <>
                {user ? (
                  <UserMenu user={user} onSignOut={handleSignOut} />
                ) : (
                  <Button onClick={handleGoogleSignIn}>
                    Sign in with Google
                  </Button>
                )}
              </>
            )}
          </div>

          <div className="flex md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 py-4">
                  <form className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      className="w-full bg-gray-100 pl-8 pr-4"
                      placeholder="Search..."
                      type="search"
                    />
                  </form>
                  {loading && <Skeleton className="h-10 w-full" />}
                  {error && <div>Error: {error.message}</div>}
                  {!loading && !error && (
                    <>
                      {user ? (
                        <>
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarImage src={user.photoURL || undefined} />
                              <AvatarFallback>
                                {user.displayName?.[0] || <UserIcon />}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">
                                {user.displayName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {user.email}
                              </p>
                            </div>
                          </div>
                          <Button onClick={handleSignOut} className="w-full">
                            Sign out
                          </Button>
                        </>
                      ) : (
                        <Button onClick={handleGoogleSignIn} className="w-full">
                          Sign in with Google
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

function UserMenu({ user, onSignOut }: { user: User; onSignOut: () => void }) {
  return (
    <div className="flex items-center space-x-4">
      <Button variant="ghost" size="icon">
        <Bell className="h-5 w-5" />
        <span className="sr-only">Notifications</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={user.photoURL || undefined}
                alt={user.displayName || "User avatar"}
              />
              <AvatarFallback>
                {user.displayName?.[0] || <UserIcon />}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user.displayName}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onSignOut}>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default Navbar;
