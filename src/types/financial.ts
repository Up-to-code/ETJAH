export interface Transaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    type: 'income' | 'expense';
  }
  
  export interface FinancialSummary {
    totalIncome: number;
    totalExpenses: number;
    netProfit: number;
  }
  
  