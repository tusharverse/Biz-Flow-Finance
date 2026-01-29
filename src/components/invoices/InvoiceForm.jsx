
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';


const InvoiceForm = () => {
  const { toast } = useToast();
  const [client, setClient] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [dueDate, setDueDate] = useState(
    format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
  );
  const [items, setItems] = useState([
    { id: '1', description: '', quantity: 1, price: 0 }
  ]);
  const [notes, setNotes] = useState('');
  
  const addItem = () => {
    setItems([
      ...items, 
      { 
        id
        description: '', 
        quantity: 1, 
        price: 0 
      }
    ]);
  };
  
  const updateItem = (id, field: keyof InvoiceItem, value) => {
    setItems(
      items.map(item => 
        item.id === id 
          ? { ...item, [field]: value } 
          )
    );
  };
  
  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    } else {
      toast({
        variant: "destructive",
        title: "Cannot remove item",
        description: "Invoice needs at least one item",
      });
    }
  };
  
  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const subtotal = calculateSubtotal();
    if (subtotal <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid invoice",
        description: "Total amount must be greater than zero",
      });
      return;
    }
    
    if (!client || !clientEmail) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill out client name and email",
      });
      return;
    }
    
    toast({
      title: "Invoice created",
      description: `Invoice for ${client} has been created successfully!`,
    });
    
    // In a real app, you would save the invoice to your backend here
    console.log({
      client,
      clientEmail,
      clientAddress,
      dueDate,
      items,
      notes,
      subtotal,
      invoiceDate
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Create Invoice</CardTitle>
          <CardDescription>Create a new invoice for your client</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Client Information</h3>
            <div className="grid grid-cols-1 md
              <div className="space-y-2">
                <Label htmlFor="client">Client Name</Label>
                <Input 
                  id="client" 
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  placeholder="John Doe or Company Name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientEmail">Client Email</Label>
                <Input 
                  id="clientEmail" 
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="client@example.com"
                  required
                />
              </div>
              <div className="space-y-2 md
                <Label htmlFor="clientAddress">Client Address</Label>
                <Input 
                  id="clientAddress" 
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  placeholder="123 Main St, City, Country"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Invoice Details</h3>
            <div className="grid grid-cols-1 md
              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">Invoice Number</Label>
                <Input 
                  id="invoiceNumber" 
                  value={`INV-${Date.now().toString().slice(-6)}`}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input 
                  id="dueDate" 
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Invoice Items</h3>
              <Button 
                type="button" 
                variant="outline" 
                onClick={addItem}
              >
                Add Item
              </Button>
            </div>
            
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5">
                    <Input 
                      placeholder="Item description"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Input 
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value, 10) || 0)}
                      required
                    />
                  </div>
                  <div className="col-span-3">
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 transform -translate-y-1/2">$</span>
                      <Input 
                        type="number"
                        min="0"
                        step="0.01"
                        className="pl-6"
                        placeholder="Price"
                        value={item.price}
                        onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-span-2 text-right">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">${(item.quantity * item.price).toFixed(2)}</span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <span className="font-medium">Subtotal:</span>
              <span className="font-bold">${calculateSubtotal().toFixed(2)}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input 
              id="notes" 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Payment terms, thank you notes, etc."
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button">
            Save as Draft
          </Button>
          <Button type="submit">
            Create & Send Invoice
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default InvoiceForm;
