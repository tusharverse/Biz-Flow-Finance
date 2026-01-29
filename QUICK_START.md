# 🚀 Quick Start Guide - Biz-Flow-Finance

Get your full-stack app running in 5 minutes!

## ⚡ The Fastest Path

### 1️⃣ Install Everything (2 min)
```bash
# In project root
npm install
npm install --prefix server
```

### 2️⃣ Configure Backend (1 min)
Create `server/.env`:
```env
PORT=3001
SUPABASE_URL=https://sjqcfgleswintrjzrhnj.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<paste-your-service-role-key-here>
```

👉 **Get service role key from**: Supabase Dashboard → Settings → API Keys → Service Role Secret

### 3️⃣ Run Both Together (1 min)
```bash
npm run dev:all
```

### 4️⃣ Open Your Browser
- Frontend: http://localhost:8080
- Backend: http://localhost:3001

### 5️⃣ Test It
- Click on the Clients page
- You should see sample client data
- Backend API is responding! ✅

## 📊 What You Get Right Now

✅ **Frontend works** - React app with pages and UI
✅ **Backend works** - Express server with API endpoints  
✅ **API client ready** - Functions to call the backend
✅ **Database connected** - Supabase is configured

⏳ **Still needs**: Database tables created (see below)

## 🗄️ Quick Database Setup (10 min - Optional)

To use real database instead of sample data:

### 1. Go to Supabase Dashboard
https://app.supabase.com → Your Project

### 2. SQL Editor → New Query

### 3. Paste This (Creates Clients Table)
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
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_clients_user_id ON clients(user_id);
```

### 4. Run Query ▶️

### 5. Add Sample Data
```sql
INSERT INTO clients (name, contact_name, email, phone, address, total_billed)
VALUES 
  ('Acme Corp', 'John Smith', 'john@acme.com', '555-0001', '123 Business Ave', 7850.00),
  ('Tech Solutions', 'Sarah Johnson', 'sarah@tech.com', '555-0002', '456 Tech St', 12500.00),
  ('Global Services', 'Mike Davis', 'mike@global.com', '555-0003', '789 Service Blvd', 5200.00);
```

### 6. Refresh Frontend
- Go back to http://localhost:8080/clients
- Real database data should now appear!

## 📖 Full Documentation

- **`PROJECT_SUMMARY.md`** - Complete overview
- **`FULLSTACK_SETUP.md`** - Detailed setup guide
- **`DATABASE_SETUP.md`** - All SQL schemas
- **`IMPLEMENTATION_CHECKLIST.md`** - Tasks to complete
- **`ARCHITECTURE.md`** - System design

## 🎯 What Comes Next?

1. **Connect more pages to API** (30 min each)
   - Update `Dashboard.tsx` to use real stats
   - Update `Invoices.tsx` to use real invoices
   - Update `Login.tsx` with auth

2. **Add CRUD forms** (1-2 hours)
   - Create client dialog
   - Edit client dialog
   - Delete with confirmation

3. **Polish & deploy** (Variable)
   - Add more features
   - Style improvements
   - Deploy to production

## 🔧 Commands Cheat Sheet

```bash
# Start everything
npm run dev:all

# Start just frontend
npm run dev:client

# Start just backend
npm run dev:server

# Build for production
npm run build
npm run build --prefix server

# Install dependencies
npm install
npm install --prefix server

# Test backend API
curl http://localhost:3001/health
curl http://localhost:3001/api/clients
```

## 🆘 Common Issues

### "Cannot find module" Error
```bash
npm install
npm install --prefix server
```

### "Port 3001 already in use"
Change in `server/.env`:
```env
PORT=3002  # Use different port
```

### "Supabase connection error"
- Check `SUPABASE_URL` is correct
- Check `SUPABASE_SERVICE_ROLE_KEY` is correct
- Check the keys aren't in quotes in `.env`

### "No clients showing"
- Database might not be set up yet
- App shows sample data automatically
- Once you create real tables, it switches to real data

## 🎓 Next Learning Points

**Frontend Integration:**
```typescript
// In any component
import { clientAPI } from '@/lib/api';

const clients = await clientAPI.getAll();
await clientAPI.create({ name: 'New Client', email: '...' });
await clientAPI.update(id, { name: 'Updated' });
await clientAPI.delete(id);
```

**Backend Validation:**
```typescript
// Already implemented with Zod
// POST /api/clients validates:
// - name: string (required)
// - email: valid email (optional)
// - phone: string (optional)
```

**Database:**
```sql
-- Tables ready to create:
-- clients (for managing clients)
-- invoices (for tracking invoices)
-- transactions (for payment tracking)
```

## 🚀 You're Ready!

Your full-stack application is ready to use:
- ✅ Frontend running
- ✅ Backend running
- ✅ APIs connected
- ✅ Database configured

**Next Step**: Run `npm run dev:all` and start building! 🎉

---

**Questions?** Check the detailed docs:
- Setup: `FULLSTACK_SETUP.md`
- Tasks: `IMPLEMENTATION_CHECKLIST.md`
- Schema: `DATABASE_SETUP.md`
- Architecture: `ARCHITECTURE.md`
