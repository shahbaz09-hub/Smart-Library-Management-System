import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner@2.0.3';

export interface Notification {
  id: string;
  type: 'due_soon' | 'overdue' | 'returned' | 'reserved' | 'recommendation' | 'achievement' | 'system' | 'fine' | 'new_arrival' | 'book_request' | 'stock_alert' | 'user_registration' | 'book_approved' | 'book_rejected' | 'book_available';
  title: string;
  message: string;
  time: string;
  timestamp: number;
  read: boolean;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  avatar?: string;
  bookCover?: string;
  actionLabel?: string;
  actionUrl?: string;
  dismissible?: boolean;
  role: 'admin' | 'librarian' | 'user';
  userId?: string;
  createdAt: number;
  metadata?: {
    bookId?: string;
    studentRollNumber?: string;
    fineAmount?: number;
    dueDate?: string;
    requestId?: string;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'createdAt' | 'time'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: (role?: string) => void;
  dismissNotification: (id: string) => void;
  getNotificationsByRole: (role: 'admin' | 'librarian' | 'user', userId?: string) => Notification[];
  getUnreadCount: (role: 'admin' | 'librarian' | 'user', userId?: string) => number;
  hasUrgentNotifications: (role: 'admin' | 'librarian' | 'user', userId?: string) => boolean;
  generateBookIssueNotification: (studentName: string, bookTitle: string, dueDate: string, studentRollNumber: string) => void;
  generateBookReturnNotification: (studentName: string, bookTitle: string, studentRollNumber: string) => void;
  generateFineNotification: (studentName: string, amount: number, bookTitle: string, studentRollNumber: string, role: 'admin' | 'user') => void;
  generateBookRequestNotification: (studentName: string, bookTitle: string, studentRollNumber: string, action: 'request' | 'approved' | 'rejected') => void;
  generateStockAlert: (bookTitle: string, currentStock: number, action: 'low_stock' | 'out_of_stock' | 'new_arrival') => void;
  generateSystemNotification: (message: string, type: 'user_registration' | 'system_update' | 'maintenance', priority?: 'low' | 'medium' | 'high') => void;
  sendCustomNotification: (recipients: string[], title: string, message: string, priority?: 'low' | 'medium' | 'high') => void;
  clearOldNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    // Sample admin notifications
    {
      id: 'admin-1',
      type: 'book_request',
      title: 'New Book Request',
      message: 'Aarav Sharma (CSE21001) has requested "Advanced Algorithms in C++" from CSE department.',
      time: '5 minutes ago',
      timestamp: Date.now() - 5 * 60 * 1000,
      read: false,
      priority: 'medium',
      avatar: '👨‍🎓',
      actionLabel: 'Review Request',
      dismissible: true,
      role: 'admin',
      createdAt: Date.now() - 5 * 60 * 1000,
      metadata: {
        studentRollNumber: 'CSE21001',
        bookId: 'book-1'
      }
    },
    {
      id: 'admin-2',
      type: 'fine',
      title: 'Overdue Fine Alert',
      message: 'Priya Patel (MECH21045) has an outstanding fine of ₹85 for 17 days overdue. Total pending fines: ₹235.',
      time: '1 hour ago',
      timestamp: Date.now() - 60 * 60 * 1000,
      read: false,
      priority: 'high',
      avatar: '💰',
      actionLabel: 'View Fine Details',
      dismissible: true,
      role: 'admin',
      createdAt: Date.now() - 60 * 60 * 1000,
      metadata: {
        studentRollNumber: 'MECH21045',
        fineAmount: 85
      }
    },
    {
      id: 'admin-3',
      type: 'stock_alert',
      title: 'Stock Alert - Out of Stock',
      message: '"Database Management Systems" is now out of stock. 5 students waiting in queue. Consider ordering more copies.',
      time: '2 hours ago',
      timestamp: Date.now() - 2 * 60 * 60 * 1000,
      read: false,
      priority: 'urgent',
      bookCover: 'https://images.unsplash.com/photo-1664854953181-b12e6dda8b7c?w=100',
      actionLabel: 'Order Books',
      dismissible: true,
      role: 'admin',
      createdAt: Date.now() - 2 * 60 * 60 * 1000,
      metadata: {
        bookId: 'book-2'
      }
    },
    {
      id: 'admin-4',
      type: 'user_registration',
      title: 'New Student Registered',
      message: 'Rahul Verma (BCA24001) from BCA department has successfully registered. Account pending verification.',
      time: '3 hours ago',
      timestamp: Date.now() - 3 * 60 * 60 * 1000,
      read: true,
      priority: 'low',
      avatar: '🧑‍🎓',
      actionLabel: 'Verify Account',
      dismissible: true,
      role: 'admin',
      createdAt: Date.now() - 3 * 60 * 60 * 1000,
      metadata: {
        studentRollNumber: 'BCA24001'
      }
    },
    {
      id: 'admin-5',
      type: 'returned',
      title: 'Book Returned',
      message: 'Neha Yadav (CIVIL21023) returned "Structural Analysis and Design" on time. No fines applicable.',
      time: '4 hours ago',
      timestamp: Date.now() - 4 * 60 * 60 * 1000,
      read: true,
      priority: 'low',
      bookCover: 'https://images.unsplash.com/photo-1665069181618-5618c9b621ec?w=100',
      dismissible: true,
      role: 'admin',
      createdAt: Date.now() - 4 * 60 * 60 * 1000,
      metadata: {
        studentRollNumber: 'CIVIL21023',
        bookId: 'book-4'
      }
    },

    // Sample user notifications
    {
      id: 'user-1',
      type: 'due_soon',
      title: 'Book Due Soon',
      message: '"Programming in Java" is due in 2 days. Return to avoid fine of ₹5/day after grace period.',
      time: '1 hour ago',
      timestamp: Date.now() - 60 * 60 * 1000,
      read: false,
      priority: 'medium',
      bookCover: 'https://images.unsplash.com/photo-1727522974621-c64b5ea90c0b?w=100',
      actionLabel: 'Renew Book',
      dismissible: true,
      role: 'user',
      userId: 'student-1',
      createdAt: Date.now() - 60 * 60 * 1000,
      metadata: {
        bookId: 'book-7',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    },
    {
      id: 'user-2',
      type: 'book_approved',
      title: 'Book Request Approved! 🎉',
      message: 'Your request for "Software Engineering Principles" has been approved. You can collect it from the library within 2 days.',
      time: '3 hours ago',
      timestamp: Date.now() - 3 * 60 * 60 * 1000,
      read: false,
      priority: 'high',
      bookCover: 'https://images.unsplash.com/photo-1758685733395-dba201403b4d?w=100',
      actionLabel: 'Collect Book',
      dismissible: true,
      role: 'user',
      userId: 'student-1',
      createdAt: Date.now() - 3 * 60 * 60 * 1000,
      metadata: {
        bookId: 'book-8',
        requestId: 'req-1'
      }
    },
    {
      id: 'user-3',
      type: 'fine',
      title: 'Outstanding Fine',
      message: 'You have a fine of ₹45 for returning "Thermodynamics for Engineers" 9 days late. Pay now to issue new books.',
      time: '5 hours ago',
      timestamp: Date.now() - 5 * 60 * 60 * 1000,
      read: false,
      priority: 'high',
      avatar: '💰',
      actionLabel: 'Pay Fine',
      dismissible: true,
      role: 'user',
      userId: 'student-1',
      createdAt: Date.now() - 5 * 60 * 60 * 1000,
      metadata: {
        fineAmount: 45,
        bookId: 'book-3'
      }
    },
    {
      id: 'user-4',
      type: 'book_available',
      title: 'Requested Book Available',
      message: '"Business Management Fundamentals" is now available for issue. Your reservation expires in 48 hours.',
      time: '1 day ago',
      timestamp: Date.now() - 24 * 60 * 60 * 1000,
      read: true,
      priority: 'medium',
      bookCover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      actionLabel: 'Issue Book',
      dismissible: true,
      role: 'user',
      userId: 'student-1',
      createdAt: Date.now() - 24 * 60 * 60 * 1000,
      metadata: {
        bookId: 'book-5'
      }
    },
    {
      id: 'user-5',
      type: 'recommendation',
      title: 'Department Recommendation',
      message: 'Based on your CSE course, you might need "Data Structures and Algorithms in C++" for upcoming exams.',
      time: '2 days ago',
      timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
      read: true,
      priority: 'low',
      bookCover: 'https://images.unsplash.com/photo-1613253932202-686cbcd993b0?w=100',
      actionLabel: 'Issue Book',
      dismissible: true,
      role: 'user',
      userId: 'student-1',
      createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
      metadata: {
        bookId: 'book-1'
      }
    }
  ]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'createdAt' | 'time'>) => {
    const now = Date.now();
    const newNotification: Notification = {
      ...notification,
      id: `notif-${now}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: now,
      createdAt: now,
      time: 'Just now'
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Show toast notification for urgent/high priority
    if (notification.priority === 'urgent' || notification.priority === 'high') {
      toast.error(notification.title, {
        description: notification.message,
        action: notification.actionLabel ? {
          label: notification.actionLabel,
          onClick: () => console.log('Notification action clicked')
        } : undefined
      });
    } else {
      toast.info(notification.title, {
        description: notification.message
      });
    }
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  }, []);

  const markAllAsRead = useCallback((role?: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        (!role || notif.role === role) ? { ...notif, read: true } : notif
      )
    );
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  const getNotificationsByRole = useCallback((role: 'admin' | 'librarian' | 'user', userId?: string) => {
    return notifications.filter(notif => {
      if (role === 'admin' || role === 'librarian') {
        return notif.role === 'admin' || notif.role === 'librarian';
      }
      return notif.role === 'user' && (!notif.userId || notif.userId === userId);
    }).sort((a, b) => {
      // Sort by priority and timestamp
      const priorityOrder: Record<string, number> = { urgent: 4, high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority || 'low'];
      const bPriority = priorityOrder[b.priority || 'low'];
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      return b.timestamp - a.timestamp;
    });
  }, [notifications]);

  const getUnreadCount = useCallback((role: 'admin' | 'librarian' | 'user', userId?: string) => {
    return getNotificationsByRole(role, userId).filter(notif => !notif.read).length;
  }, [getNotificationsByRole]);

  const hasUrgentNotifications = useCallback((role: 'admin' | 'librarian' | 'user', userId?: string) => {
    return getNotificationsByRole(role, userId).some(notif => 
      !notif.read && notif.priority === 'urgent'
    );
  }, [getNotificationsByRole]);

  // Notification generators for different events
  const generateBookIssueNotification = useCallback((studentName: string, bookTitle: string, dueDate: string, studentRollNumber: string) => {
    // Admin notification
    addNotification({
      type: 'system',
      title: 'Book Issued',
      message: `${studentName} (${studentRollNumber}) has issued "${bookTitle}". Due date: ${new Date(dueDate).toLocaleDateString()}.`,
      read: false,
      priority: 'low',
      avatar: '📚',
      actionLabel: 'View Issue Details',
      dismissible: true,
      role: 'admin',
      metadata: {
        studentRollNumber,
        bookId: 'book-temp',
        dueDate
      }
    });

    // Student notification
    addNotification({
      type: 'system',
      title: 'Book Issued Successfully',
      message: `You have successfully issued "${bookTitle}". Please return by ${new Date(dueDate).toLocaleDateString()} to avoid fines.`,
      read: false,
      priority: 'medium',
      avatar: '✅',
      actionLabel: 'View My Books',
      dismissible: true,
      role: 'user',
      userId: studentRollNumber,
      metadata: {
        bookId: 'book-temp',
        dueDate
      }
    });
  }, [addNotification]);

  const generateBookReturnNotification = useCallback((studentName: string, bookTitle: string, studentRollNumber: string) => {
    // Admin notification
    addNotification({
      type: 'returned',
      title: 'Book Returned',
      message: `${studentName} (${studentRollNumber}) has returned "${bookTitle}".`,
      read: false,
      priority: 'low',
      avatar: '📖',
      dismissible: true,
      role: 'admin',
      metadata: {
        studentRollNumber,
        bookId: 'book-temp'
      }
    });

    // Student notification
    addNotification({
      type: 'returned',
      title: 'Book Returned Successfully',
      message: `You have successfully returned "${bookTitle}". Thank you for returning on time!`,
      read: false,
      priority: 'low',
      avatar: '✅',
      dismissible: true,
      role: 'user',
      userId: studentRollNumber,
      metadata: {
        bookId: 'book-temp'
      }
    });
  }, [addNotification]);

  const generateFineNotification = useCallback((studentName: string, amount: number, bookTitle: string, studentRollNumber: string, role: 'admin' | 'user') => {
    if (role === 'admin') {
      addNotification({
        type: 'fine',
        title: 'New Fine Generated',
        message: `Fine of ₹${amount} generated for ${studentName} (${studentRollNumber}) for overdue book "${bookTitle}".`,
        read: false,
        priority: 'medium',
        avatar: '💰',
        actionLabel: 'View Fine Details',
        dismissible: true,
        role: 'admin',
        metadata: {
          studentRollNumber,
          fineAmount: amount,
          bookId: 'book-temp'
        }
      });
    } else {
      addNotification({
        type: 'fine',
        title: 'Fine Generated',
        message: `You have been charged ₹${amount} for overdue book "${bookTitle}". Please pay to issue new books.`,
        read: false,
        priority: 'high',
        avatar: '💰',
        actionLabel: 'Pay Fine',
        dismissible: true,
        role: 'user',
        userId: studentRollNumber,
        metadata: {
          fineAmount: amount,
          bookId: 'book-temp'
        }
      });
    }
  }, [addNotification]);

  const generateBookRequestNotification = useCallback((studentName: string, bookTitle: string, studentRollNumber: string, action: 'request' | 'approved' | 'rejected') => {
    if (action === 'request') {
      // Admin notification
      addNotification({
        type: 'book_request',
        title: 'New Book Request',
        message: `${studentName} (${studentRollNumber}) has requested "${bookTitle}".`,
        read: false,
        priority: 'medium',
        avatar: '📋',
        actionLabel: 'Review Request',
        dismissible: true,
        role: 'admin',
        metadata: {
          studentRollNumber,
          bookId: 'book-temp',
          requestId: 'req-temp'
        }
      });
    } else if (action === 'approved') {
      // Student notification
      addNotification({
        type: 'book_approved',
        title: 'Book Request Approved! 🎉',
        message: `Your request for "${bookTitle}" has been approved. You can collect it from the library within 2 days.`,
        read: false,
        priority: 'high',
        avatar: '✅',
        actionLabel: 'Collect Book',
        dismissible: true,
        role: 'user',
        userId: studentRollNumber,
        metadata: {
          bookId: 'book-temp',
          requestId: 'req-temp'
        }
      });
    } else if (action === 'rejected') {
      // Student notification
      addNotification({
        type: 'book_rejected',
        title: 'Book Request Rejected',
        message: `Your request for "${bookTitle}" has been rejected. Please contact the librarian for more details.`,
        read: false,
        priority: 'medium',
        avatar: '❌',
        actionLabel: 'Contact Librarian',
        dismissible: true,
        role: 'user',
        userId: studentRollNumber,
        metadata: {
          bookId: 'book-temp',
          requestId: 'req-temp'
        }
      });
    }
  }, [addNotification]);

  const generateStockAlert = useCallback((bookTitle: string, currentStock: number, action: 'low_stock' | 'out_of_stock' | 'new_arrival') => {
    let priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium';
    let message = '';
    let title = '';

    switch (action) {
      case 'low_stock':
        priority = 'high';
        title = 'Low Stock Alert';
        message = `"${bookTitle}" is running low on stock. Only ${currentStock} copies remaining.`;
        break;
      case 'out_of_stock':
        priority = 'urgent';
        title = 'Out of Stock Alert';
        message = `"${bookTitle}" is now out of stock. Consider ordering more copies.`;
        break;
      case 'new_arrival':
        priority = 'medium';
        title = 'New Book Arrival';
        message = `"${bookTitle}" has arrived and is now available for issue. ${currentStock} copies added to inventory.`;
        break;
    }

    addNotification({
      type: 'stock_alert',
      title,
      message,
      read: false,
      priority,
      avatar: action === 'new_arrival' ? '📚' : '⚠️',
      actionLabel: action === 'new_arrival' ? 'View Book' : 'Order Books',
      dismissible: true,
      role: 'admin',
      metadata: {
        bookId: 'book-temp'
      }
    });
  }, [addNotification]);

  const generateSystemNotification = useCallback((message: string, type: 'user_registration' | 'system_update' | 'maintenance', priority: 'low' | 'medium' | 'high' = 'low') => {
    let title = '';
    let avatar = '🔔';

    switch (type) {
      case 'user_registration':
        title = 'New User Registration';
        avatar = '👨‍🎓';
        break;
      case 'system_update':
        title = 'System Update';
        avatar = '🔄';
        break;
      case 'maintenance':
        title = 'System Maintenance';
        avatar = '🔧';
        break;
    }

    addNotification({
      type: 'system',
      title,
      message,
      read: false,
      priority,
      avatar,
      dismissible: true,
      role: 'admin'
    });
  }, [addNotification]);

  const sendCustomNotification = useCallback((recipients: string[], title: string, message: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    recipients.forEach(userId => {
      addNotification({
        type: 'system',
        title,
        message,
        read: false,
        priority,
        avatar: '📢',
        dismissible: true,
        role: 'user',
        userId
      });
    });
  }, [addNotification]);

  const clearOldNotifications = useCallback(() => {
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    setNotifications(prev => 
      prev.filter(notif => notif.createdAt > thirtyDaysAgo)
    );
  }, []);

  // Auto-clear old notifications every hour
  useEffect(() => {
    const interval = setInterval(clearOldNotifications, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [clearOldNotifications]);

  const value: NotificationContextType = {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    getNotificationsByRole,
    getUnreadCount,
    hasUrgentNotifications,
    generateBookIssueNotification,
    generateBookReturnNotification,
    generateFineNotification,
    generateBookRequestNotification,
    generateStockAlert,
    generateSystemNotification,
    sendCustomNotification,
    clearOldNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};