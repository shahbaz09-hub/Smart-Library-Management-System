import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Skeleton } from './ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { formatCurrency } from './ui/currency-utils';
import { 
  DollarSign, 
  AlertTriangle, 
  Clock, 
  User, 
  Mail, 
  TrendingUp,
  Search,
  Filter,
  Download,
  Calendar,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Eye,
  CreditCard,
  Send,
  Percent
} from 'lucide-react';
import { FinesTable } from './fines-table';
import { SendReminderModal } from './send-reminder-modal';
import { ApplyDiscountModal } from './apply-discount-modal';
import { FineAnalyticsCharts } from './fine-analytics-charts';
import { PaymentModal } from './payment-modal';

interface Fine {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  bookTitle: string;
  bookId: string;
  amount: number;
  dueDate: string;
  daysPastDue: number;
  status: 'pending' | 'paid' | 'waived' | 'overdue';
  issueDate: string;
  lastReminder?: string;
  paymentDate?: string;
  discountApplied?: number;
}

interface FineManagementPageProps {
  userRole: 'admin' | 'librarian' | 'user';
}

export function FineManagementPage({ userRole }: FineManagementPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedFines, setSelectedFines] = useState<string[]>([]);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedFine, setSelectedFine] = useState<Fine | null>(null);

  // Mock fine data with Indian names and amounts in INR
  const [fines, setFines] = useState<Fine[]>([
    {
      id: '1',
      userId: 'user_001',
      userName: 'Aarav Sharma',
      userEmail: 'aarav.sharma@college.edu',
      bookTitle: 'Data Structures and Algorithms in C++',
      bookId: 'book_001',
      amount: 75,
      dueDate: '2024-01-10',
      daysPastDue: 15,
      status: 'overdue',
      issueDate: '2024-01-10',
      lastReminder: '2024-01-20'
    },
    {
      id: '2',
      userId: 'user_002',
      userName: 'Priya Patel',
      userEmail: 'priya.patel@college.edu',
      bookTitle: 'Database Management Systems',
      bookId: 'book_002',
      amount: 50,
      dueDate: '2024-01-15',
      daysPastDue: 10,
      status: 'pending',
      issueDate: '2024-01-15'
    },
    {
      id: '3',
      userId: 'user_003',
      userName: 'Aditya Verma',
      userEmail: 'aditya.verma@college.edu',
      bookTitle: 'Thermodynamics for Engineers',
      bookId: 'book_003',
      amount: 85,
      dueDate: '2024-01-08',
      daysPastDue: 17,
      status: 'paid',
      issueDate: '2024-01-08',
      paymentDate: '2024-01-22'
    },
    {
      id: '4',
      userId: 'user_004',
      userName: 'Isha Singh',
      userEmail: 'isha.singh@college.edu',
      bookTitle: 'Business Management Fundamentals',
      bookId: 'book_004',
      amount: 100,
      dueDate: '2024-01-05',
      daysPastDue: 20,
      status: 'overdue',
      issueDate: '2024-01-05',
      lastReminder: '2024-01-18'
    },
    {
      id: '5',
      userId: 'user_005',
      userName: 'Arjun Gupta',
      userEmail: 'arjun.gupta@college.edu',
      bookTitle: 'Programming in Java',
      bookId: 'book_005',
      amount: 35,
      dueDate: '2024-01-18',
      daysPastDue: 7,
      status: 'pending',
      issueDate: '2024-01-18'
    }
  ]);

  const fineStats = {
    totalFines: fines.length,
    totalAmount: fines.reduce((sum, fine) => sum + fine.amount, 0),
    pendingAmount: fines.filter(f => f.status === 'pending' || f.status === 'overdue').reduce((sum, fine) => sum + fine.amount, 0),
    collectedAmount: fines.filter(f => f.status === 'paid').reduce((sum, fine) => sum + fine.amount, 0),
    overdueCount: fines.filter(f => f.status === 'overdue').length
  };

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredFines = fines.filter(fine => {
    const matchesSearch = 
      fine.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fine.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fine.userEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || fine.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleBulkReminder = () => {
    if (selectedFines.length > 0) {
      setShowReminderModal(true);
    }
  };

  const handleBulkDiscount = () => {
    if (selectedFines.length > 0) {
      setShowDiscountModal(true);
    }
  };

  const handlePayFine = (fine: Fine) => {
    setSelectedFine(fine);
    setShowPaymentModal(true);
  };

  const handleFineUpdate = (fineId: string, updates: Partial<Fine>) => {
    setFines(prev => prev.map(fine => 
      fine.id === fineId ? { ...fine, ...updates } : fine
    ));
  };

  if (isLoading) {
    return <FineManagementSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#189ab4] to-[#75e6da] bg-clip-text text-transparent">
            Fine Management 💰
          </h1>
          <p className="text-muted-foreground mt-1">
            Track, collect, and manage library fines efficiently
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-primary/20 hover:bg-primary/10">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-gradient-to-r from-[#189ab4] to-[#75e6da] hover:opacity-90">
            <Calendar className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Total Fines',
            value: fineStats.totalFines.toString(),
            subtitle: 'Active cases',
            icon: DollarSign,
            color: 'from-[#189ab4] to-[#75e6da]',
            trend: '+12%'
          },
          {
            title: 'Pending Amount',
            value: formatCurrency(fineStats.pendingAmount),
            subtitle: 'Outstanding',
            icon: Clock,
            color: 'from-yellow-400 to-orange-500',
            trend: '-5%'
          },
          {
            title: 'Collected Today',
            value: formatCurrency(fineStats.collectedAmount),
            subtitle: 'This month',
            icon: CheckCircle,
            color: 'from-green-400 to-emerald-600',
            trend: '+28%'
          },
          {
            title: 'Overdue Fines',
            value: fineStats.overdueCount.toString(),
            subtitle: 'Urgent attention',
            icon: AlertTriangle,
            color: 'from-red-400 to-red-600',
            trend: '+3%'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Card className="glass-card border-none hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-500">{stat.trend}</span>
                  <span className="text-xs text-muted-foreground ml-1">vs last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 glass-card">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-card border-none">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4 items-center">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, email, or book title..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 border border-border rounded-md bg-background text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="overdue">Overdue</option>
                      <option value="paid">Paid</option>
                      <option value="waived">Waived</option>
                    </select>
                    
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      More Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Bulk Actions */}
          <AnimatePresence>
            {selectedFines.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-20 right-6 z-50"
              >
                <Card className="glass-card border-none shadow-2xl">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">
                        {selectedFines.length} selected
                      </span>
                      <Button
                        size="sm"
                        onClick={handleBulkReminder}
                        className="bg-gradient-to-r from-[#189ab4] to-[#75e6da] hover:opacity-90"
                      >
                        <Send className="h-3 w-3 mr-1" />
                        Send Reminders
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleBulkDiscount}
                        className="border-primary/20 hover:bg-primary/10"
                      >
                        <Percent className="h-3 w-3 mr-1" />
                        Apply Discount
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Fines Table */}
          <FinesTable
            fines={filteredFines}
            selectedFines={selectedFines}
            onSelectionChange={setSelectedFines}
            onPayFine={handlePayFine}
            onUpdateFine={handleFineUpdate}
            userRole={userRole}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <FineAnalyticsCharts fines={fines} />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <Card className="glass-card border-none">
              <CardHeader>
                <CardTitle>Monthly Report</CardTitle>
              </CardHeader>
              <CardContent className="text-center py-8">
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Generate detailed monthly fine collection reports
                </p>
                <Button className="bg-gradient-to-r from-[#189ab4] to-[#75e6da]">
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card border-none">
              <CardHeader>
                <CardTitle>User Analytics</CardTitle>
              </CardHeader>
              <CardContent className="text-center py-8">
                <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Analyze user fine patterns and behavior
                </p>
                <Button variant="outline" className="border-primary/20 hover:bg-primary/10">
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <SendReminderModal
        isOpen={showReminderModal}
        onClose={() => setShowReminderModal(false)}
        selectedFines={selectedFines.map(id => fines.find(f => f.id === id)!).filter(Boolean)}
        onReminderSent={() => {
          setShowReminderModal(false);
          setSelectedFines([]);
        }}
      />

      <ApplyDiscountModal
        isOpen={showDiscountModal}
        onClose={() => setShowDiscountModal(false)}
        selectedFines={selectedFines.map(id => fines.find(f => f.id === id)!).filter(Boolean)}
        onDiscountApplied={(fineIds, discount) => {
          fineIds.forEach(id => {
            handleFineUpdate(id, { discountApplied: discount });
          });
          setShowDiscountModal(false);
          setSelectedFines([]);
        }}
      />

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        fine={selectedFine}
        onPaymentComplete={(fineId) => {
          handleFineUpdate(fineId, { 
            status: 'paid', 
            paymentDate: new Date().toISOString().split('T')[0] 
          });
          setShowPaymentModal(false);
          setSelectedFine(null);
        }}
      />
    </div>
  );
}

// Loading skeleton component
function FineManagementSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="glass-card border-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-12 w-12 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass-card border-none">
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}