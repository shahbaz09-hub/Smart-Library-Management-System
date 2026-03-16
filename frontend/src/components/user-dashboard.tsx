import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { formatCurrency } from './ui/currency-utils';
import { 
  BookOpen, 
  Clock, 
  Star, 
  TrendingUp,
  Calendar,
  Bell,
  Heart,
  Eye,
  CheckCircle,
  AlertTriangle,
  BookMarked,
  Timer,
  Target,
  Award,
  Bookmark,
  MoreVertical,
  IndianRupee,
  GraduationCap
} from 'lucide-react';
import { BorrowedBooksSection } from './borrowed-books-section';
import { UserRecommendations } from './user-recommendations';
import { NotificationsPanel } from './notifications-panel';
import { ReadingGoalsCard } from './reading-goals-card';

interface UserDashboardProps {
  currentUser: { name: string; email: string } | null;
  books: any[];
  onBookSelect: (book: any) => void;
  onBorrow: (bookId: string) => void;
  onReserve: (bookId: string) => void;
}

interface BorrowedBook {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  department: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'issued' | 'overdue' | 'due_soon';
  fine: number; // In INR
  isbn: string;
}

export function UserDashboard({ 
  currentUser, 
  books, 
  onBookSelect, 
  onBorrow, 
  onReserve 
}: UserDashboardProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock borrowed books data - College Academic Books
  const borrowedBooks: BorrowedBook[] = [
    {
      id: '1',
      title: 'Data Structures and Algorithms in C++',
      author: 'Dr. Rajesh Kumar',
      coverUrl: 'https://images.unsplash.com/photo-1613253932202-686cbcd993b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHNjaWVuY2UlMjBwcm9ncmFtbWluZyUyMGJvb2t8ZW58MXx8fHwxNzU5MjEzMzc0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      department: 'CSE',
      borrowDate: '2024-01-05',
      dueDate: '2024-01-20',
      status: 'issued',
      fine: 0,
      isbn: '978-81-203-5467-2'
    },
    {
      id: '2',
      title: 'Thermodynamics for Engineers',
      author: 'Prof. Amit Verma',
      coverUrl: 'https://images.unsplash.com/photo-1732304720116-4195b021d8d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVybW9keW5hbWljcyUyMGVuZ2luZWVyaW5nJTIwYm9va3xlbnwxfHx8fDE3NTkyMTM0MDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      department: 'Mechanical',
      borrowDate: '2023-12-20',
      dueDate: '2024-01-04',
      status: 'overdue',
      fine: 75, // ₹5/day for 15 days overdue
      isbn: '978-81-203-6789-3'
    },
    {
      id: '3',
      title: 'Business Management Fundamentals',
      author: 'Prof. Rakesh Gupta', 
      coverUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1hbmFnZW1lbnQlMjBib29rfGVufDF8fHx8MTc1OTIxMzQxNXww&ixlib=rb-4.1.0&q=80&w=1080',
      department: 'BBA',
      borrowDate: '2024-01-15',
      dueDate: '2024-01-30',
      status: 'due_soon',
      fine: 0,
      isbn: '978-81-203-8901-5'
    }
  ];

  // Calculate total fines
  const totalFines = borrowedBooks.reduce((sum, book) => sum + book.fine, 0);
  
  const userStats = [
    {
      label: 'Books Issued',
      value: `${borrowedBooks.length}`,
      change: 'currently borrowed',
      icon: BookOpen,
      color: 'from-[#189ab4] to-[#75e6da]',
      trend: 'neutral'
    },
    {
      label: 'Overdue Books',
      value: `${borrowedBooks.filter(book => book.status === 'overdue').length}`,
      change: 'needs attention',
      icon: AlertTriangle,
      color: 'from-red-400 to-red-600',
      trend: 'negative'
    },
    {
      label: 'Pending Fines',
      value: `₹${totalFines}`,
      change: 'total due',
      icon: IndianRupee,
      color: 'from-orange-400 to-orange-600',
      trend: totalFines > 0 ? 'negative' : 'positive'
    },
    {
      label: 'Due Soon',
      value: `${borrowedBooks.filter(book => book.status === 'due_soon').length}`,
      change: 'books to return',
      icon: Clock,
      color: 'from-yellow-400 to-yellow-600',
      trend: 'neutral'
    }
  ];

  const recentActivity: Array<{
    id: string;
    type: string;
    book: string;
    time: string;
    amount?: number;
  }> = [
    {
      id: '1',
      type: 'borrowed',
      book: 'Business Management Fundamentals',
      time: '2 days ago'
    },
    {
      id: '2',
      type: 'returned',
      book: 'Database Management Systems',
      time: '1 week ago'
    },
    {
      id: '3',
      type: 'fine_paid',
      book: 'Software Engineering Principles',
      time: '2 weeks ago',
      amount: 25
    },
    {
      id: '4',
      type: 'overdue',
      book: 'Thermodynamics for Engineers',
      time: '15 days ago'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'borrowed': return <BookOpen className="h-4 w-4 text-blue-500" />;
      case 'returned': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fine_paid': return <IndianRupee className="h-4 w-4 text-emerald-500" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <BookMarked className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#189ab4] to-[#75e6da] bg-clip-text text-transparent">
            Welcome back, {currentUser?.name?.split(' ')[0] || 'Student'}! 🎓
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your issued books and track due dates
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setShowNotifications(true)}
            className="border-primary/20 hover:bg-primary/10 relative"
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
              {borrowedBooks.filter(book => book.status === 'overdue' || book.status === 'due_soon').length}
            </Badge>
          </Button>
          <Button className="bg-gradient-to-r from-[#189ab4] to-[#75e6da] hover:opacity-90">
            <BookOpen className="h-4 w-4 mr-2" />
            Browse Books
          </Button>
        </div>
      </motion.div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {userStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Card className="glass-card border-none hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Currently Reading */}
          <BorrowedBooksSection 
            borrowedBooks={borrowedBooks}
            onBookSelect={onBookSelect}
          />

          {/* Recommendations */}
          <UserRecommendations 
            books={books}
            onBookSelect={onBookSelect}
            onBorrow={onBorrow}
            onReserve={onReserve}
          />
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Fine Alert Card */}
          {totalFines > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="glass-card border-none bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-200/20">
                <CardContent className="p-6 text-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-orange-500 mb-4"
                  >
                    <IndianRupee className="h-8 w-8 text-white" />
                  </motion.div>
                  <h3 className="font-semibold mb-2 text-red-700 dark:text-red-300">Outstanding Fine</h3>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400 mb-3">
                    {formatCurrency(totalFines)}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Pay your fines to issue new books
                  </p>
                  <Button className="bg-gradient-to-r from-red-500 to-orange-500 text-white hover:opacity-90">
                    Pay Now
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-card border-none">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Books Borrowed</span>
                  <Badge variant="outline">{borrowedBooks.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Overdue</span>
                  <Badge className="bg-red-500/20 text-red-700 dark:text-red-300">
                    {borrowedBooks.filter(book => book.status === 'overdue').length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Due Soon</span>
                  <Badge className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-300">
                    {borrowedBooks.filter(book => book.status === 'due_soon').length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Fines</span>
                  <Badge className={`${totalFines > 0 ? 'bg-red-500/20 text-red-700 dark:text-red-300' : 'bg-green-500/20 text-green-700 dark:text-green-300'}`}>
                    ₹{totalFines}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="glass-card border-none">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5 text-primary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      {getActivityIcon(activity.type)}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.book}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                      {activity.amount && (
                        <Badge className="bg-green-500/20 text-green-700 dark:text-green-300">
                          ₹{activity.amount}
                        </Badge>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Student Achievement Badge */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="glass-card border-none bg-gradient-to-br from-primary/10 to-secondary/10">
              <CardContent className="p-6 text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#189ab4] to-[#75e6da] mb-4"
                >
                  <GraduationCap className="h-8 w-8 text-white" />
                </motion.div>
                <h3 className="font-semibold mb-2">Academic Excellence</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Consistent library usage this semester!
                </p>
                <Badge className="bg-gradient-to-r from-[#189ab4] to-[#75e6da] text-white">
                  Active Student
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Notifications Panel */}
      <NotificationsPanel 
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </div>
  );
}