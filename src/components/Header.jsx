import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Search, Bell, User, Settings, Moon, LogOut, 
  ChevronDown, FileText, FolderOpen, Layers, 
  FileType, BarChart2 
} from 'lucide-react';
import { getUserProfile } from '../utils/auth';

const Header = () => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const location = useLocation();
  const user = getUserProfile();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FileText },
    { path: '/documents', label: 'My Documents', icon: FolderOpen },
    { path: '/document-sets', label: 'Document Sets', icon: Layers },
    { path: '/templates', label: 'Templates', icon: FileType },
    { path: '/analytics', label: 'Analytics', icon: BarChart2 }
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo and Navigation */}
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">DocuFlow</span>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 text-sm font-medium ${
                    isActive 
                      ? 'text-blue-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Center Search */}
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Right User Menu */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <User className="w-5 h-5 text-gray-500" />
                )}
              </div>
              <span className="text-sm font-medium">{user.name}</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2">
                    <Moon className="w-4 h-4" />
                    <span>Dark Mode</span>
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 text-red-600">
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header; 