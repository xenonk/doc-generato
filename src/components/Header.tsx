import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Search, Bell, User, Settings, Moon, LogOut, 
  ChevronDown, FileText, FolderOpen, Layers, 
  FileType, BarChart2, BookOpen, Building2,
  ScrollText, Package, Coins, Globe,
  LucideIcon, Users
} from 'lucide-react';
import { getUserProfile } from '../utils/auth';
import NotificationDrawer from './NotificationDrawer';

interface Notification {
  id: number;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}

interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
}

const Header: React.FC = () => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showHandbooksDropdown, setShowHandbooksDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const user: UserProfile = getUserProfile() as UserProfile;

  // Mock notifications data - in real app this would come from an API
  const notifications: Notification[] = [
    {
      id: 1,
      type: 'info',
      title: 'New comment on Invoice INV-2024-001',
      message: 'John Smith commented: "Please review the updated terms"',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      isRead: false
    },
    {
      id: 2,
      type: 'success',
      title: 'Invoice approved',
      message: 'Invoice INV-2024-002 has been approved by Sarah Johnson',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      isRead: false
    },
    {
      id: 3,
      type: 'warning',
      title: 'Document due soon',
      message: 'Invoice INV-2024-003 is due in 24 hours',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      isRead: true
    },
    {
      id: 4,
      type: 'info',
      title: 'Document shared',
      message: 'Michael Brown shared Invoice INV-2024-004 with you',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      isRead: true
    }
  ];

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handbookItems: NavItem[] = [
    { path: '/handbooks/companies', label: 'Companies', icon: Building2 },
    { path: '/handbooks/contracts', label: 'Contracts', icon: ScrollText },
    { path: '/handbooks/incoterms', label: 'Incoterms', icon: Globe },
    { path: '/handbooks/packages', label: 'Packages', icon: Package },
    { path: '/handbooks/currencies', label: 'Currencies', icon: Coins }
  ];

  const navItems: NavItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: FileText },
    { path: '/documents', label: 'My Documents', icon: FolderOpen },
    { path: '/document-sets', label: 'Document Sets', icon: Layers },
    { path: '/templates', label: 'Templates', icon: FileType },
    { path: '/analytics', label: 'Analytics', icon: BarChart2 }
  ];

  const isHandbookActive = handbookItems.some(item => location.pathname.startsWith(item.path));

  return (
    <>
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 h-[50px]">
        <div className="flex items-center justify-between h-full px-6">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-base font-bold text-gray-900">DocuFlow</span>
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
                    className={`flex items-center space-x-1.5 text-sm font-medium ${
                      isActive 
                        ? 'text-blue-600' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {/* Handbooks Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowHandbooksDropdown(!showHandbooksDropdown)}
                  className={`flex items-center space-x-1.5 text-sm font-medium ${
                    isHandbookActive 
                      ? 'text-blue-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Handbooks</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showHandbooksDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showHandbooksDropdown && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <div className="py-1">
                      <Link
                        to="/handbooks"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowHandbooksDropdown(false)}
                      >
                        All Handbooks
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      {handbookItems.map(item => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center space-x-2 px-4 py-2 text-sm ${
                              isActive 
                                ? 'text-blue-600 bg-blue-50' 
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                            onClick={() => setShowHandbooksDropdown(false)}
                          >
                            <Icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Center Search */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search documents..."
                className="w-full h-8 pl-8 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            </div>
          </div>

          {/* Right User Menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button 
              onClick={() => setShowNotifications(true)}
              className="relative p-1 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <User className="w-3.5 h-3.5 text-gray-500" />
                  )}
                </div>
                <span className="text-sm font-medium">{user.name}</span>
                <ChevronDown className="w-3.5 h-3.5" />
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

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
      />
    </>
  );
};

export default Header; 