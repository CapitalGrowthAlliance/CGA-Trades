import React from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { ArrowLeft, User, Mail } from 'lucide-react';

export default function SettingsPage() {
  // Mock user for UI consistency without auth
  const user = { fullName: 'User', email: 'user@example.com' };
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-2 -ml-2 rounded-full hover:bg-bg-hover text-text-secondary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
          </div>
          <ThemeToggle />
        </header>

        <div className="bg-bg-card rounded-2xl p-6 md:p-8 border border-border-light shadow-sm">
          <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
          
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-text-secondary mb-2">
                <User className="w-4 h-4" /> Full Name
              </label>
              <div className="p-3 bg-bg-secondary rounded-xl border border-border-light font-medium">
                {user?.fullName || 'Not set'}
              </div>
            </div>
            
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-text-secondary mb-2">
                <Mail className="w-4 h-4" /> Email Address
              </label>
              <div className="p-3 bg-bg-secondary rounded-xl border border-border-light font-medium">
                {user?.email || 'Not set'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
