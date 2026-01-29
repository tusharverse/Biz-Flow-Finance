
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: Date;
  client?: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions = ({ transactions }: RecentTransactionsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your latest financial activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${
                  transaction.type === 'income' 
                    ? 'bg-green-100 text-finance-green' 
                    : 'bg-red-100 text-finance-red'
                }`}>
                  {transaction.type === 'income' 
                    ? <ArrowUpRight size={16} /> 
                    : <ArrowDownLeft size={16} />
                  }
                </div>
                <div>
                  <p className="text-sm font-medium">{transaction.description}</p>
                  {transaction.client && (
                    <p className="text-xs text-muted-foreground">{transaction.client}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(transaction.date, { addSuffix: true })}
                  </p>
                </div>
              </div>
              <p className={`font-medium ${
                transaction.type === 'income' 
                  ? 'text-finance-green' 
                  : 'text-finance-red'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}
                ${Math.abs(transaction.amount).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
