"use client"

import { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useTasks, Task } from '@/hooks/useTasks'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Trash2 } from 'lucide-react'
import { auth } from '@/firebase'
import { User } from 'firebase/auth'

export default function TasksPage() {
  const [user, userLoading, userError] = useAuthState(auth)
  const { tasks, loading, error, addTask, toggleTask, deleteTask } = useTasks(user as User)
  const [newTaskTitle, setNewTaskTitle] = useState('')

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle.trim())
      setNewTaskTitle('')
    }
  }

  if (userLoading || loading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  if (userError || error) {
    return <div className="text-center text-red-500 mt-4">Error: {userError?.message || error?.message}</div>
  }

  if (!user) {
    return <div className="text-center mt-4">Please sign in to view your tasks.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Tasks for {user.displayName || user.email}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
            <Input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Enter a new task"
              className="flex-grow"
            />
            <Button type="submit">Add Task</Button>
          </form>
          <ul className="space-y-2">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
              />
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

function TaskItem({ task, onToggle, onDelete }: { task: Task; onToggle: (id: string, completed: boolean) => void; onDelete: (id: string) => void }) {
  return (
    <li className="flex items-center gap-2">
      <Checkbox
        id={task.id}
        checked={task.completed}
        onCheckedChange={(checked) => onToggle(task.id, checked as boolean)}
      />
      <label
        htmlFor={task.id}
        className={`flex-grow ${task.completed ? 'line-through text-gray-500' : ''}`}
      >
        {task.title}
      </label>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(task.id)}
        aria-label="Delete task"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </li>
  )
}

