# Database Setup Guide

This guide helps you set up the Supabase database schema for the Biz-Flow-Finance application.

## Required Tables

### 1. Clients Table
```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  total_billed DECIMAL(12, 2) DEFAULT 0,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX idx_clients_user_id ON clients(user_id);
```

### 2. Invoices Table
```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  invoice_number VARCHAR(50) NOT NULL UNIQUE,
  amount DECIMAL(12, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'overdue'
  issue_date DATE,
  due_date DATE,
  description TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_status ON invoices(status);
```

### 3. Transactions Table
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL,
  type VARCHAR(50), -- 'payment', 'refund', etc.
  description TEXT,
  transaction_date DATE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX idx_transactions_invoice_id ON transactions(invoice_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
```

## Steps to Create Tables

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Create a new query and run each SQL statement above
4. Alternatively, you can use the Supabase UI to create tables manually

## Updating Supabase Types

After creating tables in Supabase, update your TypeScript types:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/integrations/supabase/types.ts
```

Or use the Supabase CLI:
```bash
supabase gen types typescript --project-id <your-project-id> > src/integrations/supabase/types.ts
```

## Row Level Security (RLS) Setup

Enable RLS for security:

```sql
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Clients policy (users can see their own clients)
CREATE POLICY "Users can view their own clients" ON clients
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own clients" ON clients
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clients" ON clients
  FOR UPDATE USING (auth.uid() = user_id);

-- Similar policies for invoices and transactions...
```

## Testing

After setup, test with the frontend:
1. Run `npm run dev:all` to start client and server
2. Navigate to `/clients` - should load the sample data
3. Create a client in Supabase and refresh to see it
