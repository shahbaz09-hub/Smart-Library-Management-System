import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { formatCurrency } from './ui/currency-utils';
import { 
  BookOpen, 
  Calendar, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  MoreVertical,
  Bookmark,
  Timer,
  IndianRupee,
  RotateCcw,
  Info
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

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

interface BorrowedBooksSectionProps {
  borrowedBooks: BorrowedBook[];
  onBookSelect: (book: any) => void;
}

export function BorrowedBooksSection({ borrowedBooks, onBookSelect }: BorrowedBooksSectionProps) {
  const [hoveredBook, setHoveredBook] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'issued': return 'bg-blue-500/20 text-blue-700 dark:text-blue-300';
      case 'due_soon': return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300';
      case 'overdue': return 'bg-red-500/20 text-red-700 dark:text-red-300';
      default: return 'bg-gray-500/20 text-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'issued': return <BookOpen className="h-4 w-4" />;
      case 'due_soon': return <Clock className="h-4 w-4" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDepartmentColor = (department: string) => {
    const colors = {
      'CSE': 'bg-blue-500/20 text-blue-700 dark:text-blue-300',
      'Mechanical': 'bg-orange-500/20 text-orange-700 dark:text-orange-300',
      'Civil': 'bg-green-500/20 text-green-700 dark:text-green-300',
      'BBA': 'bg-purple-500/20 text-purple-700 dark:text-purple-300',
      'MBA': 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300',
      'BCA': 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300',
      'MCA': 'bg-teal-500/20 text-teal-700 dark:text-teal-300',
      'BHMCT': 'bg-pink-500/20 text-pink-700 dark:text-pink-300',
      'Diploma': 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
    };
    return colors[department as keyof typeof colors] || 'bg-gray-500/20 text-gray-700 dark:text-gray-300';
  };

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="glass-card border-none">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Books Currently Issued
              </div>
              <Badge variant="outline" className="text-sm">
                {borrowedBooks.length} books
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {borrowedBooks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No books issued</h3>
                <p className="text-muted-foreground mb-4">
                  Start your academic journey by issuing some books!
                </p>
                <Button className="bg-gradient-to-r from-[#189ab4] to-[#75e6da]">
                  Browse Academic Books
                </Button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {borrowedBooks.map((book, index) => {
                  const daysUntilDue = getDaysUntilDue(book.dueDate);
                  
                  return (
                    <motion.div
                      key={book.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      onMouseEnter={() => setHoveredBook(book.id)}
                      onMouseLeave={() => setHoveredBook(null)}
                      className="relative"
                    >
                      <Card className="glass-card border-border/50 hover:border-primary/50 transition-all duration-300 overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            {/* Book Cover */}
                            <motion.div
                              className="relative flex-shrink-0"
                              whileHover={{ scale: 1.05 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <div className="w-20 h-28 rounded-lg overflow-hidden shadow-lg">
                                <img 
                                  src={book.coverUrl} 
                                  alt={book.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: hoveredBook === book.id ? 1 : 0 }}
                                className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-lg flex items-center justify-center"
                              >
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => onBookSelect(book)}
                                  className="bg-white/90 text-black hover:bg-white"
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                              </motion.div>
                            </motion.div>

                            {/* Book Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-lg truncate mb-1">{book.title}</h3>
                                  <p className="text-sm text-muted-foreground mb-2">by {book.author}</p>
                                  
                                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                                    <Badge className={getDepartmentColor(book.department)}>
                                      {book.department}
                                    </Badge>
                                    
                                    <Badge className={getStatusColor(book.status)}>
                                      {getStatusIcon(book.status)}
                                      <span className="ml-1 capitalize">{book.status.replace('_', ' ')}</span>
                                    </Badge>
                                    
                                    {book.status === 'due_soon' && (
                                      <Badge className="bg-orange-500/20 text-orange-700 dark:text-orange-300">
                                        <Timer className="h-3 w-3 mr-1" />
                                        {daysUntilDue} days left
                                      </Badge>
                                    )}
                                    
                                    {book.status === 'overdue' && (
                                      <Badge className="bg-red-500/20 text-red-700 dark:text-red-300">
                                        <AlertTriangle className="h-3 w-3 mr-1" />
                                        {Math.abs(daysUntilDue)} days overdue
                                      </Badge>
                                    )}

                                    {book.fine > 0 && (
                                      <Badge className="bg-red-500/20 text-red-700 dark:text-red-300">
                                        <IndianRupee className="h-3 w-3 mr-1" />
                                        Fine: {formatCurrency(book.fine)}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="glass-card border-border/50">
                                    <DropdownMenuItem onClick={() => onBookSelect(book)}>
                                      <Eye className="h-4 w-4 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <RotateCcw className="h-4 w-4 mr-2" />
                                      Renew Book
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Info className="h-4 w-4 mr-2" />
                                      Issue History
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>

                              {/* Issue Details */}
                              <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">Issue Date:</span>
                                    <p className="font-medium">{formatDate(book.borrowDate)}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Due Date:</span>
                                    <p className={`font-medium ${book.status === 'overdue' ? 'text-red-600 dark:text-red-400' : 
                                      book.status === 'due_soon' ? 'text-yellow-600 dark:text-yellow-400' : ''}`}>
                                      {formatDate(book.dueDate)}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">ISBN:</span>
                                    <p className="font-medium text-xs">{book.isbn}</p>
                                  </div>
                                  {book.fine > 0 && (
                                    <div>
                                      <span className="text-muted-foreground">Fine:</span>
                                      <p className="font-medium text-red-600 dark:text-red-400">
                                        {formatCurrency(book.fine)}
                                      </p>
                                    </div>
                                  )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2 mt-4">
                                  <Button
                                    size="sm"
                                    onClick={() => onBookSelect(book)}
                                    className="bg-gradient-to-r from-[#189ab4] to-[#75e6da] hover:opacity-90"
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    View Details
                                  </Button>
                                  
                                  {book.status === 'due_soon' || book.status === 'overdue' ? (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="border-yellow-500/50 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-500/10"
                                        >
                                          <RotateCcw className="h-3 w-3 mr-1" />
                                          Renew
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Extend due date (subject to availability)</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-primary/20 hover:bg-primary/10"
                                    >
                                      <Bookmark className="h-3 w-3 mr-1" />
                                      Mark Important
                                    </Button>
                                  )}

                                  {book.fine > 0 && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-red-500/50 text-red-700 dark:text-red-300 hover:bg-red-500/10"
                                    >
                                      <IndianRupee className="h-3 w-3 mr-1" />
                                      Pay Fine
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </TooltipProvider>
  );
}