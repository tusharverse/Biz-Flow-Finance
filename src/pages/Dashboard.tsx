
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from "@/components/dashboard/Sidebar";
import StatCard from "@/components/dashboard/StatCard";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import InvoicesList from "@/components/dashboard/InvoicesList";
import { BarChart4, DollarSign, Users, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }
    
    const user = JSON.parse(userStr);
    setUserName(user.name || 'User');
  }, [navigate]);

  // Sample data for the dashboard
  const revenueData = [
    { month: 'Jan', value: 2400 },
    { month: 'Feb', value: 1398 },
    { month: 'Mar', value: 9800 },
    { month: 'Apr', value: 3908 },
    { month: 'May', value: 4800 },
    { month: 'Jun', value: 3800 },
    { month: 'Jul', value: 4300 },
  ];

  const transactions = [
    {
      id: '1',
      description: 'Client Payment',
      amount: 1250.00,
      type: 'income' as const,
      date: new Date(2023, 7, 15),
      client: 'Acme Corp',
    },
    {
      id: '2',
      description: 'Office Supplies',
      amount: 85.50,
      type: 'expense' as const,
      date: new Date(2023, 7, 13),
    },
    {
      id: '3',
      description: 'Consulting Services',
      amount: 750.00,
      type: 'income' as const,
      date: new Date(2023, 7, 10),
      client: 'Johnson LLC',
    },
    {
      id: '4',
      description: 'Software Subscription',
      amount: 49.99,
      type: 'expense' as const,
      date: new Date(2023, 7, 8),
    },
  ];

  const invoices = [
    {
      id: '1',
      invoiceNumber: 'INV-2023-001',
      client: 'Acme Corp',
      amount: 1250.00,
      status: 'paid' as const,
      dueDate: new Date(2023, 7, 1),
    },
    {
      id: '2',
      invoiceNumber: 'INV-2023-002',
      client: 'Johnson LLC',
      amount: 750.00,
      status: 'paid' as const,
      dueDate: new Date(2023, 7, 5),
    },
    {
      id: '3',
      invoiceNumber: 'INV-2023-003',
      client: 'Smith Enterprises',
      amount: 2500.00,
      status: 'pending' as const,
      dueDate: new Date(2023, 8, 15),
    },
    {
      id: '4',
      invoiceNumber: 'INV-2023-004',
      client: 'Williams Co.',
      amount: 1450.00,
      status: 'overdue' as const,
      dueDate: new Date(2023, 7, 10),
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Welcome, {userName}</h1>
              <p className="text-muted-foreground">Here's what's happening with your business today.</p>
            </div>
            <div className="mt-4 md:mt-0 space-x-2">
              <Button variant="outline">Export Data</Button>
              <Button>Create Invoice</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              title="Total Revenue" 
              value="$24,567.89" 
              trend={{ value: 12, isPositive: true }}
              icon={<BarChart4 className="h-4 w-4 text-muted-foreground" />}
            />
            <StatCard 
              title="Outstanding Invoices" 
              value="$3,950.00" 
              trend={{ value: 4, isPositive: false }}
              icon={<FileText className="h-4 w-4 text-muted-foreground" />}
            />
            <StatCard 
              title="Total Expenses" 
              value="$8,532.75" 
              trend={{ value: 6, isPositive: false }}
              icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
            />
            <StatCard 
              title="Active Clients" 
              value="15" 
              trend={{ value: 8, isPositive: true }}
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
            />
          </div>
          
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Your business performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={revenueData}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="hsl(var(--primary))" 
                        fill="hsl(var(--primary))" 
                        fillOpacity={0.2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RecentTransactions transactions={transactions} />
            <InvoicesList invoices={invoices} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
