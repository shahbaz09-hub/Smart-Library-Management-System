import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, BookOpen, Calendar, Clock, User, Award, Building, GraduationCap, Hash } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface BookModalProps {
  book: {
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
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onBorrow?: (bookId: string) => void;
  onReserve?: (bookId: string) => void;
  userRole?: 'admin' | 'librarian' | 'user';
}

export const BookModal: React.FC<BookModalProps> = ({ 
  book, 
  isOpen, 
  onClose, 
  onBorrow, 
  onReserve,
  userRole = 'user'
}) => {
  if (!book) return null;

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'borrowed': return 'bg-red-500';
      case 'reserved': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getAvailabilityText = (status: string) => {
    switch (status) {
      case 'available': return 'Available for Issue';
      case 'borrowed': return 'Currently Issued';
      case 'reserved': return 'Reserved';
      default: return 'Unknown Status';
    }
  };

  const getDepartmentIcon = (dept: string) => {
    switch (dept) {
      case 'CSE':
      case 'BCA':
      case 'MCA':
        return '💻';
      case 'Mechanical':
        return '⚙️';
      case 'Civil':
        return '🏗️';
      case 'BBA':
      case 'MBA':
        return '💼';
      case 'BHMCT':
        return '🏨';
      case 'Diploma':
        return '🎓';
      default:
        return '📚';
    }
  };

  // Mock issue history for demonstration
  const issueHistory = [
    { studentName: 'Aman Kumar', rollNumber: 'CSE21001', issueDate: '2024-01-15', returnDate: '2024-01-28' },
    { studentName: 'Priya Sharma', rollNumber: 'MECH21045', issueDate: '2024-01-20', returnDate: '2024-02-03' },
    { studentName: 'Neha Yadav', rollNumber: 'CIVIL21023', issueDate: '2024-02-05', returnDate: null }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden glass-card border-none p-0 w-[95vw]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col md:flex-row h-[90vh] md:h-auto"
        >
          {/* Left Side - Book Cover */}
          <div className="md:w-1/3 w-full h-64 md:h-auto relative flex-shrink-0">
            <div className="aspect-[3/4] md:h-full relative overflow-hidden">
              <ImageWithFallback
                src={book.coverUrl}
                alt={book.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              
              {/* Availability Badge */}
              <div className="absolute top-4 right-4">
                <Badge 
                  className={`${getAvailabilityColor(book.availability)} text-white border-none`}
                >
                  {getAvailabilityText(book.availability)}
                </Badge>
              </div>

              {/* Department Badge */}
              <div className="absolute top-4 left-4">
                <Badge variant="secondary" className="bg-white/90 text-gray-800">
                  {getDepartmentIcon(book.department)} {book.department}
                </Badge>
              </div>
            </div>
          </div>

          {/* Right Side - Book Details */}
          <div className="md:w-2/3 w-full p-4 md:p-6 overflow-y-auto flex-1">
            <DialogHeader>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <DialogTitle className="text-2xl mb-2 pr-8">
                    {book.title}
                  </DialogTitle>
                  <DialogDescription className="text-lg text-muted-foreground mb-2">
                    by {book.author} - {book.department} Department
                  </DialogDescription>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(book.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm">
                      {book.rating} ({book.reviewCount} student reviews)
                    </span>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>

            {/* Book Metadata */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="text-muted-foreground">Department:</span> {book.department}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="text-muted-foreground">Published:</span> {book.publishYear}
                  </span>
                </div>
                {book.pages && (
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="text-muted-foreground">Pages:</span> {book.pages}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="text-muted-foreground">ISBN:</span> {book.isbn}
                  </span>
                </div>
                {book.publisher && (
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="text-muted-foreground">Publisher:</span> {book.publisher}
                    </span>
                  </div>
                )}
                {book.language && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      <span className="text-muted-foreground">Language:</span> {book.language}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <Separator className="mb-6" />

            {/* Description */}
            <div className="mb-6">
              <h4 className="font-semibold mb-2">About This Book</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {book.description}
              </p>
            </div>

            {/* Issue Statistics for Admin/Librarian */}
            {(userRole === 'admin' || userRole === 'librarian') && (
              <>
                <Separator className="mb-6" />
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Issue History</h4>
                  <div className="space-y-2">
                    {issueHistory.map((record, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium">{record.studentName}</p>
                          <p className="text-xs text-muted-foreground">Roll: {record.rollNumber}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            Issued: {new Date(record.issueDate).toLocaleDateString()}
                          </p>
                          <p className="text-xs">
                            {record.returnDate ? (
                              <span className="text-green-600">
                                Returned: {new Date(record.returnDate).toLocaleDateString()}
                              </span>
                            ) : (
                              <span className="text-orange-600">Currently Issued</span>
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Department Statistics */}
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Department Statistics</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-lg font-semibold text-primary">24</p>
                  <p className="text-xs text-muted-foreground">Times Issued</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-lg font-semibold text-primary">18</p>
                  <p className="text-xs text-muted-foreground">Students Read</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-lg font-semibold text-primary">96%</p>
                  <p className="text-xs text-muted-foreground">On-time Returns</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {book.availability === 'available' && onBorrow && userRole === 'user' && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1"
                >
                  <Button
                    onClick={() => onBorrow(book.id)}
                    className="w-full bg-gradient-to-r from-[#189ab4] to-[#75e6da] hover:opacity-90"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Request Book
                  </Button>
                </motion.div>
              )}
              
              {book.availability === 'borrowed' && onReserve && userRole === 'user' && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1"
                >
                  <Button
                    variant="outline"
                    onClick={() => onReserve(book.id)}
                    className="w-full"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Reserve Book
                  </Button>
                </motion.div>
              )}

              {(userRole === 'admin' || userRole === 'librarian') && (
                <>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1"
                  >
                    <Button
                      className="w-full bg-gradient-to-r from-[#189ab4] to-[#75e6da] hover:opacity-90"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Issue to Student
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button variant="outline">
                      Edit Details
                    </Button>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};