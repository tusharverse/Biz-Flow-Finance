
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from "@/components/dashboard/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, FileText, Download, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';

const Invoices = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  // Sample invoices data
  const invoices = [
    {
      id: '1',
      invoiceNumber: 'INV-2023-001',
      client: 'Acme Corp',
      amount: 1250.00,
      status: 'paid',
      issueDate
      dueDate
    },
    {
      id: '2',
      invoiceNumber: 'INV-2023-002',
      client: 'Johnson LLC',
      amount: 750.00,
      status: 'paid',
      issueDate
      dueDate
    },
    {
      id: '3',
      invoiceNumber: 'INV-2023-003',
      client: 'Smith Enterprises',
      amount: 2500.00,
      status: 'pending',
      issueDate
      dueDate
    },
    {
      id: '4',
      invoiceNumber: 'INV-2023-004',
      client: 'Williams Co.',
      amount: 1450.00,
      status: 'overdue',
      issueDate
      dueDate
    },
    {
      id: '5',
      invoiceNumber: 'INV-2023-005',
      client: 'Davis Inc.',
      amount: 3200.00,
      status: 'draft',
      issueDate
      dueDate
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex flex-col md
            <div>
              <h1 className="text-3xl font-bold">Invoices</h1>
              <p className="text-muted-foreground">Manage your client invoices</p>
            </div>
            <div className="mt-4 md
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Invoice
              </Button>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>All Invoices</CardTitle>
              <CardDescription>View and manage all your invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="finance-table">
                  <thead>
                    <tr>
                      <th>Invoice #</th>
                      <th>Client</th>
                      <th>Issue Date</th>
                      <th>Due Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <tr key={invoice.id}>
                        <td className="font-medium">
                          <div className="flex items-center">
                            <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                            {invoice.invoiceNumber}
                          </div>
                        </td>
                        <td>{invoice.client}</td>
                        <td>{format(invoice.issueDate, 'MMM dd, yyyy')}</td>
                        <td>{format(invoice.dueDate, 'MMM dd, yyyy')}</td>
                        <td className="font-medium">${invoice.amount.toFixed(2)}</td>
                        <td>
                          <Badge variant="secondary" className={getStatusColor(invoice.status)}>
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </Badge>
                        </td>
                        <td>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <FileText className="mr-2 h-4 w-4" />
                                View Invoice
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Download PDF
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                Send Reminder
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                Mark as Paid
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Invoices;
