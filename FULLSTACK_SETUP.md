# Biz-Flow-Finance - Full Stack Setup Guide

A modern finance & invoicing application with React frontend and Express backend.

## Project Structure

```
.
├── src/                      # React Frontend
│   ├── pages/               # Page components
│   ├── components/          # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   └── integrations/       # External service integrations (Supabase)
│
├── server/                  # Express Backend
│   ├── src/
│   │   └── index.ts        # Main API server
│   ├── package.json
│   └── tsconfig.json
│
├── supabase/               # Supabase configuration
├── vite.config.ts         # Frontend build config
└── package.json           # Root scripts
```

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool & dev server
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **React Router** - Navigation
- **React Hook Form** - Form management
- **Supabase JS Client** - Frontend database access

### Backend
- **Express** - API framework
- **TypeScript** - Type safety
- **Zod** - Input validation
- **Supabase** - Database & auth

## Prerequisites

- Node.js 18+
- npm/yarn
- Supabase account & project

## Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd Biz-Flow-Finance
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install server dependencies**
   ```bash
   npm install --prefix server
   ```

## Configuration

### Frontend Setup

The frontend is already configured to use Supabase. Check `src/integrations/supabase/client.ts`:
- SUPABASE_URL - Your project URL
- SUPABASE_PUBLISHABLE_KEY - Public key for frontend

### Backend Setup

Create `server/.env` file:
```env
PORT=3001
SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**⚠️ Important**: Use SERVICE ROLE KEY on backend only. Keep it secret!

## Database Setup

Before running the app, create the necessary tables in Supabase:

1. **See `DATABASE_SETUP.md`** for complete SQL schema
2. Run the SQL migrations in Supabase Dashboard
3. Update types: `npx supabase gen types typescript --project-id <your-project-id> > src/integrations/supabase/types.ts`

## Running the Application

### Option 1: Run Both Frontend & Backend Together
```bash
npm run dev:all
```

This runs concurrently:
- Frontend: http://localhost:8080
- Backend: http://localhost:3001

### Option 2: Run Separately

Frontend only:
```bash
npm run dev:client
# or
npm run dev
```

Backend only:
```bash
npm run dev:server
# or
cd server && npm run dev
```

## API Endpoints

### Clients
- `GET /api/clients` - List all clients
- `GET /api/clients/:id` - Get client details
- `POST /api/clients` - Create client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Invoices
- `GET /api/invoices` - List all invoices
- `GET /api/invoices/:id` - Get invoice details
- `POST /api/invoices` - Create invoice
- `PUT /api/invoices/:id` - Update invoice

### Dashboard
- `GET /api/stats` - Get aggregated stats

### Health
- `GET /health` - API health check

## Frontend Pages

- **`/`** - Landing page
- **`/login`** - User login
- **`/register`** - User registration
- **`/dashboard`** - Main dashboard
- **`/invoices`** - Invoices list
- **`/clients`** - Clients management
- **`/404`** - Not found page

## Building for Production

### Frontend
```bash
npm run build
npm run preview  # Test the build locally
```

### Backend
```bash
npm run build --prefix server
npm start --prefix server
```

## Deployment

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy `dist/` folder
3. Set environment for Supabase URLs

### Backend (Render/Fly.io/Railway)
1. Build: `npm run build --prefix server`
2. Start: `npm start --prefix server`
3. Set environment variables:
   - `PORT`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

## Features

✅ User authentication (Supabase Auth)
✅ Client management
✅ Invoice creation & tracking
✅ Transaction logging
✅ Real-time statistics
✅ Role-based access control
✅ Responsive design
✅ Type-safe API

## Next Steps

1. Set up database tables (see DATABASE_SETUP.md)
2. Configure Supabase RLS policies
3. Update environment variables
4. Connect frontend to backend endpoints
5. Deploy to production

## Troubleshooting

### "Module not found" errors
```bash
npm install
npm install --prefix server
```

### Supabase connection issues
- Check `SUPABASE_URL` and keys are correct
- Verify tables exist in Supabase
- Check CORS settings in backend

### Port already in use
- Frontend default: 8080
- Backend default: 3001
- Change in vite.config.ts or server/.env

## Support

For issues or questions, check:
- DATABASE_SETUP.md - Database schema
- Frontend components in `src/components/`
- API server code in `server/src/index.ts`
