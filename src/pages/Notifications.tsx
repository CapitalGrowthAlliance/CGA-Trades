import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info';
  isRead: boolean;
  createdAt: string;
}

const renderWithNoTranslate = (text: string) => {
  const parts = text.split(/(Capital Growth Alliance|CGA)/g);
  return parts.map((part, i) => 
    (part === 'Capital Growth Alliance' || part === 'CGA') ? 
      <span key={i} className="notranslate font-bold">{part}</span> : 
      part
  );
};

export default function Notifications() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Mock data consistent with dropdown
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: t('notifications.welcome_title', 'Welcome!'),
        message: t('notifications.welcome_message', 'Welcome to Capital Growth Alliance. Start investing today.'),
        type: 'info',
        isRead: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: t('notifications.security_title', 'Security Alert'),
        message: t('notifications.security_message', 'New login detected from a new device.'),
        type: 'warning',
        isRead: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      }
    ];
    // Sort chronologically (newest first)
    setNotifications(mockNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }, [t]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
      case 'warning': return <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />;
      case 'info': return <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
      default: return <Info className="w-6 h-6 text-text-muted" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/')}
          className="p-2 rounded-full hover:bg-bg-secondary transition-colors text-text-secondary hover:text-text-primary"
          aria-label="Back to Home"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-text-primary">{t('notifications.page_title', 'Notifications')}</h1>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="bg-bg-secondary rounded-2xl p-12 text-center">
            <Bell className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-20" />
            <p className="text-text-secondary">{t('notifications.empty', 'No notifications yet')}</p>
          </div>
        ) : (
          notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-bg-secondary border border-border-light rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex gap-4">
                <div className="shrink-0 mt-1">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-text-primary">
                      {renderWithNoTranslate(notification.title)}
                    </h3>
                    <span className="text-xs text-text-muted whitespace-nowrap">
                      {new Date(notification.createdAt).toLocaleDateString()} {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-text-secondary leading-relaxed">
                    {renderWithNoTranslate(notification.message)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
