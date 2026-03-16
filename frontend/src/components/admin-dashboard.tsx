import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { formatCurrency } from './ui/currency-utils';
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  UserPlus, 
  Plus, 
  Bell, 
  TrendingUp, 
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Mail,
  Phone,
  MapPin,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  UserCheck
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { AddUserModal } from './add-user-modal';
import { AddBookModal } from './add-book-modal';
import { SendReminderModal } from './send-reminder-modal';
import { AdminAnalyticsCharts } from './admin-analytics-charts';

interface AdminDashboardProps {
  onBookAdd?: (book: any) => void;
  onUserAdd?: (user: any) => void;
  onReminderSend?: (reminder: any) => void;
}

interface User {
  id: string;
  name: string;
  rollNumber: string; // Primary key for students
  email: string;
  department: string;
  semester: number;
  role: 'user' | 'librarian';
  status: 'active' | 'inactive' | 'suspended';
  booksCount: number;
  fines: number;
  joinDate: string;
  lastActive: string;
}

interface Fine {
  id: string;
  userId: string;
  userName: string;
  rollNumber: string;
  bookTitle: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  daysOverdue: number;
  department: string;
}

export function AdminDashboard({ onBookAdd, onUserAdd, onReminderSend }: AdminDashboardProps) {
  const [stats, setStats] = useState({
    totalBooks: 0,
    activeUsers: 0,
    pendingFines: 0,
    totalRevenue: 0
  });

  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddBook, setShowAddBook] = useState(false);
  const [showSendReminder, setShowSendReminder] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedFines, setSelectedFines] = useState<Fine[]>([]);

  // Mock data - Indian College Students
  const mockUsers: User[] = [
    {
      id: '1',
      name: 'Aman Kumar',
      rollNumber: 'CSE21001',
      email: 'aman.kumar@college.edu',
      department: 'CSE',
      semester: 6,
      role: 'user',
      status: 'active',
      booksCount: 3,
      fines: 0,
      joinDate: '2021-08-15',
      lastActive: '2024-01-20'
    },
    {
      id: '2',
      name: 'Priya Sharma',
      rollNumber: 'MECH21045',
      email: 'priya.sharma@college.edu',
      department: 'Mechanical',
      semester: 4,
      role: 'user',
      status: 'active',
      booksCount: 1,
      fines: 75,
      joinDate: '2021-08-15',
      lastActive: '2024-01-19'
    },
    {
      id: '3',
      name: 'Neha Yadav',
      rollNumber: 'CIVIL21023',
      email: 'neha.yadav@college.edu',
      department: 'Civil',
      semester: 6,
      role: 'user',
      status: 'active',
      booksCount: 2,
      fines: 15,
      joinDate: '2021-08-15',
      lastActive: '2024-01-18'
    },
    {
      id: '4',
      name: 'Rakesh Verma',
      rollNumber: 'BBA21067',
      email: 'rakesh.verma@college.edu',
      department: 'BBA',
      semester: 4,
      role: 'user',
      status: 'suspended',
      booksCount: 0,
      fines: 125,
      joinDate: '2021-08-15',
      lastActive: '2024-01-10'
    },
    {
      id: '5',
      name: 'Dr. Sunita Agarwal',
      rollNumber: 'LIB001',
      email: 'sunita.agarwal@college.edu',
      department: 'Library',
      semester: 0,
      role: 'librarian',
      status: 'active',
      booksCount: 0,
      fines: 0,
      joinDate: '2020-01-01',
      lastActive: '2024-01-20'
    }
  ];

  const mockFines: Fine[] = [
    {
      id: '1',
      userId: '2',
      userName: 'Priya Sharma',
      rollNumber: 'MECH21045',
      bookTitle: 'Thermodynamics for Engineers',
      amount: 75,
      dueDate: '2024-01-04',
      status: 'overdue',
      daysOverdue: 15,
      department: 'Mechanical'
    },
    {
      id: '2',
      userId: '3',
      userName: 'Neha Yadav',
      rollNumber: 'CIVIL21023',
      bookTitle: 'Structural Analysis and Design',
      amount: 15,
      dueDate: '2024-01-17',
      status: 'overdue',
      daysOverdue: 3,
      department: 'Civil'
    },
    {
      id: '3',
      userId: '4',
      userName: 'Rakesh Verma',
      rollNumber: 'BBA21067',
      bookTitle: 'Business Management Fundamentals',
      amount: 125,
      dueDate: '2023-12-20',
      status: 'overdue',
      daysOverdue: 25,
      department: 'BBA'
    }
  ];

  const recentActivities = [
    { id: '1', type: 'book_borrowed', user: 'Aman Kumar (CSE21001)', item: 'Data Structures and Algorithms in C++', time: '2 hours ago' },
    { id: '2', type: 'user_registered', user: 'Vikash Jha (DIP21156)', item: 'New student registration', time: '4 hours ago' },
    { id: '3', type: 'fine_paid', user: 'Bob Wilson', item: `${formatCurrency(262.50)} fine payment`, time: '6 hours ago' },
    { id: '4', type: 'book_returned', user: 'Sarah Davis', item: 'Science Fiction Book', time: '1 day ago' },
    { id: '5', type: 'book_overdue', user: 'Mark Brown', item: 'Mystery Novel', time: '2 days ago' }
  ];

  // Animate counters
  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        totalBooks: 2487,
        activeUsers: 1256,
        pendingFines: 8420,
        totalRevenue: 15640
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'book_borrowed': return <BookOpen className="h-4 w-4 text-blue-500" />;
      case 'user_registered': return <UserPlus className="h-4 w-4 text-green-500" />;
      case 'fine_paid': return <DollarSign className="h-4 w-4 text-emerald-500" />;
      case 'book_returned': return <CheckCircle className="h-4 w-4 text-primary" />;
      case 'book_overdue': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-700 dark:text-green-300">Active</Badge>;
      case 'inactive':
        return <Badge variant="outline">Inactive</Badge>;
      case 'suspended':
        return <Badge className="bg-red-500/20 text-red-700 dark:text-red-300">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

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
            Admin Dashboard 👨‍💼
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your library system with comprehensive admin tools
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              setSelectedFines(mockFines.filter(fine => fine.status === 'overdue'));
              setShowSendReminder(true);
            }}
            variant="outline"
            className="border-primary/20 hover:bg-primary/10"
          >
            <Bell className="h-4 w-4 mr-2" />
            Send Reminder
          </Button>
          <Button
            onClick={() => setShowAddUser(true)}
            variant="outline"
            className="border-primary/20 hover:bg-primary/10"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
          <Button
            onClick={() => setShowAddBook(true)}
            className="bg-gradient-to-r from-[#189ab4] to-[#75e6da] hover:opacity-90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Book
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Total Books',
            value: stats.totalBooks,
            icon: BookOpen,
            color: 'from-[#189ab4] to-[#75e6da]',
            change: '+12%',
            changeType: 'positive'
          },
          {
            title: 'Active Users',
            value: stats.activeUsers,
            icon: Users,
            color: 'from-[#75e6da] to-[#d4f1f4]',
            change: '+8%',
            changeType: 'positive'
          },
          {
            title: 'Pending Fines',
            value: formatCurrency(stats.pendingFines / 100),
            icon: DollarSign,
            color: 'from-red-400 to-red-600',
            change: '-5%',
            changeType: 'negative'
          },
          {
            title: 'Total Revenue',
            value: `$${(stats.totalRevenue / 100).toFixed(2)}`,
            icon: TrendingUp,
            color: 'from-emerald-400 to-emerald-600',
            change: '+15%',
            changeType: 'positive'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Card className="glass-card border-none">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <motion.p
                      className="text-2xl font-bold"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      {typeof stat.value === 'number' ? (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                        >
                          {stat.value.toLocaleString()}
                        </motion.span>
                      ) : (
                        stat.value
                      )}
                    </motion.p>
                    <div className={`flex items-center gap-1 text-xs mt-2 ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendingUp className="h-3 w-3" />
                      {stat.change} from last month
                    </div>
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

      {/* Main Content Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 glass-card">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="fines">Fines</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card className="glass-card border-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { icon: UserPlus, label: 'Add New User', action: () => setShowAddUser(true) },
                    { icon: Plus, label: 'Add New Book', action: () => setShowAddBook(true) },
                    { icon: Bell, label: 'Send Reminders', action: () => {
                      setSelectedFines(mockFines.filter(fine => fine.status === 'overdue'));
                      setShowSendReminder(true);
                    }},
                    { icon: BarChart3, label: 'Generate Report', action: () => console.log('Generate report') }
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <Button
                        variant="ghost"
                        onClick={item.action}
                        className="w-full justify-start gap-3 h-12 hover:bg-primary/10"
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </Button>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="glass-card border-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.slice(0, 5).map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        {getActivityIcon(activity.type)}
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.user}</p>
                          <p className="text-xs text-muted-foreground">{activity.item}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6 mt-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 glass-card border-border/50"
                />
              </div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-48 glass-card border-border/50">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Users Table */}
            <Card className="glass-card border-none">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Books</TableHead>
                      <TableHead>Fines</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="hover:bg-accent/50"
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell>{user.booksCount}</TableCell>
                        <TableCell>
                          {user.fines > 0 ? (
                            <span className="text-red-600">{formatCurrency(user.fines)}</span>
                          ) : (
                            <span className="text-green-600">{formatCurrency(0)}</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {user.lastActive}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <UserCheck className="h-4 w-4 mr-2" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fines Tab */}
          <TabsContent value="fines" className="space-y-6 mt-6">
            <Card className="glass-card border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Outstanding Fines
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Book</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Days Overdue</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockFines.map((fine, index) => (
                      <motion.tr
                        key={fine.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="hover:bg-accent/50"
                      >
                        <TableCell>{fine.userName}</TableCell>
                        <TableCell>{fine.bookTitle}</TableCell>
                        <TableCell className="text-red-600 font-medium">
                          ${fine.amount}
                        </TableCell>
                        <TableCell>{fine.dueDate}</TableCell>
                        <TableCell>
                          <Badge className="bg-red-500/20 text-red-700 dark:text-red-300">
                            {fine.daysOverdue} days
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-red-500/20 text-red-700 dark:text-red-300">
                            {fine.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Mail className="h-3 w-3 mr-1" />
                              Remind
                            </Button>
                            <Button size="sm" className="bg-green-500 hover:bg-green-600">
                              Mark Paid
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6 mt-6">
            <AdminAnalyticsCharts />
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6 mt-6">
            <Card className="glass-card border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  All Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-lg glass-card"
                    >
                      {getActivityIcon(activity.type)}
                      <div className="flex-1">
                        <p className="font-medium">{activity.user}</p>
                        <p className="text-sm text-muted-foreground">{activity.item}</p>
                      </div>
                      <span className="text-sm text-muted-foreground">{activity.time}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 200 }}
        >
          <Button
            onClick={() => {
              setSelectedFines(mockFines.filter(fine => fine.status === 'overdue'));
              setShowSendReminder(true);
            }}
            size="lg"
            className="rounded-full h-14 w-14 p-0 bg-gradient-to-r from-orange-400 to-orange-600 hover:opacity-90 shadow-2xl"
          >
            <Bell className="h-6 w-6" />
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1, type: "spring", stiffness: 200 }}
        >
          <Button
            onClick={() => setShowAddUser(true)}
            size="lg"
            className="rounded-full h-14 w-14 p-0 bg-gradient-to-r from-purple-400 to-purple-600 hover:opacity-90 shadow-2xl"
          >
            <UserPlus className="h-6 w-6" />
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
        >
          <Button
            onClick={() => setShowAddBook(true)}
            size="lg"
            className="rounded-full h-14 w-14 p-0 bg-gradient-to-r from-[#189ab4] to-[#75e6da] hover:opacity-90 shadow-2xl"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </motion.div>
      </div>

      {/* Modals */}
      <AddUserModal
        isOpen={showAddUser}
        onClose={() => setShowAddUser(false)}
        onAdd={(user) => {
          onUserAdd?.(user);
          setShowAddUser(false);
        }}
      />

      <AddBookModal
        isOpen={showAddBook}
        onClose={() => setShowAddBook(false)}
        onAdd={(book) => {
          onBookAdd?.(book);
          setShowAddBook(false);
        }}
      />

      <SendReminderModal
        isOpen={showSendReminder}
        onClose={() => setShowSendReminder(false)}
        selectedFines={selectedFines}
        onReminderSent={() => {
          setShowSendReminder(false);
          setSelectedFines([]);
        }}
      />
    </div>
  );
}