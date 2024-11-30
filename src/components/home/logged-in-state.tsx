/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { User } from "firebase/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, ListTodo,  FileText, Settings, CreditCard } from 'lucide-react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firebase as db } from "@/firebase";

export function LoggedInState({ user }: { user: User }) {
  const [taskCount, setTaskCount] = useState(0);
  const [contactCount, setContactCount] = useState(0);
  const [fileCount, setFileCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      // Fetch task count
      const taskQuery = query(collection(db, "tasks"), where("userId", "==", user.uid));
      const taskSnapshot = await getDocs(taskQuery);
      setTaskCount(taskSnapshot.size);

      // Fetch contact count (assuming you have a 'contacts' collection)
      const contactQuery = query(collection(db, "users", user.uid , "transactions"));
      const contactSnapshot = await getDocs(contactQuery);
      setContactCount(contactSnapshot.size);

      // Fetch file count (assuming you have a 'mediaItems' collection)
      const fileQuery = query(collection(db, "mediaItems"), where("userId", "==", user.uid));
      const fileSnapshot = await getDocs(fileQuery);
      setFileCount(fileSnapshot.size);
    };

    fetchCounts();
  }, [user.uid]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.displayName || user.email}!</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Tasks"
          description="Manage your to-do list"
          icon={<ListTodo className="h-6 w-6" />}
          content={`You have ${taskCount} tasks pending`}
          linkHref="/tasks"
          linkText="Go to Tasks"
        />
        <DashboardCard
          title="accountant"
          description="Your accountant dashboard"
          icon={<CreditCard className="h-6 w-6" />}
          content={`You have ${contactCount} contacts`}
          linkHref="/accountant"
          linkText="Go to Accountant"
        />
 
        <DashboardCard
          title="Files"
          description="Your media library"
          icon={<FileText className="h-6 w-6" />}
          content={`You have ${fileCount} files`}
          linkHref="/media"
          linkText="Go to Media"
        />
        {/* <DashboardCard
          title="Settings"
          description="Customize your experience"
          icon={<Settings className="h-6 w-6" />}
          content="Update your profile and preferences"
          linkHref="/settings"
          linkText="Open Settings"
        /> */}
      </div>
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  content: string;
  linkHref: string;
  linkText: string;
}

function DashboardCard({ title, description, icon, content, linkHref, linkText }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{content}</p>
      </CardContent>
      <CardFooter>
        <Link href={linkHref} passHref>
          <Button variant="ghost" className="w-full justify-between">
            {linkText}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
