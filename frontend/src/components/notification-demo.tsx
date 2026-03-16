import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useNotifications } from './notification-service';
import { 
  Bell, 
  BookOpen, 
  Users, 
  AlertTriangle, 
  DollarSign,
  Package,
  Settings,
  Zap
} from 'lucide-react';

interface NotificationDemoProps {
  userRole: 'admin' | 'librarian' | 'user';
  currentUser?: { name: string; rollNumber?: string } | null;
}

export function NotificationDemo({ userRole, currentUser }: NotificationDemoProps) {
  const {
    generateBookIssueNotification,
    generateBookReturnNotification,
    generateFineNotification,
    generateBookRequestNotification,
    generateStockAlert,
    generateSystemNotification,
    sendCustomNotification
  } = useNotifications();

  const handleDemoBookIssue = () => {
    const studentName = currentUser?.name || 'Demo Student';
    const studentRollNumber = currentUser?.rollNumber || 'DEMO001';
    const bookTitle = 'Advanced Data Structures';
    const dueDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString();
    
    generateBookIssueNotification(studentName, bookTitle, dueDate, studentRollNumber);
  };

  const handleDemoBookReturn = () => {
    const studentName = currentUser?.name || 'Demo Student';
    const studentRollNumber = currentUser?.rollNumber || 'DEMO001';
    const bookTitle = 'Software Engineering Principles';
    
    generateBookReturnNotification(studentName, bookTitle, studentRollNumber);
  };

  const handleDemoFine = () => {
    const studentName = currentUser?.name || 'Demo Student';
    const studentRollNumber = currentUser?.rollNumber || 'DEMO001';
    const bookTitle = 'Database Management Systems';
    const amount = 45;
    
    generateFineNotification(studentName, amount, bookTitle, studentRollNumber, userRole === 'admin' ? 'admin' : 'user');
  };

  const handleDemoBookRequest = () => {
    const studentName = currentUser?.name || 'Demo Student';
    const studentRollNumber = currentUser?.rollNumber || 'DEMO001';
    const bookTitle = 'Machine Learning Fundamentals';
    
    generateBookRequestNotification(studentName, bookTitle, studentRollNumber, 'request');
  };

  const handleDemoBookApproval = () => {
    const studentName = currentUser?.name || 'Demo Student';
    const studentRollNumber = currentUser?.rollNumber || 'DEMO001';
    const bookTitle = 'Machine Learning Fundamentals';
    
    generateBookRequestNotification(studentName, bookTitle, studentRollNumber, 'approved');
  };

  const handleDemoStockAlert = () => {
    generateStockAlert('React Development Guide', 2, 'low_stock');
  };

  const handleDemoOutOfStock = () => {
    generateStockAlert('Computer Networks', 0, 'out_of_stock');
  };

  const handleDemoNewArrival = () => {
    generateStockAlert('Artificial Intelligence: A Modern Approach', 5, 'new_arrival');
  };

  const handleDemoMaintenance = () => {
    generateSystemNotification(
      'Library system will be under maintenance from 2 AM to 4 AM tomorrow. Online services will be temporarily unavailable.',
      'maintenance',
      'medium'
    );
  };

  const handleDemoCustomNotification = () => {
    const recipients = userRole === 'admin' 
      ? ['CSE21001', 'MECH21045', 'BCA21089'] 
      : [currentUser?.rollNumber || 'DEMO001'];
    
    sendCustomNotification(
      recipients,
      'Exam Week Library Hours',
      'Library hours have been extended during exam week. New timings: 7 AM - 11 PM daily. Study areas now available 24/7.',
      'medium'
    );
  };

  const demoActions = [
    {
      title: 'Book Issue',
      description: 'Simulate a book being issued',
      icon: BookOpen,
      action: handleDemoBookIssue,
      color: 'text-blue-600',
      roles: ['admin', 'librarian', 'user']
    },
    {
      title: 'Book Return',
      description: 'Simulate a book being returned',
      icon: BookOpen,
      action: handleDemoBookReturn,
      color: 'text-green-600',
      roles: ['admin', 'librarian', 'user']
    },
    {
      title: 'Generate Fine',
      description: 'Create an overdue fine notification',
      icon: DollarSign,
      action: handleDemoFine,
      color: 'text-red-600',
      roles: ['admin', 'librarian', 'user']
    },
    {
      title: 'Book Request',
      description: 'Submit a new book request',
      icon: BookOpen,
      action: handleDemoBookRequest,
      color: 'text-purple-600',
      roles: ['user']
    },
    {
      title: 'Approve Request',
      description: 'Approve a book request',
      icon: BookOpen,
      action: handleDemoBookApproval,
      color: 'text-green-600',
      roles: ['admin', 'librarian']
    },
    {
      title: 'Low Stock Alert',
      description: 'Trigger low stock warning',
      icon: AlertTriangle,
      action: handleDemoStockAlert,
      color: 'text-yellow-600',
      roles: ['admin', 'librarian']
    },
    {
      title: 'Out of Stock',
      description: 'Mark book as out of stock',
      icon: AlertTriangle,
      action: handleDemoOutOfStock,
      color: 'text-red-600',
      roles: ['admin', 'librarian']
    },
    {
      title: 'New Arrival',
      description: 'Announce new book arrival',
      icon: Package,
      action: handleDemoNewArrival,
      color: 'text-green-600',
      roles: ['admin', 'librarian']
    },
    {
      title: 'Maintenance Notice',
      description: 'System maintenance announcement',
      icon: Settings,
      action: handleDemoMaintenance,
      color: 'text-blue-600',
      roles: ['admin', 'librarian']
    },
    {
      title: 'Custom Message',
      description: 'Send custom notification',
      icon: Bell,
      action: handleDemoCustomNotification,
      color: 'text-purple-600',
      roles: ['admin', 'librarian', 'user']
    }
  ];

  const availableActions = demoActions.filter(action => 
    action.roles.includes(userRole)
  );

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          Notification System Demo
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Click buttons below to test the notification system with realistic scenarios
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {availableActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={action.action}
              className="h-auto p-3 justify-start hover:bg-accent"
            >
              <div className="flex items-center gap-3">
                <action.icon className={`h-4 w-4 ${action.color}`} />
                <div className="text-left">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {action.description}
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
            <Bell className="h-4 w-4" />
            <span className="text-sm font-medium">Role-based Notifications</span>
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
            {userRole === 'admin' ? 
              'As an Admin, you see system alerts, book requests, stock updates, and student activities.' :
              userRole === 'librarian' ?
              'As a Librarian, you can manage book issues, returns, and see relevant system notifications.' :
              'As a Student, you see your book due dates, fines, request updates, and library announcements.'
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
}