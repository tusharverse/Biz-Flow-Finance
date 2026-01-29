// API client for making requests to the backend server

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export interface Client {
  id: string;
  name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  total_billed?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Invoice {
  id: string;
  client_id: string;
  invoice_number: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  issue_date?: string;
  due_date?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Stats {
  total: number;
  paid: number;
  pending: number;
}

// Clients API
export const clientAPI = {
  async getAll(): Promise<Client[]> {
    const response = await fetch(`${API_BASE_URL}/api/clients`);
    if (!response.ok) throw new Error('Failed to fetch clients');
    return response.json();
  },

  async getById(id: string): Promise<Client> {
    const response = await fetch(`${API_BASE_URL}/api/clients/${id}`);
    if (!response.ok) throw new Error('Failed to fetch client');
    return response.json();
  },

  async create(client: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<Client> {
    const response = await fetch(`${API_BASE_URL}/api/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(client),
    });
    if (!response.ok) throw new Error('Failed to create client');
    return response.json();
  },

  async update(id: string, client: Partial<Client>): Promise<Client> {
    const response = await fetch(`${API_BASE_URL}/api/clients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(client),
    });
    if (!response.ok) throw new Error('Failed to update client');
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/clients/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete client');
  },
};

// Invoices API
export const invoiceAPI = {
  async getAll(): Promise<Invoice[]> {
    const response = await fetch(`${API_BASE_URL}/api/invoices`);
    if (!response.ok) throw new Error('Failed to fetch invoices');
    return response.json();
  },

  async getById(id: string): Promise<Invoice> {
    const response = await fetch(`${API_BASE_URL}/api/invoices/${id}`);
    if (!response.ok) throw new Error('Failed to fetch invoice');
    return response.json();
  },

  async create(invoice: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>): Promise<Invoice> {
    const response = await fetch(`${API_BASE_URL}/api/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoice),
    });
    if (!response.ok) throw new Error('Failed to create invoice');
    return response.json();
  },

  async update(id: string, invoice: Partial<Invoice>): Promise<Invoice> {
    const response = await fetch(`${API_BASE_URL}/api/invoices/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoice),
    });
    if (!response.ok) throw new Error('Failed to update invoice');
    return response.json();
  },
};

// Dashboard API
export const dashboardAPI = {
  async getStats(): Promise<Stats> {
    const response = await fetch(`${API_BASE_URL}/api/stats`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },
};

// Health check
export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
};
