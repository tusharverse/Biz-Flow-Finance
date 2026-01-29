
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

interface Invoice {
  id: string;
  invoiceNumber: string;
  client: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: Date;
}

interface InvoicesListProps {
  invoices: Invoice[];
}

const statusColors = {
  paid: "bg-green-100 text-green-800 hover:bg-green-200",
  pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  overdue: "bg-red-100 text-red-800 hover:bg-red-200"
};

const InvoicesList = ({ invoices }: InvoicesListProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Invoices</CardTitle>
          <CardDescription>Your latest invoices</CardDescription>
        </div>
        <Link to="/invoices">
          <Button variant="outline" size="sm">View All</Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
              <div>
                <p className="font-medium">{invoice.client}</p>
                <p className="text-sm text-muted-foreground">Invoice #{invoice.invoiceNumber}</p>
                <p className="text-xs text-muted-foreground">
                  Due {formatDistanceToNow(invoice.dueDate, { addSuffix: true })}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="secondary" className={statusColors[invoice.status]}>
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </Badge>
                <p className="font-medium">${invoice.amount.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoicesList;
