import {  firebase as db } from '.';
import { collection, addDoc, query, orderBy, limit, getDocs, DocumentData } from 'firebase/firestore';
import { Transaction, FinancialSummary } from '../types/financial';

const TRANSACTIONS_COLLECTION = 'transactions';

export async function getRecentTransactions(limitCount: number = 5): Promise<Transaction[]> {
  const transactionsCol = collection(db, TRANSACTIONS_COLLECTION);
  const recentTransactionsQuery = query(transactionsCol, orderBy('date', 'desc'), limit(limitCount));
  const transactionSnapshot = await getDocs(recentTransactionsQuery);
  
  return transactionSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Transaction));
}

export async function getFinancialSummary(): Promise<FinancialSummary> {
  const transactionsCol = collection(db, TRANSACTIONS_COLLECTION);
  const transactionSnapshot = await getDocs(transactionsCol);
  
  let totalIncome = 0;
  let totalExpenses = 0;

  transactionSnapshot.forEach((doc) => {
    const data = doc.data() as DocumentData;
    if (data.type === 'income') {
      totalIncome += data.amount;
    } else if (data.type === 'expense') {
      totalExpenses += data.amount;
    }
  });

  const netProfit = totalIncome - totalExpenses;

  return {
    totalIncome,
    totalExpenses,
    netProfit
  };
}

export async function addTransaction(transaction: Omit<Transaction, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, TRANSACTIONS_COLLECTION), transaction);
  return docRef.id;
}

