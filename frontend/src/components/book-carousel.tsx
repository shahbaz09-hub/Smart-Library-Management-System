import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  rating: number;
  genre: string;
}

interface BookCarouselProps {
  title: string;
  books: Book[];
  onBookClick: (book: Book) => void;
}

export const BookCarousel: React.FC<BookCarouselProps> = ({ title, books, onBookClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const booksPerView = 5;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + booksPerView >= books.length ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? Math.max(0, books.length - booksPerView) : prevIndex - 1
    );
  };

  const visibleBooks = books.slice(currentIndex, currentIndex + booksPerView);

  return (
    <Card className="glass-card border-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {title}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextSlide}
              disabled={currentIndex + booksPerView >= books.length}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-hidden">
          <motion.div 
            className="flex gap-4"
            animate={{ x: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <AnimatePresence mode="wait">
              {visibleBooks.map((book, index) => (
                <motion.div
                  key={`${book.id}-${currentIndex}`}
                  initial={{ opacity: 0, scale: 0.8, rotateY: 45 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotateY: -45 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: 10,
                    z: 50,
                    transition: { duration: 0.2 }
                  }}
                  className="flex-shrink-0 cursor-pointer perspective-1000"
                  style={{ 
                    width: `calc(${100 / booksPerView}% - 16px)`,
                    transformStyle: 'preserve-3d'
                  }}
                  onClick={() => onBookClick(book)}
                >
                  <div className="relative group">
                    {/* Book Cover */}
                    <div className="aspect-[3/4] relative overflow-hidden rounded-lg">
                      <ImageWithFallback
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Quick Info on Hover */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileHover={{ opacity: 1, y: 0 }}
                        className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                      >
                        <div className="flex items-center gap-1 mb-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < Math.floor(book.rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-400'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs">{book.rating}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {book.genre}
                        </Badge>
                      </motion.div>
                    </div>

                    {/* Book Info */}
                    <div className="mt-3 space-y-1">
                      <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                        {book.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {book.author}
                      </p>
                    </div>

                    {/* 3D Effect Shadow */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-[#189ab4] to-[#75e6da] rounded-lg -z-10"
                      style={{
                        transform: 'translateZ(-10px) scale(0.95)',
                        filter: 'blur(10px)',
                        opacity: 0
                      }}
                      whileHover={{
                        opacity: 0.3,
                        transform: 'translateZ(-10px) scale(1.02)'
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: Math.ceil(books.length / booksPerView) }).map((_, index) => (
            <motion.button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                Math.floor(currentIndex / booksPerView) === index
                  ? 'bg-primary'
                  : 'bg-muted-foreground/30'
              }`}
              onClick={() => setCurrentIndex(index * booksPerView)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};