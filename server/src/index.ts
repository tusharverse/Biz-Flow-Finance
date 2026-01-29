import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3001;

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Validation schemas
const clientSchema = z.object({
  name: z.string().min(1),
  contact_name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

const invoiceSchema = z.object({
  client_id: z.string().uuid(),
  invoice_number: z.string(),
  amount: z.number().positive(),
  status: z.enum(['pending', 'paid', 'overdue']),
  issue_date: z.string().optional(),
  due_date: z.string().optional(),
  description: z.string().optional(),
});

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// CLIENTS ENDPOINTS
app.get('/api/clients', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/clients/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/clients', async (req: Request, res: Response) => {
  try {
    const validated = clientSchema.parse(req.body);
    const { data, error } = await supabase
      .from('clients')
      .insert([validated])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/clients/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validated = clientSchema.parse(req.body);
    const { data, error } = await supabase
      .from('clients')
      .update(validated)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/clients/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Client deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// INVOICES ENDPOINTS
app.get('/api/invoices', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/invoices/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/invoices', async (req: Request, res: Response) => {
  try {
    const validated = invoiceSchema.parse(req.body);
    const { data, error } = await supabase
      .from('invoices')
      .insert([validated])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/invoices/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validated = invoiceSchema.parse(req.body);
    const { data, error } = await supabase
      .from('invoices')
      .update(validated)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// STATS ENDPOINT
app.get('/api/stats', async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('amount, status');

    if (error) throw error;

    const total = (data ?? []).reduce((sum: number, row: any) => sum + (row.amount ?? 0), 0);
    const paid = (data ?? []).filter((r: any) => r.status === 'paid').length;
    const pending = (data ?? []).filter((r: any) => r.status === 'pending').length;

    res.json({ total, paid, pending });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`);
});
