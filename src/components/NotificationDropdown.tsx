import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, CheckCircle2, AlertCircle, Info, ArrowDownCircle, ArrowUpCircle, Gift } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

interface AppNotification {
  id: string;
  userId: string;
  message: string;
  type: 'deposit' | 'withdrawal' | 'bonus';
  read: boolean;
  timestamp: any;
}

const renderWithNoTranslate = (text: string) => {
  const parts = text.split(/(Capital Growth Alliance|CGA)/g);
  return parts.map((part, i) => 
    (part === 'Capital Growth Alliance' || part === 'CGA') ? 
      <span key={i} className="notranslate">{part}</span> : 
      part
  );
};

export default function NotificationDropdown() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs: AppNotification[] = [];
      let unread = 0;
      snapshot.forEach((doc) => {
        const data = doc.data() as Omit<AppNotification, 'id'>;
        notifs.push({ id: doc.id, ...data });
        if (!data.read) unread++;
      });
      setNotifications(notifs);
      setUnreadCount(unread);
    }, (error) => {
      console.error("Error fetching notifications:", error);
    });

    return () => unsubscribe();
  }, [user]);

  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'notifications', id), { read: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    if (!user || unreadCount === 0) return;
    try {
      const batch = writeBatch(db);
      notifications.forEach(n => {
        if (!n.read) {
          batch.update(doc(db, 'notifications', n.id), { read: true });
        }
      });
      await batch.commit();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <ArrowDownCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'withdrawal': return <ArrowUpCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'bonus': return <Gift className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      default: return <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    }
  };

  const getTitle = (type: string) => {
    switch (type) {
      case 'deposit': return t('notifications.deposit_title', 'Deposit Update');
      case 'withdrawal': return t('notifications.withdrawal_title', 'Withdrawal Update');
      case 'bonus': return t('notifications.bonus_title', 'Referral Bonus');
      default: return t('notifications.update_title', 'System Update');
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-text-secondary hover:text-text-primary transition-colors rounded-full hover:bg-bg-hover focus:outline-none"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-bg-primary"></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-72 rounded-xl bg-bg-secondary border border-border-light shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border-light bg-bg-hover">
                <h3 className="text-sm font-bold text-text-primary">{t('notifications.title', 'Notifications')}</h3>
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="text-xs text-accent-primary hover:text-accent-hover transition-colors font-medium">
                    {t('notifications.mark_all_read', 'Mark all as read')}
                  </button>
                )}
              </div>

              <div className="max-h-[350px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-text-muted text-sm">
                    {t('notifications.empty', 'No new notifications')}
                  </div>
                ) : (
                  <div className="divide-y divide-border-light">
                    {notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`px-4 py-3 hover:bg-bg-hover transition-colors cursor-pointer flex items-start gap-3 ${!notification.read ? 'bg-accent-primary/5' : ''}`}
                        onClick={() => {
                          if (!notification.read) markAsRead(notification.id);
                          setIsOpen(false);
                          // navigate('/notifications'); // Optional: navigate to a full notifications page if it exists
                        }}
                      >
                        <div className="shrink-0 mt-0.5">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold truncate ${!notification.read ? 'text-text-primary' : 'text-text-secondary'}`}>
                            {getTitle(notification.type)}
                          </p>
                          <p className={`text-xs mt-0.5 line-clamp-2 ${!notification.read ? 'text-text-primary/80' : 'text-text-muted'}`}>
                            {renderWithNoTranslate(notification.message)}
                          </p>
                          {notification.timestamp && (
                            <p className="text-[10px] text-text-muted mt-1">
                              {notification.timestamp?.toDate ? new Date(notification.timestamp.toDate()).toLocaleString() : ''}
                            </p>
                          )}
                        </div>
                        {!notification.read && (
                          <div className="shrink-0 w-2 h-2 bg-accent-primary rounded-full mt-1.5"></div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
