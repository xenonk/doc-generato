import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../utils/auth';
import { toast } from 'react-hot-toast';

const Login: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto login with mock user
    const autoLogin = async () => {
      try {
        await login({ email: 'demo@example.com', password: 'demo' });
        toast.success('Welcome back, Demo User!');
        navigate('/dashboard');
      } catch (error) {
        toast.error('Auto-login failed');
      }
    };

    autoLogin();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            DocuFlow
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Auto-logging in...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 