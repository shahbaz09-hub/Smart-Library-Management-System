import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star, Eye, Heart, BookOpen, Calendar } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface BookCardProps {
  book: {
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
    totalCopies?: number;
    availableCopies?: number;
    issuedCopies?: number;
    reservedCopies?: number;
  };
  onQuickView: (book: any) => void;
  onBorrow?: (bookId: string) => void;
  onReserve?: (bookId: string) => void;
  viewMode?: 'grid' | 'list';
  userRole?: 'admin' | 'librarian' | 'user';
}

export const BookCard: React.FC<BookCardProps> = ({ book, onQuickView, onBorrow, onReserve, viewMode = 'grid', userRole = 'user' }) => {
  const [isLiked, setIsLiked] = useState(false);

  // Department color mapping for visual distinction
  const departmentColors = {
    'CSE': 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300',
    'Mechanical': 'bg-orange-500/10 border-orange-500/20 text-orange-700 dark:text-orange-300',
    'Civil': 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-300',
    'Electrical': 'bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-300',
    'BCA': 'bg-purple-500/10 border-purple-500/20 text-purple-700 dark:text-purple-300',
    'MCA': 'bg-indigo-500/10 border-indigo-500/20 text-indigo-700 dark:text-indigo-300',
    'MBA': 'bg-pink-500/10 border-pink-500/20 text-pink-700 dark:text-pink-300',
    'BBA': 'bg-teal-500/10 border-teal-500/20 text-teal-700 dark:text-teal-300',
    'Diploma': 'bg-gray-500/10 border-gray-500/20 text-gray-700 dark:text-gray-300',
    'BHMCT': 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300',
  };

  const getDepartmentColor = (department: string) => {
    return departmentColors[department as keyof typeof departmentColors] || 'bg-primary/10 border-primary/20';
  };

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
      case 'available': return 'Available';
      case 'borrowed': return 'Borrowed';
      case 'reserved': return 'Reserved';
      default: return 'Unknown';
    }
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ 
          x: 4,
          transition: { duration: 0.2 }
        }}
        className="group cursor-pointer"
        onClick={() => onQuickView(book)}
      >
        <Card className="glass-card border-none overflow-hidden">
          <div className="flex gap-4 p-4">
            {/* Book Cover - Smaller for List View */}
            <div className="relative w-20 h-28 flex-shrink-0 overflow-hidden rounded-lg">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <ImageWithFallback
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              
              {/* Availability Badge */}
              <div className="absolute -top-1 -right-1">
                <Badge 
                  className={`${getAvailabilityColor(book.availability)} text-white border-none text-xs px-1 py-0.5`}
                >
                  {getAvailabilityText(book.availability).charAt(0)}
                </Badge>
              </div>
            </div>

            {/* Book Info - Expanded for List View */}
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`text-xs ${getDepartmentColor(book.department)}`}>
                      {book.department}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {book.publishYear}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                    {book.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground">
                    by {book.author}
                  </p>
                </div>

                {/* Like Button */}
                <motion.button
                  className="p-1 rounded-full hover:bg-accent/50"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLiked(!isLiked);
                  }}
                >
                  <Heart 
                    className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
                  />
                </motion.button>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">
                {book.description}
              </p>

              <div className="flex items-center justify-between">
                {/* Rating */}
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.floor(book.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {book.rating} ({book.reviewCount})
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickView(book);
                    }}
                    className="border-primary/20 text-primary hover:bg-primary/10"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>

                  {book.availability === 'available' && onBorrow && userRole === 'user' && (
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onBorrow(book.id);
                      }}
                      className="bg-gradient-to-r from-[#189ab4] to-[#75e6da] hover:opacity-90"
                    >
                      <BookOpen className="h-3 w-3 mr-1" />
                      Borrow
                    </Button>
                  )}
                  
                  {book.availability === 'borrowed' && onReserve && userRole === 'user' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onReserve(book.id);
                      }}
                    >
                      <Calendar className="h-3 w-3 mr-1" />
                      Reserve
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  // Grid View (original layout with enhancements)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -8,
        scale: 1.02,
        rotateY: 5,
        transition: { duration: 0.3, type: "spring", stiffness: 300 }
      }}
      style={{
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className="group cursor-pointer"
      onClick={() => onQuickView(book)}
    >
      <Card className="glass-card border-none overflow-hidden h-full group-hover:shadow-2xl transition-all duration-300">
        <div className="relative">
          {/* Book Cover */}
          <div className="relative aspect-[3/4] overflow-hidden">
            <motion.div
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <ImageWithFallback
                src={book.coverUrl}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Quick View Button - Enhanced */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileHover={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.2 }}
              >
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickView(book);
                  }}
                  className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 shadow-xl"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Quick View
                </Button>
              </motion.div>
            </motion.div>

            {/* Availability Badge */}
            <div className="absolute top-3 right-3">
              <motion.div
                initial={{ scale: 0.9, opacity: 0.8 }}
                whileHover={{ scale: 1, opacity: 1 }}
              >
                <Badge 
                  className={`${getAvailabilityColor(book.availability)} text-white border-none shadow-lg`}
                >
                  {getAvailabilityText(book.availability)}
                </Badge>
              </motion.div>
            </div>

            {/* Like Button */}
            <motion.button
              className="absolute top-3 left-3 p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg"
              whileHover={{ scale: 1.15, backgroundColor: "rgba(255,255,255,0.2)" }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                setIsLiked(!isLiked);
              }}
            >
              <Heart 
                className={`h-4 w-4 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`}
              />
            </motion.button>
          </div>

          {/* Book Info */}
          <CardContent className="p-4">
            <div className="space-y-3">
              {/* Department and Year */}
              <div className="flex items-center justify-between">
                <Badge variant="outline" className={`text-xs ${getDepartmentColor(book.department)}`}>
                  {book.department}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {book.publishYear}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors duration-200">
                {book.title}
              </h3>

              {/* Author */}
              <p className="text-sm text-muted-foreground">
                by {book.author}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Star
                        className={`h-3 w-3 ${
                          i < Math.floor(book.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </motion.div>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  {book.rating} ({book.reviewCount})
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                {book.availability === 'available' && onBorrow && userRole === 'user' && (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1"
                  >
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onBorrow(book.id);
                      }}
                      className="w-full bg-gradient-to-r from-[#189ab4] to-[#75e6da] hover:from-[#75e6da] hover:to-[#189ab4] shadow-lg"
                    >
                      <BookOpen className="h-3 w-3 mr-1" />
                      Borrow
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
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onReserve(book.id);
                      }}
                      className="w-full border-primary/20 hover:bg-primary/10"
                    >
                      <Calendar className="h-3 w-3 mr-1" />
                      Reserve
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
};