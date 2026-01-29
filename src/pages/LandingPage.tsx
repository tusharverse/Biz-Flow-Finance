
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b py-6 px-8">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">BizFlow Finance</h1>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link to="/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="flex-1 flex items-center">
        <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row py-12">
          <div className="flex-1 space-y-6 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Simplify Your 
              <span className="text-primary"> Small Business</span> 
              <br />Financial Management
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg">
              Easy invoicing, expense tracking, and financial reporting for busy entrepreneurs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started - It's Free
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Learn More
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              No credit card required. Free 14-day trial.
            </p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-muted p-6 rounded-lg shadow-lg max-w-md w-full">
              <div className="space-y-4">
                <div className="h-40 bg-card rounded-md shadow-sm flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-finance-blue">Dashboard Preview</div>
                    <div className="text-sm text-muted-foreground">Visualize your finances at a glance</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-24 bg-card rounded-md shadow-sm flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-lg font-bold text-finance-green">Invoicing</div>
                    </div>
                  </div>
                  <div className="h-24 bg-card rounded-md shadow-sm flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">Expenses</div>
                    </div>
                  </div>
                </div>
                <div className="h-16 bg-card rounded-md shadow-sm flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-md font-bold text-finance-blue-light">Financial Reports</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Professional Invoicing</h3>
              <p className="text-muted-foreground">Create and send professional invoices to your clients in seconds.</p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Expense Tracking</h3>
              <p className="text-muted-foreground">Keep track of all your business expenses in one place.</p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Financial Reports</h3>
              <p className="text-muted-foreground">Get insights into your business finances with detailed reports.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-card py-8 border-t">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold text-primary">BizFlow Finance</h2>
              <p className="text-sm text-muted-foreground">Financial management made simple for small businesses</p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
              <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">
                Login
              </Link>
              <Link to="/register" className="text-sm text-muted-foreground hover:text-foreground">
                Sign Up
              </Link>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} BizFlow Finance. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
