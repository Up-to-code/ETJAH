import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { firebase as db } from '@/firebase/index';
import { User } from 'firebase/auth';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  userId: string;
}

export function useTasks(user: User | null) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'tasks'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const taskList: Task[] = [];
        querySnapshot.forEach((doc) => {
          taskList.push({ id: doc.id, ...doc.data() } as Task);
        });
        setTasks(taskList);
        setLoading(false);
      },
      (err: Error) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const addTask = async (title: string) => {
    if (!user) return;
    await addDoc(collection(db, 'tasks'), {
      title,
      completed: false,
      userId: user.uid,
    });
  };

  const toggleTask = async (taskId: string, completed: boolean) => {
    await updateDoc(doc(db, 'tasks', taskId), { completed });
  };

  const deleteTask = async (taskId: string) => {
    await deleteDoc(doc(db, 'tasks', taskId));
  };

  return { tasks, loading, error, addTask, toggleTask, deleteTask };
}

