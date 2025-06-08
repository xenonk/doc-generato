import React from 'react';
import { X, Bell, CheckCircle, AlertCircle, Info, Clock } from 'lucide-react';

interface Notification {
  id: number;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications?: Notification[];
}

const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose, notifications = [] }) => {
  if (!isOpen) return null;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  // Mock notifications data - in real app this would come from props or API
  const mockNotifications: Notification[] = [
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

  const displayNotifications = notifications.length > 0 ? notifications : mockNotifications;
  const unreadCount = displayNotifications.filter(n => !n.isRead).length;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={`fixed right-0 top-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-64px)] overflow-y-auto">
          <div className="divide-y divide-gray-200">
            {displayNotifications.map((notification) => (
              <div 
                key={notification.id}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  !notification.isRead ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${
                      !notification.isRead ? 'text-gray-900' : 'text-gray-600'
                    }`}>
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {notification.message}
                    </p>
                    <div className="flex items-center mt-2 text-xs text-gray-400">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{formatTimeAgo(notification.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {displayNotifications.length === 0 && (
            <div className="flex flex-col items-center justify-center h-48 text-gray-500">
              <Bell className="w-12 h-12 mb-2 opacity-50" />
              <p className="text-sm">No notifications</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationDrawer; 