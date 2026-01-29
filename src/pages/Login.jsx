
import React, { useEffect } from 'react';
import LoginForm from "@/components/auth/LoginForm";
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <div className="flex-1 flex flex-col justify-center px-4 py-12">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-2xl font-bold text-primary">BizFlow Finance</h1>
          </Link>
          <p className="text-muted-foreground mt-2">Sign in to manage your business finances</p>
        </div>
        <LoginForm />
      </div>
      <footer className="py-6 border-t bg-card">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} BizFlow Finance. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Login;
