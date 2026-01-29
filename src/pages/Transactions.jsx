import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from "@/components/dashboard/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, TrendingUp, TrendingDown, MoreHorizontal, X, Check, AlertCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";



const Transactions = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');
  const [newTransaction, setNewTransaction] = useState({
    invoiceId: '',
    amount: '',
    type: 'payment',
    description: '',
    date
    status: 'completed',
  });

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }

    // Simulate loading transactions
    setTimeout(() => {
      setTransactions([
        {
          id: '1',
          invoiceId: 'INV-001',
          amount: 2500.00,
          type: 'payment',
          description: 'Payment received from Acme Corp',
          date: '2025-01-25',
          status: 'completed',
        },
        {
          id: '2',
          invoiceId: 'INV-002',
          amount: 1500.00,
          type: 'payment',
          description: 'Payment received from Tech Solutions',
          date: '2025-01-24',
          status: 'completed',
        },
        {
          id: '3',
          invoiceId: 'INV-003',
          amount: 500.00,
          type: 'refund',
          description: 'Refund issued for overpayment',
          date: '2025-01-23',
          status: 'completed',
        },
        {
          id: '4',
          invoiceId: 'INV-004',
          amount: 3000.00,
          type: 'charge',
          description: 'New invoice created',
          date: '2025-01-22',
          status: 'pending',
        },
        {
          id: '5',
          invoiceId: 'INV-005',
          amount: 2000.00,
          type: 'payment',
          description: 'Payment received from Global Services',
          date: '2025-01-21',
          status: 'completed',
        },
      ]);
      setLoading(false);
    }, 500);
  }, [navigate]);

  const handleAddTransaction = () => {
    setSaveError('');
    setSaveSuccess('');

    // Validation
    if (!newTransaction.invoiceId.trim()) {
      setSaveError('Invoice ID is required');
      return;
    }
    if (!newTransaction.amount || parseFloat(newTransaction.amount) <= 0) {
      setSaveError('Amount must be greater than 0');
      return;
    }
    if (!newTransaction.description.trim()) {
      setSaveError('Description is required');
      return;
    }

    // Add new transaction
    const transaction= {
      id: (transactions.length + 1).toString(),
      invoiceId,
      amount
      type,
      description,
      date,
      status,
    };

    setTransactions([transaction, ...transactions]);
    setShowDialog(false);
    
    // Reset form
    setNewTransaction({
      invoiceId: '',
      amount: '',
      type: 'payment',
      description: '',
      date
      status: 'completed',
    });

    setSaveSuccess('Transaction recorded successfully!');
    setTimeout(() => setSaveSuccess(''), 3000);
  };

  const getTypeIcon = (type) => {
    if (type === 'payment' || type === 'charge') {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    }
    return <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  const getStatusBadge = (status) => {
    const baseStyles = 'px-2 py-1 rounded text-xs font-medium';
    if (status === 'completed') {
      return `${baseStyles} bg-green-100 text-green-800`;
    } else if (status === 'pending') {
      return `${baseStyles} bg-yellow-100 text-yellow-800`;
    }
    return `${baseStyles} bg-red-100 text-red-800`;
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex flex-col md
            <div>
              <h1 className="text-3xl font-bold">Transactions</h1>
              <p className="text-muted-foreground">Track all your financial transactions</p>
            </div>
            <div className="mt-4 md
              <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Record Transaction
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm
                  <DialogHeader>
                    <DialogTitle>Record New Transaction</DialogTitle>
                    <DialogDescription>Add a new transaction to your records</DialogDescription>
                  </DialogHeader>

                  {saveSuccess && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <p className="text-sm font-medium text-green-800">{saveSuccess}</p>
                    </div>
                  )}

                  {saveError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <p className="text-sm font-medium text-red-800">{saveError}</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="invoiceId">Invoice ID</Label>
                      <Input
                        id="invoiceId"
                        placeholder="INV-001"
                        value={newTransaction.invoiceId}
                        onChange={(e) => setNewTransaction(prev => ({ ...prev, invoiceId: e.target.value }))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        value={newTransaction.amount}
                        onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: e.target.value }))}
                        className="mt-1"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Select value={newTransaction.type} onValueChange={(value) => setNewTransaction(prev => ({ ...prev, type: value as 'payment' | 'refund' | 'charge' }))}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="payment">Payment</SelectItem>
                          <SelectItem value="refund">Refund</SelectItem>
                          <SelectItem value="charge">Charge</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        placeholder="Transaction description"
                        value={newTransaction.description}
                        onChange={(e) => setNewTransaction(prev => ({ ...prev, description: e.target.value }))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newTransaction.date}
                        onChange={(e) => setNewTransaction(prev => ({ ...prev, date: e.target.value }))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select value={newTransaction.status} onValueChange={(value) => setNewTransaction(prev => ({ ...prev, status: value as 'completed' | 'pending' | 'failed' }))}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={() => setShowDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddTransaction}>
                      Record Transaction
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Transactions</CardTitle>
              <CardDescription>View and manage your transaction history</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-muted-foreground">Loading transactions...</p>
                </div>
              ) 
                <div className="flex items-center justify-center py-8">
                  <p className="text-muted-foreground">No transactions found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="finance-table">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Invoice</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction) => (
                        <tr key={transaction.id}>
                          <td>
                            <div className="flex items-center">
                              {getTypeIcon(transaction.type)}
                              <span className="ml-2 capitalize">{transaction.type}</span>
                            </div>
                          </td>
                          <td className="font-medium">{transaction.invoiceId}</td>
                          <td>{transaction.description}</td>
                          <td className="font-medium">${transaction.amount.toFixed(2)}</td>
                          <td>{new Date(transaction.date).toLocaleDateString()}</td>
                          <td>
                            <span className={getStatusBadge(transaction.status)}>
                              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                            </span>
                          </td>
                          <td>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Download Receipt</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
