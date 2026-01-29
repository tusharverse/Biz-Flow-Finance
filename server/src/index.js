import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3001;

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Validation helper
const validateClient = (data) => {
  if (!data.name) throw new Error('Name is required');
  return {
    name: data.name,
    contact_name: data.contact_name,
    email: data.email,
    phone: data.phone,
    address: data.address,
  };
};

const validateInvoice = (data) => {
  if (!data.client_id) throw new Error('Client ID is required');
  if (!data.invoice_number) throw new Error('Invoice number is required');
  if (!data.amount || data.amount <= 0) throw new Error('Amount must be positive');
  return {
    client_id: data.client_id,
    invoice_number: data.invoice_number,
    amount: data.amount,
    status: data.status || 'pending',
    issue_date: data.issue_date,
    due_date: data.due_date,
    description: data.description,
  };
};

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// CLIENTS ENDPOINTS
app.get('/api/clients', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/clients', async (req, res) => {
  try {
    const validated = validateClient(req.body);
    const { data, error } = await supabase
      .from('clients')
      .insert([validated])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const validated = validateClient(req.body);
    const { data, error } = await supabase
      .from('clients')
      .update(validated)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Client deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// INVOICES ENDPOINTS
app.get('/api/invoices', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/invoices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/invoices', async (req, res) => {
  try {
    const validated = validateInvoice(req.body);
    const { data, error } = await supabase
      .from('invoices')
      .insert([validated])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/invoices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const validated = validateInvoice(req.body);
    const { data, error } = await supabase
      .from('invoices')
      .update(validated)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// STATS ENDPOINT
app.get('/api/stats', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('amount, status');

    if (error) throw error;

    const total = (data ?? []).reduce((sum, row) => sum + (row.amount ?? 0), 0);
    const paid = (data ?? []).filter((r) => r.status === 'paid').length;
    const pending = (data ?? []).filter((r) => r.status === 'pending').length;

    res.json({ total, paid, pending });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`);
});
