import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { formatCurrency } from './ui/currency-utils';
import { toast } from "sonner@2.0.3";
import { 
  BookOpen, 
  Users, 
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  RefreshCw,
  UserCheck,
  Calendar,
  Download,
  Plus
} from 'lucide-react';

interface LibrarianDashboardProps {
  currentUser: { name: string; email: string } | null;
  userRole: 'librarian' | 'admin';
}

export function LibrarianDashboard({ currentUser, userRole }: LibrarianDashboardProps) {
  const [activeTab, setActiveTab] = useState('requests');
  const [searchQuery, setSearchQuery] = useState('');
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  // Mock data for librarian workflow
  const [bookRequests, setBookRequests] = useState([
    {
      id: '1',
      studentName: 'Aman Kumar',
      studentRollNumber: 'CSE21001',
      bookTitle: 'Database Management Systems',
      bookId: 'book_002',
      requestDate: '2024-01-20',
      status: 'pending',
      priority: 'high',
      department: 'CSE'
    },
    {
      id: '2',
      studentName: 'Priya Sharma',
      studentRollNumber: 'MECH21045',
      bookTitle: 'Fluid Mechanics and Hydraulics',
      bookId: 'book_011',
      requestDate: '2024-01-19',
      status: 'pending',
      priority: 'medium',
      department: 'Mechanical'
    },
    {
      id: '3',
      studentName: 'Neha Yadav',
      studentRollNumber: 'CIVIL21023',
      bookTitle: 'Reinforced Concrete Design',
      bookId: 'book_012',
      requestDate: '2024-01-18',
      status: 'approved',
      priority: 'low',
      department: 'Civil'
    }
  ]);

  const [activeIssues, setActiveIssues] = useState([
    {
      id: '1',
      studentName: 'Rohit Singh',
      studentRollNumber: 'BCA21089',
      bookTitle: 'Programming in Java',
      issueDate: '2024-01-10',
      dueDate: '2024-01-24',
      status: 'issued',
      fine: 0,
      renewCount: 0,
      maxRenewals: 2
    },
    {
      id: '2',
      studentName: 'Pooja Patel',
      studentRollNumber: 'MCA22034',
      bookTitle: 'Software Engineering Principles',
      issueDate: '2024-01-05',
      dueDate: '2024-01-19',
      status: 'overdue',
      fine: 25,
      renewCount: 1,
      maxRenewals: 2
    }
  ]);

  const [overdueBooks, setOverdueBooks] = useState([
    {
      id: '3',
      studentName: 'Vikash Jha',
      studentRollNumber: 'DIP21156',
      bookTitle: 'Diploma Engineering Mathematics',
      issueDate: '2023-12-20',
      dueDate: '2024-01-03',
      status: 'overdue',
      fine: 85,
      daysPastDue: 17
    }
  ]);

  // Statistics
  const stats = {
    pendingRequests: bookRequests.filter(r => r.status === 'pending').length,
    activeIssues: activeIssues.filter(i => i.status === 'issued').length,
    overdueBooks: overdueBooks.length,
    totalFines: overdueBooks.reduce((sum, book) => sum + book.fine, 0) + 
                activeIssues.reduce((sum, issue) => sum + issue.fine, 0)
  };

  // Handle request approval
  const handleApproveRequest = (requestId: string) => {
    setBookRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'approved', approvalDate: new Date().toISOString().split('T')[0] }
          : req
      )
    );
    
    // Create new issue record
    const request = bookRequests.find(r => r.id === requestId);
    if (request) {
      const issueDate = new Date();
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);

      const newIssue = {
        id: Date.now().toString(),
        studentName: request.studentName,
        studentRollNumber: request.studentRollNumber,
        bookTitle: request.bookTitle,
        issueDate: issueDate.toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        status: 'issued' as const,
        fine: 0,
        renewCount: 0,
        maxRenewals: 2
      };

      setActiveIssues(prev => [...prev, newIssue]);
      toast.success(`Book issued to ${request.studentName}`);
    }
  };

  // Handle request rejection
  const handleRejectRequest = (requestId: string) => {
    setBookRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'rejected', rejectionDate: new Date().toISOString().split('T')[0] }
          : req
      )
    );
    toast.success('Request rejected');
  };

  // Handle book return
  const handleBookReturn = (issueId: string) => {
    const issue = activeIssues.find(i => i.id === issueId);
    if (!issue) return;

    const returnDate = new Date();
    const dueDate = new Date(issue.dueDate);
    const fine = calculateFine(dueDate, returnDate);

    setActiveIssues(prev => prev.filter(i => i.id !== issueId));
    
    if (fine > 0) {
      toast.success(`Book returned with fine of ${formatCurrency(fine)}`);
    } else {
      toast.success('Book returned successfully');
    }
  };

  // Handle book renewal
  const handleRenewBook = (issueId: string) => {
    setActiveIssues(prev => 
      prev.map(issue => {
        if (issue.id === issueId && issue.renewCount < issue.maxRenewals) {
          const newDueDate = new Date(issue.dueDate);
          newDueDate.setDate(newDueDate.getDate() + 14);
          
          return {
            ...issue,
            dueDate: newDueDate.toISOString().split('T')[0],
            renewCount: issue.renewCount + 1
          };
        }
        return issue;
      })
    );
    toast.success('Book renewed successfully');
  };

  // Calculate fine
  const calculateFine = (dueDate: Date, returnDate: Date): number => {
    const diffTime = returnDate.getTime() - dueDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 1 ? (diffDays - 1) * 5 : 0; // ₹5 per day after 1-day grace period
  };

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
            Librarian Dashboard 📖
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome Librarian {currentUser?.name} - Manage book issues, returns, and student requests
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowIssueModal(true)}
            className="bg-gradient-to-r from-[#189ab4] to-[#75e6da] hover:opacity-90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Issue Book
          </Button>
          <Button variant="outline" className="border-primary/20 hover:bg-primary/10">
            <Download className="h-4 w-4 mr-2" />
            Daily Report
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Pending Requests',
            value: stats.pendingRequests,
            icon: Clock,
            color: 'from-yellow-400 to-orange-500',
            description: 'Awaiting approval'
          },
          {
            title: 'Active Issues',
            value: stats.activeIssues,
            icon: BookOpen,
            color: 'from-[#189ab4] to-[#75e6da]',
            description: 'Currently issued'
          },
          {
            title: 'Overdue Books',
            value: stats.overdueBooks,
            icon: AlertTriangle,
            color: 'from-red-400 to-red-600',
            description: 'Need attention'
          },
          {
            title: 'Total Fines',
            value: formatCurrency(stats.totalFines),
            icon: Users,
            color: 'from-purple-400 to-purple-600',
            description: 'Outstanding amount'
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
                    <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 glass-card">
          <TabsTrigger value="requests">Book Requests</TabsTrigger>
          <TabsTrigger value="issues">Active Issues</TabsTrigger>
          <TabsTrigger value="overdue">Overdue Books</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-6 mt-6">
          {/* Search Bar */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search requests by student name or book title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass-card border-border/50"
              />
            </div>
          </div>

          {/* Requests Table */}
          <Card className="glass-card border-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Pending Book Requests
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Book Title</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookRequests
                    .filter(request => 
                      request.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      request.bookTitle.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((request, index) => (
                      <motion.tr
                        key={request.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="hover:bg-accent/50"
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium">{request.studentName}</p>
                            <p className="text-sm text-muted-foreground">{request.studentRollNumber}</p>
                          </div>
                        </TableCell>
                        <TableCell>{request.bookTitle}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{request.department}</Badge>
                        </TableCell>
                        <TableCell>{request.requestDate}</TableCell>
                        <TableCell>
                          <Badge className={
                            request.priority === 'high' 
                              ? 'bg-red-500/20 text-red-700 dark:text-red-300'
                              : request.priority === 'medium'
                              ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300'
                              : 'bg-green-500/20 text-green-700 dark:text-green-300'
                          }>
                            {request.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            request.status === 'pending' 
                              ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300'
                              : request.status === 'approved'
                              ? 'bg-green-500/20 text-green-700 dark:text-green-300'
                              : 'bg-red-500/20 text-red-700 dark:text-red-300'
                          }>
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {request.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleApproveRequest(request.id)}
                                className="bg-green-500 hover:bg-green-600"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRejectRequest(request.id)}
                              >
                                <XCircle className="h-3 w-3 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </motion.tr>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="issues" className="space-y-6 mt-6">
          <Card className="glass-card border-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Active Book Issues
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Book Title</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Renewals</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeIssues.map((issue, index) => (
                    <motion.tr
                      key={issue.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-accent/50"
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium">{issue.studentName}</p>
                          <p className="text-sm text-muted-foreground">{issue.studentRollNumber}</p>
                        </div>
                      </TableCell>
                      <TableCell>{issue.bookTitle}</TableCell>
                      <TableCell>{issue.issueDate}</TableCell>
                      <TableCell>{issue.dueDate}</TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {issue.renewCount}/{issue.maxRenewals}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          issue.status === 'overdue' 
                            ? 'bg-red-500/20 text-red-700 dark:text-red-300'
                            : 'bg-green-500/20 text-green-700 dark:text-green-300'
                        }>
                          {issue.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleBookReturn(issue.id)}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            Return
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRenewBook(issue.id)}
                            disabled={issue.renewCount >= issue.maxRenewals}
                          >
                            <RefreshCw className="h-3 w-3" />
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

        <TabsContent value="overdue" className="space-y-6 mt-6">
          <Card className="glass-card border-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Overdue Books
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Book Title</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Days Overdue</TableHead>
                    <TableHead>Fine Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {overdueBooks.map((book, index) => (
                    <motion.tr
                      key={book.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-accent/50"
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium">{book.studentName}</p>
                          <p className="text-sm text-muted-foreground">{book.studentRollNumber}</p>
                        </div>
                      </TableCell>
                      <TableCell>{book.bookTitle}</TableCell>
                      <TableCell>{book.dueDate}</TableCell>
                      <TableCell>
                        <Badge className="bg-red-500/20 text-red-700 dark:text-red-300">
                          {book.daysPastDue} days
                        </Badge>
                      </TableCell>
                      <TableCell className="text-red-600 font-medium">
                        {formatCurrency(book.fine)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Send Reminder
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleBookReturn(book.id)}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            Force Return
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

        <TabsContent value="analytics" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card border-none">
              <CardHeader>
                <CardTitle>Today's Activity</CardTitle>
              </CardHeader>
              <CardContent className="text-center py-8">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Track daily book issues, returns, and student interactions
                </p>
                <Button className="bg-gradient-to-r from-[#189ab4] to-[#75e6da]">
                  View Report
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card border-none">
              <CardHeader>
                <CardTitle>Department Analytics</CardTitle>
              </CardHeader>
              <CardContent className="text-center py-8">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Analyze borrowing patterns by academic departments
                </p>
                <Button variant="outline" className="border-primary/20 hover:bg-primary/10">
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Issue Book Modal */}
      <Dialog open={showIssueModal} onOpenChange={setShowIssueModal}>
        <DialogContent className="max-w-md glass-card border-border/50">
          <DialogHeader>
            <DialogTitle>Issue Book</DialogTitle>
            <DialogDescription>
              Issue a book to a student by entering their roll number and book details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="student">Student Roll Number</Label>
              <Input
                id="student"
                placeholder="Enter roll number (e.g., CSE21001)"
                className="glass-card border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="book">Book ISBN or Title</Label>
              <Input
                id="book"
                placeholder="Enter ISBN or search by title"
                className="glass-card border-border/50"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowIssueModal(false)}
              >
                Cancel
              </Button>
              <Button className="bg-gradient-to-r from-[#189ab4] to-[#75e6da]">
                Issue Book
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}