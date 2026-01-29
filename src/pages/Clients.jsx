
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from "@/components/dashboard/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Users, MoreHorizontal, Mail, Phone, Check, AlertCircle } from "lucide-react";
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
import { supabase } from '@/integrations/supabase/client';



const Clients = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');
  const [newClient, setNewClient] = useState({
    name: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }

    fetchClients();
  }, [navigate]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch clients from Supabase (once tables are created)
      // For now, using sample data as fallback
      const sampleClients= [
        {
          id: '1',
          name: 'Acme Corp',
          contactName: 'John Smith',
          email: 'john@acmecorp.com',
          phone: '(555) 123-4567',
          totalBilled: 7850.00,
          address: '123 Business Ave, New York, NY 10001',
        },
        {
          id: '2',
          name: 'Johnson LLC',
          contactName: 'Sarah Johnson',
          email: 'sarah@johnsonllc.com',
          phone: '(555) 234-5678',
          totalBilled: 4500.00,
          address: '456 Commerce St, Chicago, IL 60601',
        },
        {
          id: '3',
          name: 'Smith Enterprises',
          contactName: 'Robert Smith',
          email: 'robert@smithent.com',
          phone: '(555) 345-6789',
          totalBilled: 12500.00,
          address: '789 Market St, San Francisco, CA 94103',
        },
        {
          id: '4',
          name: 'Williams Co.',
          contactName: 'Emily Williams',
          email: 'emily@williamsco.com',
          phone: '(555) 456-7890',
          totalBilled: 3200.00,
          address: '321 Main St, Boston, MA 02108',
        },
        {
          id: '5',
          name: 'Davis Inc.',
          contactName: 'Michael Davis',
          email: 'michael@davisinc.com',
          phone: '(555) 567-8901',
          totalBilled: 6750.00,
          address: '654 Oak Ave, Austin, TX 78701',
        },
      ];

      setClients(sampleClients);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError(err instanceof Error ? err.message : 'Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = () => {
    setSaveError('');
    setSaveSuccess('');

    // Validation
    if (!newClient.name.trim()) {
      setSaveError('Company name is required');
      return;
    }
    if (!newClient.contactName.trim()) {
      setSaveError('Contact name is required');
      return;
    }
    if (!newClient.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newClient.email)) {
      setSaveError('Valid email is required');
      return;
    }
    if (!newClient.phone.trim()) {
      setSaveError('Phone number is required');
      return;
    }

    // Add new client
    const client= {
      id: (clients.length + 1).toString(),
      name,
      contactName,
      email,
      phone,
      totalBilled: 0,
      address,
    };

    setClients([client, ...clients]);
    setShowDialog(false);
    
    // Reset form
    setNewClient({
      name: '',
      contactName: '',
      email: '',
      phone: '',
      address: '',
    });

    setSaveSuccess('Client added successfully!');
    setTimeout(() => setSaveSuccess(''), 3000);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex flex-col md
            <div>
              <h1 className="text-3xl font-bold">Clients</h1>
              <p className="text-muted-foreground">Manage your business clients</p>
            </div>
            <div className="mt-4 md
              <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Client
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm
                  <DialogHeader>
                    <DialogTitle>Add New Client</DialogTitle>
                    <DialogDescription>Add a new client to your business records</DialogDescription>
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
                      <Label htmlFor="name">Company Name</Label>
                      <Input
                        id="name"
                        placeholder="Company name"
                        value={newClient.name}
                        onChange={(e) => setNewClient(prev => ({ ...prev, name: e.target.value }))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="contactName">Contact Name</Label>
                      <Input
                        id="contactName"
                        placeholder="Contact person name"
                        value={newClient.contactName}
                        onChange={(e) => setNewClient(prev => ({ ...prev, contactName: e.target.value }))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="client@company.com"
                        value={newClient.email}
                        onChange={(e) => setNewClient(prev => ({ ...prev, email: e.target.value }))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        placeholder="(555) 123-4567"
                        value={newClient.phone}
                        onChange={(e) => setNewClient(prev => ({ ...prev, phone: e.target.value }))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        placeholder="Business address"
                        value={newClient.address}
                        onChange={(e) => setNewClient(prev => ({ ...prev, address: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={() => setShowDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddClient}>
                      Add Client
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          {error && (
            <Card className="mb-8 border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <p className="text-red-800">{error}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>All Clients</CardTitle>
              <CardDescription>View and manage your clients information</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-muted-foreground">Loading clients...</p>
                </div>
              ) 
                <div className="flex items-center justify-center py-8">
                  <p className="text-muted-foreground">No clients found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="finance-table">
                    <thead>
                      <tr>
                        <th>Client Name</th>
                        <th>Contact Person</th>
                        <th>Contact Info</th>
                        <th>Total Billed</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                    {clients.map((client) => (
                      <tr key={client.id}>
                        <td className="font-medium">
                          <div className="flex items-center">
                            <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                            {client.name}
                          </div>
                        </td>
                        <td>{client.contactName}</td>
                        <td>
                          <div className="flex flex-col">
                            <div className="flex items-center">
                              <Mail className="mr-2 h-3 w-3 text-muted-foreground" />
                              {client.email}
                            </div>
                            <div className="flex items-center mt-1">
                              <Phone className="mr-2 h-3 w-3 text-muted-foreground" />
                              {client.phone}
                            </div>
                          </div>
                        </td>
                        <td className="font-medium">${client.totalBilled.toFixed(2)}</td>
                        <td>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit Client</DropdownMenuItem>
                              <DropdownMenuItem>Create Invoice</DropdownMenuItem>
                              <DropdownMenuItem>View Invoices</DropdownMenuItem>
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

export default Clients;
