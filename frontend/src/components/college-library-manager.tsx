import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { formatCurrency } from './ui/currency-utils';
import { toast } from 'sonner';
import { AddBookModal } from './add-book-modal';
import { StudentRegistrationModal } from './student-registration-modal';
import { issueBook as apiIssueBook, returnBook as apiReturnBook, renewBook as apiRenewBook, getBooks as apiGetBooks, getUsers as apiGetUsers } from '../lib/apiClient';
import { 
  BookOpen, 
  Users, 
  DollarSign, 
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Calendar,
  UserCheck,
  Mail,
  Phone,
  MapPin,
  BookMarked,
  FileText,
  Download,
  TrendingUp,
  Award,
  Target,
  RefreshCw,
  Eye
} from 'lucide-react';

// Enhanced interfaces for college library management
interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  rating: number;
  reviewCount: number;
  availability: 'available' | 'borrowed' | 'reserved';
  department: string;
  publishYear: number;
  description: string;
  isbn: string;
  pages?: number;
  publisher?: string;
  language?: string;
  totalCopies: number;
  availableCopies: number;
  issuedCopies: number;
  reservedCopies: number;
}

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  department: string;
  semester: number;
  issuedBooks: BookIssue[];
  fines: number;
  registrationDate: string;
  status: 'active' | 'suspended' | 'graduated';
}

interface BookIssue {
  id: string;
  bookId: string;
  studentRollNumber: string;
  studentName: string;
  bookTitle: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  fine: number;
  status: 'issued' | 'returned' | 'overdue';
  isRenewed: boolean;
  renewCount: number;
  maxRenewals: number;
}

interface BookRequest {
  id: string;
  bookId: string;
  studentRollNumber: string;
  studentName: string;
  bookTitle: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled';
  priority: number;
  librarianId?: string;
  approvalDate?: string;
  rejectionReason?: string;
}

interface Fine {
  id: string;
  studentRollNumber: string;
  studentName: string;
  bookIssueId: string;
  bookTitle: string;
  amount: number;
  daysPastDue: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'waived' | 'overdue';
  createdDate: string;
  paidDate?: string;
  waivedDate?: string;
  waivedBy?: string;
  discountApplied?: number;
  paymentMethod?: string;
}

interface CollegeLibraryManagerProps {
  userRole: 'admin' | 'librarian' | 'user';
  currentUser: { name: string; email: string } | null;
}

export function CollegeLibraryManager({ userRole, currentUser }: CollegeLibraryManagerProps) {
  // State management
  const [books, setBooks] = useState<Book[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [bookIssues, setBookIssues] = useState<BookIssue[]>([]);
  const [bookRequests, setBookRequests] = useState<BookRequest[]>([]);
  const [fines, setFines] = useState<Fine[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showStudentRegisterModal, setShowStudentRegisterModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [issueBookId, setIssueBookId] = useState('');
  const [issueStudentId, setIssueStudentId] = useState('');
  const [isIssuingBook, setIsIssuingBook] = useState(false);
  const [returnIssueId, setReturnIssueId] = useState('');
  const [isReturningBook, setIsReturningBook] = useState(false);

  // Initialize mock data
  useEffect(() => {
    initializeMockData();
  }, []);

  const initializeMockData = () => {
    // Mock books data
    const mockBooks: Book[] = [
      {
        id: '1',
        title: 'Data Structures and Algorithms in C++',
        author: 'Dr. Rajesh Kumar',
        coverUrl: 'https://images.unsplash.com/photo-1613253932202-686cbcd993b0?w=400',
        rating: 4.7,
        reviewCount: 324,
        availability: 'available',
        department: 'CSE',
        publishYear: 2023,
        description: 'Comprehensive guide to data structures and algorithms with practical C++ implementations.',
        isbn: '978-81-203-5467-2',
        pages: 652,
        publisher: 'Tech Publications India',
        language: 'English',
        totalCopies: 5,
        availableCopies: 3,
        issuedCopies: 2,
        reservedCopies: 0
      },
      {
        id: '2',
        title: 'Database Management Systems',
        author: 'Dr. Priya Sharma',
        coverUrl: 'https://images.unsplash.com/photo-1664854953181-b12e6dda8b7c?w=400',
        rating: 4.6,
        reviewCount: 289,
        availability: 'borrowed',
        department: 'CSE',
        publishYear: 2023,
        description: 'Complete coverage of database concepts, SQL, normalization, and modern database technologies.',
        isbn: '978-81-203-4521-7',
        pages: 587,
        publisher: 'Academic Press India',
        language: 'English',
        totalCopies: 4,
        availableCopies: 0,
        issuedCopies: 4,
        reservedCopies: 0
      },
      {
        id: '3',
        title: 'Thermodynamics for Engineers',
        author: 'Prof. Amit Verma',
        coverUrl: 'https://images.unsplash.com/photo-1732304720116-4195b021d8d0?w=400',
        rating: 4.5,
        reviewCount: 412,
        availability: 'available',
        department: 'Mechanical',
        publishYear: 2022,
        description: 'Fundamental principles of thermodynamics with practical engineering applications.',
        isbn: '978-81-203-6789-3',
        pages: 534,
        publisher: 'Engineering Books India',
        language: 'English',
        totalCopies: 6,
        availableCopies: 4,
        issuedCopies: 2,
        reservedCopies: 0
      }
    ];

    // Mock students data
    const mockStudents: Student[] = [
      {
        id: '1',
        name: 'Aman Kumar',
        rollNumber: 'CSE21001',
        email: 'aman.kumar@college.edu',
        department: 'CSE',
        semester: 6,
        issuedBooks: [],
        fines: 25,
        registrationDate: '2021-08-15',
        status: 'active'
      },
      {
        id: '2',
        name: 'Priya Sharma',
        rollNumber: 'MECH21045',
        email: 'priya.sharma@college.edu',
        department: 'Mechanical',
        semester: 4,
        issuedBooks: [],
        fines: 0,
        registrationDate: '2021-08-15',
        status: 'active'
      }
    ];

    // Mock book issues
    const mockBookIssues: BookIssue[] = [
      {
        id: '1',
        bookId: '1',
        studentRollNumber: 'CSE21001',
        studentName: 'Aman Kumar',
        bookTitle: 'Data Structures and Algorithms in C++',
        issueDate: '2024-01-10',
        dueDate: '2024-01-24',
        status: 'issued',
        fine: 0,
        isRenewed: false,
        renewCount: 0,
        maxRenewals: 2
      },
      {
        id: '2',
        bookId: '2',
        studentRollNumber: 'MECH21045',
        studentName: 'Priya Sharma',
        bookTitle: 'Thermodynamics for Engineers',
        issueDate: '2024-01-05',
        dueDate: '2024-01-19',
        status: 'overdue',
        fine: 25,
        isRenewed: false,
        renewCount: 0,
        maxRenewals: 2
      }
    ];

    // Mock book requests
    const mockBookRequests: BookRequest[] = [
      {
        id: '1',
        bookId: '2',
        studentRollNumber: 'CSE21001',
        studentName: 'Aman Kumar',
        bookTitle: 'Database Management Systems',
        requestDate: '2024-01-20',
        status: 'pending',
        priority: 1
      }
    ];

    setBooks(mockBooks);
    setStudents(mockStudents);
    setBookIssues(mockBookIssues);
    setBookRequests(mockBookRequests);
  };

  // Fine calculation logic
  const calculateFine = (dueDate: string, returnDate?: string): number => {
    const due = new Date(dueDate);
    const returned = returnDate ? new Date(returnDate) : new Date();
    const diffTime = returned.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Grace period of 1 day, then ₹5 per day
    if (diffDays <= 1) return 0;
    return (diffDays - 1) * 5;
  };

  // Book issue handlers
  const handleBookIssue = async (bookId: string, studentRollNumber: string) => {
    const book = books.find(b => b.id === bookId);
    const student = students.find(s => s.rollNumber === studentRollNumber);
    
    if (!book || !student) {
      toast.error('Book or student not found');
      return;
    }

    if (book.availableCopies <= 0) {
      toast.error('No copies available for issue');
      return;
    }

    // Check if student has outstanding fines
    if (student.fines > 0) {
      toast.error('Student has outstanding fines. Clear fines before issuing new books.');
      return;
    }

    try {
      // Call backend API to issue book
      await apiIssueBook(student.id, bookId, currentUser?.name || 'Admin');

      const issueDate = new Date();
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14); // 14-day loan period

      const newIssue: BookIssue = {
        id: Date.now().toString(),
        bookId,
        studentRollNumber,
        studentName: student.name,
        bookTitle: book.title,
        issueDate: issueDate.toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        status: 'issued',
        fine: 0,
        isRenewed: false,
        renewCount: 0,
        maxRenewals: 2
      };

      // Update book copies
      setBooks(prev => prev.map(b => 
        b.id === bookId 
          ? { 
              ...b, 
              availableCopies: b.availableCopies - 1,
              issuedCopies: b.issuedCopies + 1,
              availability: b.availableCopies - 1 === 0 ? 'borrowed' : 'available'
            }
          : b
      ));

      // Add issue record
      setBookIssues(prev => [...prev, newIssue]);

      // Update student record
      setStudents(prev => prev.map(s => 
        s.rollNumber === studentRollNumber 
          ? { ...s, issuedBooks: [...s.issuedBooks, newIssue] }
          : s
      ));

      toast.success(`Book issued successfully to ${student.name}. Student will be notified.`);
      setShowIssueModal(false);
    } catch (error: any) {
      console.error('Failed to issue book:', error);
      toast.error(error.message || 'Failed to issue book. Please try again.');
    }
  };

  const handleBookReturn = async (issueId: string) => {
    const issue = bookIssues.find(i => i.id === issueId);
    if (!issue) return;

    try {
      // Call backend API to return book
      await apiReturnBook(issueId, currentUser?.email || 'admin');
      
      const returnDate = new Date();
      const fine = calculateFine(issue.dueDate, returnDate.toISOString().split('T')[0]);

      // Update issue record
      setBookIssues(prev => prev.map(i => 
        i.id === issueId 
          ? { 
              ...i, 
              status: 'returned' as const,
              returnDate: returnDate.toISOString().split('T')[0],
              fine
            }
          : i
      ));

      // Update book copies
      setBooks(prev => prev.map(b => 
        b.id === issue.bookId 
          ? { 
              ...b, 
              availableCopies: b.availableCopies + 1,
              issuedCopies: b.issuedCopies - 1,
              availability: 'available'
            }
          : b
      ));

      // Update student fines if any
      if (fine > 0) {
        setStudents(prev => prev.map(s => 
          s.rollNumber === issue.studentRollNumber 
            ? { ...s, fines: s.fines + fine }
            : s
        ));

        // Create fine record
        const newFine: Fine = {
          id: Date.now().toString(),
          studentRollNumber: issue.studentRollNumber,
          studentName: issue.studentName,
          bookIssueId: issueId,
          bookTitle: issue.bookTitle,
          amount: fine,
          daysPastDue: Math.ceil((returnDate.getTime() - new Date(issue.dueDate).getTime()) / (1000 * 60 * 60 * 24)) - 1,
          dueDate: issue.dueDate,
          status: 'pending',
          createdDate: returnDate.toISOString().split('T')[0]
        };

        setFines(prev => [...prev, newFine]);
      }

      toast.success(`Book returned successfully${fine > 0 ? ` with fine of ${formatCurrency(fine)}` : ''}! Saved to database.`);
    } catch (error: any) {
      console.error('Failed to return book:', error);
      toast.error(error.message || 'Failed to return book. Please try again.');
    }
  };

  const handleRenewBook = async (issueId: string) => {
    const issue = bookIssues.find(i => i.id === issueId);
    if (!issue) return;

    if (issue.renewCount >= issue.maxRenewals) {
      toast.error('Maximum renewals reached');
      return;
    }

    try {
      // Call backend API to renew book
      await apiRenewBook(issueId);
      
      const newDueDate = new Date(issue.dueDate);
      newDueDate.setDate(newDueDate.getDate() + 14);

      setBookIssues(prev => prev.map(i => 
        i.id === issueId 
          ? { 
              ...i, 
              dueDate: newDueDate.toISOString().split('T')[0],
              isRenewed: true,
              renewCount: i.renewCount + 1
            }
          : i
      ));

      toast.success('Book renewed successfully! Saved to database.');
    } catch (error: any) {
      console.error('Failed to renew book:', error);
      toast.error(error.message || 'Failed to renew book. Please try again.');
    }
  };

  // Request approval handlers
  const handleApproveRequest = (requestId: string) => {
    const request = bookRequests.find(r => r.id === requestId);
    if (!request) return;

    setBookRequests(prev => prev.map(r => 
      r.id === requestId 
        ? { 
            ...r, 
            status: 'approved' as const,
            approvalDate: new Date().toISOString().split('T')[0],
            librarianId: currentUser?.email || 'unknown'
          }
        : r
    ));

    // Auto-issue the book
    handleBookIssue(request.bookId, request.studentRollNumber);
    
    toast.success(`Request approved and book issued to ${request.studentName}`);
  };

  const handleRejectRequest = (requestId: string, reason: string) => {
    setBookRequests(prev => prev.map(r => 
      r.id === requestId 
        ? { 
            ...r, 
            status: 'rejected' as const,
            rejectionReason: reason,
            librarianId: currentUser?.email || 'unknown'
          }
        : r
    ));

    toast.success('Request rejected');
  };

  // Statistics
  const stats = {
    totalBooks: books.length,
    availableBooks: books.filter(b => b.availableCopies > 0).length,
    issuedBooks: bookIssues.filter(i => i.status === 'issued').length,
    overdueBooks: bookIssues.filter(i => i.status === 'overdue').length,
    totalStudents: students.length,
    activeStudents: students.filter(s => s.status === 'active').length,
    pendingRequests: bookRequests.filter(r => r.status === 'pending').length,
    totalFines: fines.reduce((sum, f) => f.status === 'pending' ? sum + f.amount : sum, 0)
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
            College Library Management 📚
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome {userRole === 'admin' ? 'Admin' : userRole === 'librarian' ? 'Librarian' : ''} {currentUser?.name}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowAddBookModal(true)}
            className="bg-gradient-to-r from-[#189ab4] to-[#75e6da] hover:opacity-90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Book
          </Button>
          <Button
            onClick={() => setShowStudentRegisterModal(true)}
            variant="outline"
            className="border-primary/20 hover:bg-primary/10"
          >
            <Users className="h-4 w-4 mr-2" />
            Register Student
          </Button>
          {(userRole === 'admin' || userRole === 'librarian') && (
            <>
              <Button
                onClick={() => setShowIssueModal(true)}
                variant="outline"
                className="border-primary/20 hover:bg-primary/10"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Issue Book
              </Button>
              <Button
                onClick={() => setShowReturnModal(true)}
                variant="outline"
                className="border-green-500/20 hover:bg-green-500/10 text-green-600"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Return Book
              </Button>
            </>
          )}
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Total Books',
            value: stats.totalBooks,
            subtitle: `${stats.availableBooks} available`,
            icon: BookOpen,
            color: 'from-[#189ab4] to-[#75e6da]'
          },
          {
            title: 'Active Issues',
            value: stats.issuedBooks,
            subtitle: `${stats.overdueBooks} overdue`,
            icon: Clock,
            color: 'from-yellow-400 to-orange-500'
          },
          {
            title: 'Students',
            value: stats.totalStudents,
            subtitle: `${stats.activeStudents} active`,
            icon: Users,
            color: 'from-green-400 to-emerald-600'
          },
          {
            title: 'Pending Fines',
            value: formatCurrency(stats.totalFines),
            subtitle: `${stats.pendingRequests} requests`,
            icon: DollarSign,
            color: 'from-red-400 to-red-600'
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
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 glass-card">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="books">Books</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="fines">Fines</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Issues */}
            <Card className="glass-card border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Recent Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bookIssues.slice(-5).map((issue, index) => (
                    <motion.div
                      key={issue.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50"
                    >
                      <div>
                        <p className="font-medium">{issue.bookTitle}</p>
                        <p className="text-sm text-muted-foreground">{issue.studentName}</p>
                      </div>
                      <Badge className={
                        issue.status === 'overdue' 
                          ? 'bg-red-500/20 text-red-700 dark:text-red-300'
                          : 'bg-green-500/20 text-green-700 dark:text-green-300'
                      }>
                        {issue.status}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pending Requests */}
            <Card className="glass-card border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                  Pending Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bookRequests.filter(r => r.status === 'pending').map((request, index) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50"
                    >
                      <div>
                        <p className="font-medium">{request.bookTitle}</p>
                        <p className="text-sm text-muted-foreground">{request.studentName}</p>
                      </div>
                      {(userRole === 'admin' || userRole === 'librarian') && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApproveRequest(request.id)}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectRequest(request.id, 'Not available')}
                          >
                            <XCircle className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="books" className="space-y-6 mt-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass-card border-border/50"
              />
            </div>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-48 glass-card border-border/50">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="CSE">CSE</SelectItem>
                <SelectItem value="Mechanical">Mechanical</SelectItem>
                <SelectItem value="Civil">Civil</SelectItem>
                <SelectItem value="BBA">BBA</SelectItem>
                <SelectItem value="MBA">MBA</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Books Table */}
          <Card className="glass-card border-none">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Book Details</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Copies</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {books
                    .filter(book => 
                      (selectedDepartment === 'all' || book.department === selectedDepartment) &&
                      (book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       book.author.toLowerCase().includes(searchQuery.toLowerCase()))
                    )
                    .map((book) => (
                      <TableRow key={book.id} className="hover:bg-accent/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img 
                              src={book.coverUrl} 
                              alt={book.title}
                              className="w-12 h-16 object-cover rounded"
                            />
                            <div>
                              <p className="font-medium">{book.title}</p>
                              <p className="text-sm text-muted-foreground">{book.author}</p>
                              <p className="text-xs text-muted-foreground">ISBN: {book.isbn}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{book.department}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>Total: {book.totalCopies}</p>
                            <p className="text-green-600">Available: {book.availableCopies}</p>
                            <p className="text-orange-600">Issued: {book.issuedCopies}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            book.availability === 'available' 
                              ? 'bg-green-500/20 text-green-700 dark:text-green-300'
                              : book.availability === 'borrowed'
                              ? 'bg-red-500/20 text-red-700 dark:text-red-300'
                              : 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300'
                          }>
                            {book.availability}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="issues" className="space-y-6 mt-6">
          <Card className="glass-card border-none">
            <CardHeader>
              <CardTitle>Book Issues</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Book</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Fine</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookIssues.map((issue) => (
                    <TableRow key={issue.id} className="hover:bg-accent/50">
                      <TableCell>{issue.bookTitle}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{issue.studentName}</p>
                          <p className="text-sm text-muted-foreground">{issue.studentRollNumber}</p>
                        </div>
                      </TableCell>
                      <TableCell>{issue.issueDate}</TableCell>
                      <TableCell>{issue.dueDate}</TableCell>
                      <TableCell>
                        <Badge className={
                          issue.status === 'overdue' 
                            ? 'bg-red-500/20 text-red-700 dark:text-red-300'
                            : issue.status === 'returned'
                            ? 'bg-green-500/20 text-green-700 dark:text-green-300'
                            : 'bg-blue-500/20 text-blue-700 dark:text-blue-300'
                        }>
                          {issue.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {issue.fine > 0 ? formatCurrency(issue.fine) : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {(issue.status === 'issued' || issue.status === 'overdue') && (
                            <>
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
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-6 mt-6">
          <Card className="glass-card border-none">
            <CardHeader>
              <CardTitle>Book Requests</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Book</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookRequests.map((request) => (
                    <TableRow key={request.id} className="hover:bg-accent/50">
                      <TableCell>{request.bookTitle}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{request.studentName}</p>
                          <p className="text-sm text-muted-foreground">{request.studentRollNumber}</p>
                        </div>
                      </TableCell>
                      <TableCell>{request.requestDate}</TableCell>
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
                        {request.status === 'pending' && (userRole === 'admin' || userRole === 'librarian') && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApproveRequest(request.id)}
                              className="bg-green-500 hover:bg-green-600"
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectRequest(request.id, 'Book not available')}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fines" className="space-y-6 mt-6">
          <Card className="glass-card border-none">
            <CardHeader>
              <CardTitle>Fine Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                College fine system: ₹5 per day after 1-day grace period. 
                Students must clear all fines before issuing new books.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Book Modal */}
      <AddBookModal
        isOpen={showAddBookModal}
        onClose={() => setShowAddBookModal(false)}
        onAdd={(book) => {
          // Add book to local state (it's already saved to database via API)
          setBooks(prev => [...prev, {
            ...book,
            id: book.id?.toString() || Date.now().toString(),
            totalCopies: book.totalCopies || 1,
            availableCopies: book.availableCopies || book.totalCopies || 1,
            issuedCopies: book.issuedCopies || 0,
            reservedCopies: book.reservedCopies || 0
          }]);
          setShowAddBookModal(false);
        }}
      />

      {/* Student Registration Modal */}
      <StudentRegistrationModal
        isOpen={showStudentRegisterModal}
        onClose={() => setShowStudentRegisterModal(false)}
        onRegister={(student) => {
          // Student is already saved to database via API
          setStudents(prev => [...prev, {
            id: Date.now().toString(),
            name: student.name,
            rollNumber: student.rollNumber,
            email: student.email,
            department: student.department,
            semester: student.semester,
            status: 'active',
            issuedBooks: [],
            fines: 0,
            registrationDate: new Date().toISOString().split('T')[0]
          }]);
          setShowStudentRegisterModal(false);
          toast.success('Student registered successfully!');
        }}
      />

      {/* Issue Book Modal */}
      <Dialog open={showIssueModal} onOpenChange={setShowIssueModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-[#189ab4] to-[#75e6da] bg-clip-text text-transparent">
              Issue Book to Student
            </DialogTitle>
            <DialogDescription>
              Select a book and student to issue
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Book Selection */}
            <div className="space-y-2">
              <Label htmlFor="book">Select Book *</Label>
              <Select value={issueBookId} onValueChange={setIssueBookId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a book..." />
                </SelectTrigger>
                <SelectContent>
                  {books.filter(b => b.availableCopies > 0).map(book => (
                    <SelectItem key={book.id} value={book.id}>
                      {book.title} ({book.availableCopies} available)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Student Selection */}
            <div className="space-y-2">
              <Label htmlFor="student">Select Student *</Label>
              <Select value={issueStudentId} onValueChange={setIssueStudentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a student..." />
                </SelectTrigger>
                <SelectContent>
                  {students.filter(s => s.status === 'active').map(student => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} ({student.rollNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selected Info */}
            {issueBookId && issueStudentId && (
              <Card className="bg-muted/50">
                <CardContent className="p-3 text-sm">
                  <p><strong>Book:</strong> {books.find(b => b.id === issueBookId)?.title}</p>
                  <p><strong>Student:</strong> {students.find(s => s.id === issueStudentId)?.name}</p>
                  <p><strong>Due Date:</strong> {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => {
              setShowIssueModal(false);
              setIssueBookId('');
              setIssueStudentId('');
            }}>
              Cancel
            </Button>
            <Button 
              disabled={!issueBookId || !issueStudentId || isIssuingBook}
              onClick={async () => {
                if (!issueBookId || !issueStudentId) {
                  toast.error('Please select both book and student');
                  return;
                }
                
                setIsIssuingBook(true);
                try {
                  // Call backend API
                  await apiIssueBook(issueStudentId, issueBookId, currentUser?.email || 'admin');
                  
                  // Update local state
                  const book = books.find(b => b.id === issueBookId);
                  const student = students.find(s => s.id === issueStudentId);
                  
                  if (book) {
                    setBooks(prev => prev.map(b => 
                      b.id === issueBookId 
                        ? { ...b, availableCopies: b.availableCopies - 1, issuedCopies: b.issuedCopies + 1 }
                        : b
                    ));
                  }
                  
                  toast.success(`Book "${book?.title}" issued to ${student?.name} successfully! Saved to database.`);
                  setShowIssueModal(false);
                  setIssueBookId('');
                  setIssueStudentId('');
                } catch (error: any) {
                  console.error('Failed to issue book:', error);
                  toast.error(error.message || 'Failed to issue book. Please try again.');
                } finally {
                  setIsIssuingBook(false);
                }
              }}
              className="bg-gradient-to-r from-[#189ab4] to-[#75e6da] hover:opacity-90"
            >
              {isIssuingBook ? 'Issuing...' : 'Issue Book'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Return Book Modal */}
      <Dialog open={showReturnModal} onOpenChange={setShowReturnModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-green-600">
              Return Book
            </DialogTitle>
            <DialogDescription>
              Select an issued book to return. Fine will be calculated automatically if late.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Issue Selection */}
            <div className="space-y-2">
              <Label htmlFor="issue">Select Issued Book *</Label>
              <Select value={returnIssueId} onValueChange={setReturnIssueId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an issued book..." />
                </SelectTrigger>
                <SelectContent>
                  {bookIssues.filter(i => i.status === 'issued' || i.status === 'overdue').map(issue => (
                    <SelectItem key={issue.id} value={issue.id}>
                      {issue.bookTitle} - {issue.studentName} ({issue.status === 'overdue' ? '⚠️ Overdue' : 'On Time'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selected Issue Info */}
            {returnIssueId && (() => {
              const selectedIssue = bookIssues.find(i => i.id === returnIssueId);
              if (!selectedIssue) return null;
              const fine = calculateFine(selectedIssue.dueDate);
              return (
                <Card className={fine > 0 ? "bg-red-50 dark:bg-red-900/20 border-red-200" : "bg-green-50 dark:bg-green-900/20 border-green-200"}>
                  <CardContent className="p-3 text-sm space-y-1">
                    <p><strong>Book:</strong> {selectedIssue.bookTitle}</p>
                    <p><strong>Student:</strong> {selectedIssue.studentName} ({selectedIssue.studentRollNumber})</p>
                    <p><strong>Issue Date:</strong> {selectedIssue.issueDate}</p>
                    <p><strong>Due Date:</strong> {selectedIssue.dueDate}</p>
                    <p><strong>Status:</strong> <Badge className={selectedIssue.status === 'overdue' ? 'bg-red-500' : 'bg-blue-500'}>{selectedIssue.status}</Badge></p>
                    {fine > 0 && (
                      <p className="text-red-600 font-bold mt-2">⚠️ Late Fine: {formatCurrency(fine)}</p>
                    )}
                  </CardContent>
                </Card>
              );
            })()}
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => {
              setShowReturnModal(false);
              setReturnIssueId('');
            }}>
              Cancel
            </Button>
            <Button 
              disabled={!returnIssueId || isReturningBook}
              onClick={async () => {
                if (!returnIssueId) {
                  toast.error('Please select a book to return');
                  return;
                }
                
                setIsReturningBook(true);
                try {
                  const issue = bookIssues.find(i => i.id === returnIssueId);
                  if (!issue) throw new Error('Issue not found');
                  
                  // Call backend API
                  await apiReturnBook(returnIssueId, currentUser?.email || 'admin');
                  
                  const returnDate = new Date();
                  const fine = calculateFine(issue.dueDate, returnDate.toISOString().split('T')[0]);

                  // Update local state
                  setBookIssues(prev => prev.map(i => 
                    i.id === returnIssueId 
                      ? { ...i, status: 'returned' as const, returnDate: returnDate.toISOString().split('T')[0], fine }
                      : i
                  ));

                  setBooks(prev => prev.map(b => 
                    b.id === issue.bookId 
                      ? { ...b, availableCopies: b.availableCopies + 1, issuedCopies: b.issuedCopies - 1, availability: 'available' }
                      : b
                  ));

                  if (fine > 0) {
                    setStudents(prev => prev.map(s => 
                      s.rollNumber === issue.studentRollNumber ? { ...s, fines: s.fines + fine } : s
                    ));
                    setFines(prev => [...prev, {
                      id: Date.now().toString(),
                      studentRollNumber: issue.studentRollNumber,
                      studentName: issue.studentName,
                      bookIssueId: returnIssueId,
                      bookTitle: issue.bookTitle,
                      amount: fine,
                      daysPastDue: Math.ceil((returnDate.getTime() - new Date(issue.dueDate).getTime()) / (1000 * 60 * 60 * 24)) - 1,
                      dueDate: issue.dueDate,
                      status: 'pending',
                      createdDate: returnDate.toISOString().split('T')[0]
                    }]);
                  }
                  
                  toast.success(`Book returned successfully${fine > 0 ? ` with fine of ${formatCurrency(fine)}` : ''}! Saved to database.`);
                  setShowReturnModal(false);
                  setReturnIssueId('');
                } catch (error: any) {
                  console.error('Failed to return book:', error);
                  toast.error(error.message || 'Failed to return book. Please try again.');
                } finally {
                  setIsReturningBook(false);
                }
              }}
              className="bg-green-500 hover:bg-green-600"
            >
              {isReturningBook ? 'Returning...' : 'Return Book'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}