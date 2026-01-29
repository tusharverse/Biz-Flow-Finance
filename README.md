# Biz Flow Finance

A modern, full-stack business finance management application built with React, TypeScript, and Node.js. Manage invoices, track transactions, handle clients, and generate comprehensive financial reports—all in one intuitive platform.

## 🚀 Live Demo

**[Visit Biz Flow Finance](https://biz-flow-finance.vercel.app)**

## ✨ Features

- **Dashboard**: Real-time overview of financial metrics and recent transactions
- **Invoice Management**: Create, edit, and track invoices with detailed records
- **Client Management**: Maintain a comprehensive client database
- **Transaction Tracking**: Monitor all financial transactions
- **Financial Reports**: Generate detailed reports and analytics
- **User Authentication**: Secure login and registration with Supabase
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Live data synchronization across the platform

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - Beautiful UI components
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Type-safe backend
- **Supabase** - PostgreSQL database and authentication

### Development Tools
- **ESLint** - Code quality and style
- **PostCSS** - CSS processing
- **Bun** - Fast JavaScript bundler and package manager

## 📦 Project Structure

```
biz-master/
├── src/                          # Frontend source code
│   ├── components/              # Reusable React components
│   │   ├── auth/               # Authentication components
│   │   ├── dashboard/          # Dashboard components
│   │   ├── invoices/           # Invoice components
│   │   └── ui/                 # UI library components (Shadcn)
│   ├── pages/                  # Page components
│   ├── lib/                    # Utility functions
│   ├── hooks/                  # Custom React hooks
│   ├── integrations/           # Third-party integrations (Supabase)
│   ├── App.tsx                 # Main app component
│   └── main.tsx                # App entry point
├── server/                       # Backend source code
│   ├── src/
│   │   └── index.ts            # Server entry point
│   └── package.json            # Backend dependencies
├── supabase/                     # Supabase configuration
├── package.json                 # Frontend dependencies
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.ts          # Tailwind configuration
├── vite.config.ts              # Vite configuration
└── README.md                   # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ or Bun
- Git
- A Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tusharverse/Biz-Flow-Finance.git
   cd Biz-Flow-Finance
   ```

2. **Install dependencies**
   ```bash
   # Using npm
   npm install
   
   # Or using bun
   bun install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example env file
   cp .env.example .env.local
   
   # Configure your Supabase credentials
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up backend environment**
   ```bash
   cd server
   cp .env.example .env
   # Configure your server environment variables
   ```

5. **Start the development server**
   ```bash
   # Frontend (from root directory)
   npm run dev
   
   # Backend (from server directory)
   cd server
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

## 📝 Available Scripts

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Backend
```bash
cd server
npm run dev          # Start development server
npm run build        # Build TypeScript
npm start            # Run production server
```

## 🗄️ Database Setup

The project uses Supabase as the database. Follow the [DATABASE_SETUP.md](./DATABASE_SETUP.md) guide to:
- Create necessary database tables
- Set up relationships and constraints
- Configure Row Level Security (RLS) policies
- Initialize sample data

## 🔐 Authentication

This project uses Supabase Authentication with:
- Email/password authentication
- Session management
- JWT token handling
- Secure API endpoints

## 📊 Pages and Features

| Page | Description |
|------|-------------|
| **Dashboard** | Main overview with stats and recent transactions |
| **Invoices** | Create, view, and manage invoices |
| **Clients** | Manage client information and details |
| **Transactions** | Track and filter all transactions |
| **Reports** | Generate and view financial reports |
| **Settings** | User profile and application settings |
| **Login** | Secure user login |
| **Register** | New user registration |

## 🎨 UI Components

The project uses Shadcn/ui components including:
- Buttons, Cards, and Dialogs
- Forms and Input fields
- Tables and Data grids
- Navigation menus
- Modals and Alerts
- And many more...

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop browsers (1920px and above)
- Tablets (768px to 1024px)
- Mobile devices (320px and above)

## 🚀 Deployment

### Vercel (Frontend)
The frontend is deployed on Vercel and automatically updates on every push to the main branch.

### Backend Deployment
Configure your backend on your preferred platform (Heroku, Railway, AWS, etc.) and update the API base URL in your environment variables.

## 📚 Documentation

- [Complete Setup Guide](./COMPLETE_SETUP.md)
- [Architecture Documentation](./ARCHITECTURE.md)
- [Database Setup](./DATABASE_SETUP.md)
- [Implementation Checklist](./IMPLEMENTATION_CHECKLIST.md)
- [Quick Start Guide](./QUICK_START.md)

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Tushar Singh**
- GitHub: [@tusharverse](https://github.com/tusharverse)
- Repository: [Biz-Flow-Finance](https://github.com/tusharverse/Biz-Flow-Finance)

## 🎯 Roadmap

- [ ] Multi-currency support
- [ ] Advanced reporting with charts
- [ ] Export to PDF/Excel
- [ ] Mobile app (React Native)
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Role-based access control
- [ ] Email notifications
- [ ] Automated backups

## 💬 Support

For support, please:
- Check the documentation files in the repository
- Open an issue on GitHub
- Contact through the website

## 🙏 Acknowledgments

- [React](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn/ui](https://ui.shadcn.com)
- [Supabase](https://supabase.com)
- [Vite](https://vitejs.dev)

---

**Built with ❤️ by Tushar Singh**

Visit the live application: [https://biz-flow-finance.vercel.app](https://biz-flow-finance.vercel.app)
