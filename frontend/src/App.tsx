import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeProvider } from './components/theme-provider';
import { NotificationProvider, useNotifications } from './components/notification-service';
import { AuthPage } from './components/auth-page';
import { BookBrowsePage } from './components/book-browse-page';
import { AdminDashboard } from './components/admin-dashboard';
import { UserDashboard } from './components/user-dashboard';
import { FineManagementPage } from './components/fine-management-page';
import { NotificationsPanel } from './components/notifications-panel';
import { AdminNotificationManager } from './components/admin-notification-manager';
import { AILibrarianChat } from './components/ai-librarian-chat';
import { DeveloperSignature } from './components/developer-signature';
import { CollegeLibraryManager } from './components/college-library-manager';
import { LibrarianDashboard } from './components/librarian-dashboard';
import { Navbar } from './components/navbar';
import { Sidebar } from './components/sidebar';
import { DashboardStats } from './components/dashboard-stats';
import { ActivityFeed } from './components/activity-feed';
import { AnalyticsCharts } from './components/analytics-charts';
import { BookCarousel } from './components/book-carousel';
import { BookCard } from './components/book-card';
import { BookModal } from './components/book-modal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Badge } from './components/ui/badge';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { Plus, Filter, Search } from 'lucide-react';
import { NotificationDemo } from './components/notification-demo';
import { login as apiLogin, browseBooks as apiBrowseBooks, registerStudent as apiRegisterStudent, registerAdmin as apiRegisterAdmin, createBookRequest as apiCreateBookRequest } from './lib/apiClient';

interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  rating: number;
  reviewCount: number;
  availability: 'available' | 'borrowed' | 'reserved';
  department: string; // Academic department
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
  rollNumber: string; // Primary key for college students
  email: string;
  department: string;
  semester: number;
  issuedBooks: BookIssue[]; // Active book issues
  fines: number; // Total outstanding fines in INR
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
  fine: number; // Calculated fine in INR
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
  amount: number; // Amount in INR
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

// Main App Content Component
function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id?: string; name: string; email: string; rollNumber?: string } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'librarian' | 'user'>('user');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'browse' | 'admin' | 'fines' | 'notifications'>('dashboard');
  const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] = useState(false);

  // Use the notification service
  const {
    getUnreadCount,
    hasUrgentNotifications,
    generateBookIssueNotification,
    generateBookReturnNotification,
    generateFineNotification,
    generateBookRequestNotification
  } = useNotifications();


  // Academic Books for College Library
  const mockBooks: Book[] = [
    // Computer Science Engineering (CSE) Books
    {
      id: '1',
      title: 'Data Structures and Algorithms in C++',
      author: 'Dr. Rajesh Kumar',
      coverUrl: 'https://images.unsplash.com/photo-1613253932202-686cbcd993b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHNjaWVuY2UlMjBwcm9ncmFtbWluZyUyMGJvb2t8ZW58MXx8fHwxNzU5MjEzMzc0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.7,
      reviewCount: 324,
      availability: 'available',
      department: 'CSE',
      publishYear: 2023,
      description: 'Comprehensive guide to data structures and algorithms with practical C++ implementations. Essential for computer science students.',
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
      coverUrl: 'https://images.unsplash.com/photo-1664854953181-b12e6dda8b7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhYmFzZSUyMG1hbmFnZW1lbnQlMjBzeXN0ZW1zfGVufDF8fHx8MTc1OTIxMzM5NHww&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.6,
      reviewCount: 289,
      availability: 'borrowed',
      department: 'CSE',
      publishYear: 2023,
      description: 'Complete coverage of database concepts, SQL, normalization, and modern database technologies for CSE students.',
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
      coverUrl: 'https://images.unsplash.com/photo-1732304720116-4195b021d8d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVybW9keW5hbWljcyUyMGVuZ2luZWVyaW5nJTIwYm9va3xlbnwxfHx8fDE3NTkyMTM0MDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.5,
      reviewCount: 412,
      availability: 'available',
      department: 'Mechanical',
      publishYear: 2022,
      description: 'Fundamental principles of thermodynamics with practical engineering applications and problem-solving techniques.',
      isbn: '978-81-203-6789-3',
      pages: 534,
      publisher: 'Engineering Books India',
      language: 'English',
      totalCopies: 6,
      availableCopies: 4,
      issuedCopies: 2,
      reservedCopies: 0
    },
    {
      id: '4',
      title: 'Structural Analysis and Design',
      author: 'Dr. Neha Yadav',
      coverUrl: 'https://images.unsplash.com/photo-1665069181618-5618c9b621ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXZpbCUyMGVuZ2luZWVyaW5nJTIwY29uc3RydWN0aW9uJTIwYm9va3xlbnwxfHx8fDE3NTkyMTMzODh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.8,
      reviewCount: 567,
      availability: 'reserved',
      department: 'Civil',
      publishYear: 2024,
      description: 'Advanced structural analysis methods and design principles for civil engineering students and professionals.',
      isbn: '978-81-203-7890-4',
      pages: 678,
      publisher: 'Civil Engineering Press',
      language: 'English',
      totalCopies: 3,
      availableCopies: 0,
      issuedCopies: 2,
      reservedCopies: 1
    },
    {
      id: '5',
      title: 'Business Management Fundamentals',
      author: 'Prof. Rakesh Gupta',
      coverUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1hbmFnZW1lbnQlMjBib29rfGVufDF8fHx8MTc1OTIxMzQxNXww&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.4,
      reviewCount: 298,
      availability: 'available',
      department: 'BBA',
      publishYear: 2023,
      description: 'Essential business management concepts, organizational behavior, and strategic planning for BBA students.',
      isbn: '978-81-203-8901-5',
      pages: 456,
      publisher: 'Business Education India',
      language: 'English',
      totalCopies: 5,
      availableCopies: 3,
      issuedCopies: 2,
      reservedCopies: 0
    },
    {
      id: '6',
      title: 'Marketing Strategy and Consumer Behavior',
      author: 'Dr. Sunita Agarwal',
      coverUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJrZXRpbmclMjBzdHJhdGVneSUyMGJvb2t8ZW58MXx8fHwxNzU5MjEzNDE4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.3,
      reviewCount: 234,
      availability: 'available',
      department: 'MBA',
      publishYear: 2023,
      description: 'Advanced marketing concepts, digital marketing strategies, and consumer psychology for MBA students.',
      isbn: '978-81-203-9012-6',
      pages: 542,
      publisher: 'MBA Studies Press',
      language: 'English',
      totalCopies: 4,
      availableCopies: 2,
      issuedCopies: 2,
      reservedCopies: 0
    },

    // More Academic Books
    {
      id: '7',
      title: 'Programming in Java',
      author: 'Dr. Aman Singh',
      coverUrl: 'https://images.unsplash.com/photo-1727522974621-c64b5ea90c0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXZhJTIwcHJvZ3JhbW1pbmclMjBib29rfGVufDF8fHx8MTc1OTIxMzM2NHww&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.6,
      reviewCount: 387,
      availability: 'available',
      department: 'BCA',
      publishYear: 2024,
      description: 'Object-oriented programming concepts in Java with practical examples and project-based learning for BCA students.',
      isbn: '978-81-203-0123-7',
      pages: 623,
      publisher: 'Computer Learning India',
      language: 'English',
      totalCopies: 4,
      availableCopies: 2,
      issuedCopies: 2,
      reservedCopies: 0
    },
    {
      id: '8',
      title: 'Software Engineering Principles',
      author: 'Prof. Vikram Patel',
      coverUrl: 'https://images.unsplash.com/photo-1758685733395-dba201403b4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0d2FyZSUyMGVuZ2luZWVyaW5nJTIwYm9va3xlbnwxfHx8fDE3NTkxNzM3ODh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.5,
      reviewCount: 456,
      availability: 'borrowed',
      department: 'MCA',
      publishYear: 2023,
      description: 'Advanced software engineering methodologies, project management, and system design for MCA students.',
      isbn: '978-81-203-1234-8',
      pages: 789,
      publisher: 'Software Tech Publications',
      language: 'English',
      totalCopies: 3,
      availableCopies: 0,
      issuedCopies: 3,
      reservedCopies: 0
    },
    {
      id: '9',
      title: 'Hotel Operations Management',
      author: 'Dr. Meera Joshi',
      coverUrl: 'https://images.unsplash.com/photo-1758876569703-ea9b21463691?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMG1hbmFnZW1lbnQlMjBib29rfGVufDF8fHx8MTc1OTIxMzM3Mnww&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.4,
      reviewCount: 278,
      availability: 'available',
      department: 'BHMCT',
      publishYear: 2023,
      description: 'Comprehensive guide to hotel and hospitality management covering operations, customer service, and industry practices.',
      isbn: '978-81-203-2345-9',
      pages: 487,
      publisher: 'Hospitality Education Press',
      language: 'English',
      totalCopies: 3,
      availableCopies: 2,
      issuedCopies: 1,
      reservedCopies: 0
    },
    {
      id: '10',
      title: 'Diploma Engineering Mathematics',
      author: 'Prof. Ravi Sharma',
      coverUrl: 'https://images.unsplash.com/photo-1613253932202-686cbcd993b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXRoZW1hdGljcyUyMGVuZ2luZWVyaW5nJTIwYm9va3xlbnwxfHx8fDE3NTkyMTMzNzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.2,
      reviewCount: 412,
      availability: 'available',
      department: 'Diploma',
      publishYear: 2022,
      description: 'Fundamental mathematics concepts for diploma engineering students including calculus, algebra, and applied mathematics.',
      isbn: '978-81-203-3456-0',
      pages: 456,
      publisher: 'Diploma Education Press',
      language: 'English',
      totalCopies: 5,
      availableCopies: 3,
      issuedCopies: 2,
      reservedCopies: 0
    },

    // Continue with remaining books for each department
    {
      id: '11',
      title: 'Fluid Mechanics and Hydraulics',
      author: 'Dr. Suresh Kumar',
      coverUrl: 'https://images.unsplash.com/photo-1727522974614-b592018e49e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWNoYW5pY2FsJTIwZW5naW5lZXJpbmclMjBib29rfGVufDF8fHx8MTc1OTIxMzM3OHww&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.6,
      reviewCount: 342,
      availability: 'available',
      department: 'Mechanical',
      publishYear: 2023,
      description: 'Principles of fluid mechanics, pump design, and hydraulic systems for mechanical engineering students.',
      isbn: '978-81-203-4567-1',
      pages: 598,
      publisher: 'Mechanical Engineering Press',
      language: 'English',
      totalCopies: 4,
      availableCopies: 2,
      issuedCopies: 2,
      reservedCopies: 0
    },
    {
      id: '12',
      title: 'Reinforced Concrete Design',
      author: 'Prof. Anjali Mehta',
      coverUrl: 'https://images.unsplash.com/photo-1665069181618-5618c9b621ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXZpbCUyMGVuZ2luZWVyaW5nJTIwY29uc3RydWN0aW9uJTIwYm9va3xlbnwxfHx8fDE3NTkyMTMzODh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.7,
      reviewCount: 289,
      availability: 'borrowed',
      department: 'Civil',
      publishYear: 2024,
      description: 'Advanced concrete design principles, structural analysis, and construction techniques for civil engineers.',
      isbn: '978-81-203-5678-2',
      pages: 723,
      publisher: 'Construction Tech India',
      language: 'English',
      totalCopies: 3,
      availableCopies: 0,
      issuedCopies: 3,
      reservedCopies: 0
    },
    {
      id: '13',
      title: 'Financial Management',
      author: 'Dr. Rajesh Agrawal',
      coverUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBtYW5hZ2VtZW50JTIwYm9va3xlbnwxfHx8fDE3NTkyMTM0MTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.5,
      reviewCount: 234,
      availability: 'available',
      department: 'BBA',
      publishYear: 2023,
      description: 'Corporate finance, investment analysis, and financial planning for business administration students.',
      isbn: '978-81-203-6789-3',
      pages: 512,
      publisher: 'Business Finance Press',
      language: 'English',
      totalCopies: 4,
      availableCopies: 3,
      issuedCopies: 1,
      reservedCopies: 0
    },
    {
      id: '14',
      title: 'Strategic Management',
      author: 'Prof. Kavita Singh',
      coverUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJhdGVnaWMlMjBtYW5hZ2VtZW50JTIwYm9va3xlbnwxfHx8fDE3NTkyMTM0MTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.8,
      reviewCount: 345,
      availability: 'reserved',
      department: 'MBA',
      publishYear: 2024,
      description: 'Advanced strategic planning, competitive analysis, and business transformation for MBA students.',
      isbn: '978-81-203-7890-4',
      pages: 634,
      publisher: 'Strategy Education India',
      language: 'English',
      totalCopies: 2,
      availableCopies: 0,
      issuedCopies: 1,
      reservedCopies: 1
    },
    {
      id: '15',
      title: 'Web Development with PHP',
      author: 'Dr. Ankit Sharma',
      coverUrl: 'https://images.unsplash.com/photo-1727522974621-c64b5ea90c0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXZlbG9wbWVudCUyMHBocCUyMGJvb2t8ZW58MXx8fHwxNzU5MjEzMzY0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.4,
      reviewCount: 198,
      availability: 'available',
      department: 'BCA',
      publishYear: 2023,
      description: 'Server-side programming with PHP, MySQL integration, and web application development for BCA students.',
      isbn: '978-81-203-8901-5',
      pages: 456,
      publisher: 'Web Tech Publications',
      language: 'English',
      totalCopies: 3,
      availableCopies: 2,
      issuedCopies: 1,
      reservedCopies: 0
    }
  ];

  // Mock student data with Indian names and roll numbers
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
    },
    {
      id: '3',
      name: 'Neha Yadav',
      rollNumber: 'CIVIL21023',
      email: 'neha.yadav@college.edu',
      department: 'Civil',
      semester: 6,
      issuedBooks: [],
      fines: 15,
      registrationDate: '2021-08-15',
      status: 'active'
    },
    {
      id: '4',
      name: 'Rakesh Verma',
      rollNumber: 'BBA21067',
      email: 'rakesh.verma@college.edu',
      department: 'BBA',
      semester: 4,
      issuedBooks: [],
      fines: 0,
      registrationDate: '2021-08-15',
      status: 'active'
    },
    {
      id: '5',
      name: 'Ananya Gupta',
      rollNumber: 'MBA22012',
      email: 'ananya.gupta@college.edu',
      department: 'MBA',
      semester: 2,
      issuedBooks: [],
      fines: 10,
      registrationDate: '2022-08-15',
      status: 'active'
    },
    {
      id: '6',
      name: 'Rohit Singh',
      rollNumber: 'BCA21089',
      email: 'rohit.singh@college.edu',
      department: 'BCA',
      semester: 6,
      issuedBooks: [],
      fines: 0,
      registrationDate: '2021-08-15',
      status: 'active'
    },
    {
      id: '7',
      name: 'Pooja Patel',
      rollNumber: 'MCA22034',
      email: 'pooja.patel@college.edu',
      department: 'MCA',
      semester: 2,
      issuedBooks: [],
      fines: 20,
      registrationDate: '2022-08-15',
      status: 'active'
    },
    {
      id: '8',
      name: 'Vikash Jha',
      rollNumber: 'DIP21156',
      email: 'vikash.jha@college.edu',
      department: 'Diploma',
      semester: 4,
      issuedBooks: [],
      fines: 5,
      registrationDate: '2021-08-15',
      status: 'active'
    },
    {
      id: '9',
      name: 'Sneha Agarwal',
      rollNumber: 'BHMCT21078',
      email: 'sneha.agarwal@college.edu',
      department: 'BHMCT',
      semester: 6,
      issuedBooks: [],
      fines: 0,
      registrationDate: '2021-08-15',
      status: 'active'
    }
  ];

  const departments = [
    'All Books',
    'CSE',
    'Mechanical',
    'Civil',
    'Electrical',
    'BCA',
    'MCA',
    'MBA',
    'BBA',
    'Diploma',
    'BHMCT'
  ];

  const sourceBooks = books.length > 0 ? books : mockBooks;
  const filteredBooks = sourceBooks.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedGenre === 'all' || book.department === selectedGenre;
    return matchesSearch && matchesDepartment;
  });

  const handleBorrow = async (bookId: string) => {
    console.log('Borrowing book:', bookId);

    // Find the book
    const book = books.find(b => b.id === bookId) || mockBooks.find(b => b.id === bookId);
    if (!book || !currentUser || !currentUser.id) return;

    try {
      // Create book request for admin approval
      await apiCreateBookRequest(
        currentUser.id,
        bookId,
        `Student ${currentUser.name} (${currentUser.rollNumber}) requested to borrow this book`
      );

      // Generate notification for admin
      const studentName = currentUser.name;
      const studentRollNumber = currentUser.rollNumber || 'USER001';
      generateBookRequestNotification(studentName, book.title, studentRollNumber, 'request');

      // Show success message to student
      toast.success('Book request sent to admin for approval!');
    } catch (error: any) {
      console.error('Failed to create book request:', error);
      toast.error(error.message || 'Failed to request book. Please try again.');
    }
  };

  const handleReserve = (bookId: string) => {
    console.log('Reserving book:', bookId);

    // Find the book
    const book = mockBooks.find(b => b.id === bookId);
    if (!book || !currentUser) return;

    // Generate notifications for book request
    const studentName = currentUser.name;
    const studentRollNumber = currentUser.rollNumber || 'USER001';

    generateBookRequestNotification(studentName, book.title, studentRollNumber, 'request');
  };

  const handleBookAdd = (book: any) => {
    console.log('Book added:', book);
    // Add book to collection logic here
  };

  const handleUserAdd = (user: any) => {
    console.log('User added:', user);
    // Add user to system logic here
  };

  const handleReminderSend = (reminder: any) => {
    console.log('Reminder sent:', reminder);
    // Send reminder logic here
  };

  const handleLogin = async (email: string, password: string) => {
    // Real backend authentication
    const resp = await apiLogin(email, password);
    const u = resp.user || {};
    const roleMap: any = { ADMIN: 'admin', LIBRARIAN: 'librarian', USER: 'user' };
    const role: 'admin' | 'librarian' | 'user' = roleMap[u.role] || 'user';
    const user = { id: String(u.id), name: u.name || email, email: u.email || email, rollNumber: u.rollNumber };
    setCurrentUser(user);
    setIsAuthenticated(true);
    setUserRole(role);

    // Fetch books from backend (first page)
    try {
      const page = await apiBrowseBooks({ page: 0, size: 24 });
      console.log('Books from backend:', page);
      const mapped: Book[] = (page.content || []).map((b: any, idx: number) => ({
        id: String(b.id ?? idx),
        title: b.title,
        author: b.author,
        coverUrl: b.coverUrl || b.bookCoverUrl || 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1080&q=80&auto=format&fit=crop',
        rating: b.rating ?? 4.5,
        reviewCount: b.reviewCount ?? 0,
        availability: (b.availableCopies ?? 0) > 0 ? 'available' : 'borrowed',
        department: b.department ?? 'All Books',
        publishYear: b.publishYear ?? 2023,
        description: b.description ?? '',
        isbn: b.isbn ?? '',
        pages: b.pages ?? undefined,
        publisher: b.publisher ?? undefined,
        language: b.language ?? 'English',
        totalCopies: b.totalCopies ?? 1,
        availableCopies: b.availableCopies ?? 0,
        issuedCopies: b.issuedCopies ?? 0,
        reservedCopies: 0,
      }));
      setBooks(mapped);
    } catch (e) {
      console.warn('Failed to fetch books from backend', e);
      // Fallback to mock books if backend fails
      setBooks(mockBooks);
    }
  };

  const handleRegister = async (name: string, email: string, password: string, confirmPassword?: string) => {
    try {
      await apiRegisterAdmin({ name, email, password, confirmPassword: confirmPassword || password });
      await handleLogin(email, password);
    } catch (error) {
      console.error('Failed to register account:', error);
      throw error;
    }
  };

  const handleStudentRegister = async (student: {
    name: string;
    rollNumber: string;
    email: string;
    department: string;
    semester: number;
    password: string;
    confirmPassword?: string;
  }) => {
    try {
      const payload = { ...student, confirmPassword: student.confirmPassword || student.password };
      await apiRegisterStudent(payload);
      await handleLogin(student.email, student.password);
    } catch (error: any) {
      console.error('Failed to register student:', error);
      throw error; // Let the modal handle the error
    }
  };

  const handleAdminRegister = async (admin: { name: string; email: string; password: string; confirmPassword?: string }) => {
    try {
      const payload = { ...admin, confirmPassword: admin.confirmPassword || admin.password };
      await apiRegisterAdmin(payload);
      await handleLogin(admin.email, admin.password);
    } catch (error) {
      console.error('Failed to register admin:', error);
      throw error;
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setUserRole('user');
  };

  // Notification handlers
  const handleNotificationAction = (notification: any) => {
    console.log('Notification action:', notification);
    // Handle specific notification actions (e.g., navigate to book, pay fine, etc.)
    if (notification.type === 'fine') {
      setCurrentPage('fines');
    } else if (notification.type === 'due_soon' || notification.type === 'overdue') {
      setCurrentPage('browse');
    } else if (notification.type === 'book_request') {
      setCurrentPage('admin');
    }
  };

  // Get current user's notification counts
  const unreadCount = getUnreadCount(userRole, currentUser?.rollNumber);
  const hasUrgent = hasUrgentNotifications(userRole, currentUser?.rollNumber);

  return (
    <>
      {!isAuthenticated ? (
        <AuthPage
          onLogin={handleLogin}
          onRegister={handleRegister}
          onStudentRegister={handleStudentRegister}
          onAdminRegister={handleAdminRegister}
        />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-50/20 dark:to-blue-950/20">
          {/* Animated Background Elements */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-[#189ab4]/10 to-[#75e6da]/10 rounded-full blur-3xl"
              animate={{
                x: [0, 100, 0],
                y: [0, -50, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-[#05445e]/10 to-[#189ab4]/10 rounded-full blur-3xl"
              animate={{
                x: [0, -80, 0],
                y: [0, 60, 0],
                scale: [1, 0.8, 1],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </div>

          <Navbar
            onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
            isMenuOpen={isSidebarOpen}
            currentUser={currentUser}
            onLogout={handleLogout}
            unreadNotifications={unreadCount}
            hasUrgentNotifications={hasUrgent}
            onNotificationClick={() => setIsNotificationsPanelOpen(true)}
          />

          <div className="flex">
            <Sidebar
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              userRole={userRole}
              currentPage={currentPage}
              onNavigate={setCurrentPage}
            />

            <main className="flex-1 pt-20 lg:pt-24 p-4 lg:p-6 lg:ml-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto space-y-8"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <motion.h1
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-3xl font-bold bg-gradient-to-r from-[#189ab4] to-[#75e6da] bg-clip-text text-transparent"
                    >
                      Welcome {userRole === 'admin' ? 'Admin' : userRole === 'librarian' ? 'Librarian' : ''} {currentUser?.name}! 📚
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-muted-foreground mt-1"
                    >
                      {userRole === 'admin' ? 'Manage your college library system' :
                        userRole === 'librarian' ? 'Efficiently manage book issues, returns, and student records' :
                          'Access academic resources for your studies'}
                    </motion.p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setUserRole(userRole === 'user' ? 'admin' : 'user')}
                    >
                      Switch to {userRole === 'user' ? 'Admin' : 'User'}
                    </Button>
                  </div>
                </div>

                {/* Dashboard Stats */}
                <DashboardStats userRole={userRole} />

                {/* Navigation Tabs */}
                <div className="flex gap-2 mb-6 flex-wrap">
                  <Button
                    variant={currentPage === 'dashboard' ? 'default' : 'outline'}
                    onClick={() => setCurrentPage('dashboard')}
                    className={currentPage === 'dashboard' ? 'bg-gradient-to-r from-[#189ab4] to-[#75e6da]' : ''}
                  >
                    Dashboard
                  </Button>
                  <Button
                    variant={currentPage === 'browse' ? 'default' : 'outline'}
                    onClick={() => setCurrentPage('browse')}
                    className={currentPage === 'browse' ? 'bg-gradient-to-r from-[#189ab4] to-[#75e6da]' : ''}
                  >
                    Browse Books
                  </Button>
                  {(userRole === 'admin' || userRole === 'librarian') && (
                    <>
                      <Button
                        variant={currentPage === 'admin' ? 'default' : 'outline'}
                        onClick={() => setCurrentPage('admin')}
                        className={currentPage === 'admin' ? 'bg-gradient-to-r from-[#189ab4] to-[#75e6da]' : ''}
                      >
                        {userRole === 'admin' ? 'Library Management' : 'Librarian Panel'}
                      </Button>
                      <Button
                        variant={currentPage === 'fines' ? 'default' : 'outline'}
                        onClick={() => setCurrentPage('fines')}
                        className={currentPage === 'fines' ? 'bg-gradient-to-r from-[#189ab4] to-[#75e6da]' : ''}
                      >
                        Fine Management
                      </Button>
                      <Button
                        variant={currentPage === 'notifications' ? 'default' : 'outline'}
                        onClick={() => setCurrentPage('notifications')}
                        className={currentPage === 'notifications' ? 'bg-gradient-to-r from-[#189ab4] to-[#75e6da]' : ''}
                      >
                        Notifications
                      </Button>
                    </>
                  )}
                </div>

                {/* Enhanced College Library Management System */}
                {currentPage === 'browse' ? (
                  <BookBrowsePage
                    books={filteredBooks}
                    userRole={userRole}
                    onBookSelect={setSelectedBook}
                    onBorrow={handleBorrow}
                    onReserve={handleReserve}
                  />
                ) : currentPage === 'admin' ? (
                  userRole === 'admin' ? (
                    <CollegeLibraryManager
                      userRole="admin"
                      currentUser={currentUser}
                    />
                  ) : (
                    <LibrarianDashboard
                      userRole="librarian"
                      currentUser={currentUser}
                    />
                  )
                ) : currentPage === 'fines' ? (
                  <FineManagementPage
                    userRole={userRole}
                  />
                ) : currentPage === 'notifications' ? (
                  <AdminNotificationManager
                    userRole={userRole}
                  />
                ) : userRole === 'user' ? (
                  <UserDashboard
                    currentUser={currentUser}
                    books={filteredBooks}
                    onBookSelect={setSelectedBook}
                    onBorrow={handleBorrow}
                    onReserve={handleReserve}
                  />
                ) : (
                  /* Dashboard Content */
                  <Tabs defaultValue="discover" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="discover">Discover</TabsTrigger>
                      <TabsTrigger value="catalog">Catalog</TabsTrigger>
                      <TabsTrigger value="analytics">Analytics</TabsTrigger>
                      <TabsTrigger value="activity">Activity</TabsTrigger>
                    </TabsList>

                    <TabsContent value="discover" className="space-y-6 mt-6">
                      {/* Department Recommendations */}
                      <BookCarousel
                        title="📖 CSE Department Books"
                        books={mockBooks.filter(book => book.department === 'CSE').map(book => ({
                          id: book.id,
                          title: book.title,
                          author: book.author,
                          coverUrl: book.coverUrl,
                          rating: book.rating,
                          genre: book.department
                        }))}
                        onBookClick={(book) => {
                          const fullBook = mockBooks.find(b => b.id === book.id);
                          if (fullBook) setSelectedBook(fullBook);
                        }}
                      />

                      {/* Popular Books Carousel */}
                      <BookCarousel
                        title="🔥 Most Issued Books"
                        books={mockBooks.slice().reverse().map(book => ({
                          id: book.id,
                          title: book.title,
                          author: book.author,
                          coverUrl: book.coverUrl,
                          rating: book.rating,
                          genre: book.department
                        }))}
                        onBookClick={(book) => {
                          const fullBook = mockBooks.find(b => b.id === book.id);
                          if (fullBook) setSelectedBook(fullBook);
                        }}
                      />

                      {/* New Arrivals Carousel */}
                      <BookCarousel
                        title="✨ Latest Editions"
                        books={mockBooks.filter(book => book.publishYear >= 2023).map(book => ({
                          id: book.id,
                          title: book.title,
                          author: book.author,
                          coverUrl: book.coverUrl,
                          rating: book.rating,
                          genre: book.department
                        }))}
                        onBookClick={(book) => {
                          const fullBook = mockBooks.find(b => b.id === book.id);
                          if (fullBook) setSelectedBook(fullBook);
                        }}
                      />
                    </TabsContent>

                    <TabsContent value="catalog" className="space-y-6 mt-6">
                      {/* Search and Filter */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search books..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Filter className="h-4 w-4 mr-2" />
                            Filters
                          </Button>
                        </div>
                      </div>

                      {/* Department Filter */}
                      <div className="flex gap-2 flex-wrap">
                        {departments.map((dept) => (
                          <Badge
                            key={dept}
                            variant={selectedGenre === dept ? "default" : "outline"}
                            className={`cursor-pointer ${selectedGenre === dept
                                ? 'bg-gradient-to-r from-[#189ab4] to-[#75e6da]'
                                : ''
                              }`}
                            onClick={() => setSelectedGenre(dept)}
                          >
                            {dept === 'all' ? 'All Departments' : dept.toUpperCase()}
                          </Badge>
                        ))}
                      </div>

                      {/* Books Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {filteredBooks.map((book, index) => (
                          <motion.div
                            key={book.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                          >
                            <BookCard
                              book={book}
                              onQuickView={setSelectedBook}
                              onBorrow={handleBorrow}
                              onReserve={handleReserve}
                            />
                          </motion.div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="analytics" className="space-y-6 mt-6">
                      <AnalyticsCharts userRole={userRole} />
                    </TabsContent>

                    <TabsContent value="activity" className="space-y-6 mt-6">
                      <ActivityFeed userRole={userRole} />
                    </TabsContent>
                  </Tabs>
                )}
              </motion.div>
            </main>
          </div>

          {/* Book Modal */}
          <BookModal
            book={selectedBook}
            isOpen={!!selectedBook}
            onClose={() => setSelectedBook(null)}
            onBorrow={handleBorrow}
            onReserve={handleReserve}
            userRole={userRole}
          />

          {/* Notifications Panel */}
          <NotificationsPanel
            isOpen={isNotificationsPanelOpen}
            onClose={() => setIsNotificationsPanelOpen(false)}
            userRole={userRole}
            userId={currentUser?.rollNumber}
            onNotificationAction={handleNotificationAction}
          />

          {/* AI Librarian Chat */}
          <AILibrarianChat
            currentUser={currentUser}
            onBookSearch={(query) => {
              setSearchQuery(query);
              setCurrentPage('browse');
            }}
            onNavigateToFines={() => setCurrentPage('fines')}
            onNavigateToRecommendations={() => setCurrentPage('browse')}
            onShowHelp={() => console.log('Show help')}
          />

          {/* Developer Signature */}
          <DeveloperSignature />
        </div>
      )}
    </>
  );
}

// Main App Component with Providers
export default function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <Toaster position="top-right" richColors />
        <AppContent />
      </NotificationProvider>
    </ThemeProvider>
  );
}