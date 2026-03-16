import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Heart, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  TrendingUp,
  BookOpen,
  Eye,
  Plus
} from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  rating: number;
  reviewCount: number;
  genre: string;
  description: string;
  availability: 'available' | 'borrowed' | 'reserved';
}

interface UserRecommendationsProps {
  books: Book[];
  onBookSelect: (book: Book) => void;
  onBorrow: (bookId: string) => void;
  onReserve: (bookId: string) => void;
}

export function UserRecommendations({ books, onBookSelect, onBorrow, onReserve }: UserRecommendationsProps) {
  const [hoveredBook, setHoveredBook] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const recommendationSections = [
    {
      title: "✨ Recommended for You",
      subtitle: "Based on your reading history",
      books: books.slice(0, 6),
      icon: Sparkles,
      color: "from-[#189ab4] to-[#75e6da]"
    },
    {
      title: "🔥 Trending Now",
      subtitle: "Popular books this week",
      books: books.slice(1, 7),
      icon: TrendingUp,
      color: "from-orange-400 to-red-500"
    },
    {
      title: "❤️ Similar to Your Favorites",
      subtitle: "Because you loved Fiction",
      books: books.filter(book => book.genre === 'Fiction').slice(0, 6),
      icon: Heart,
      color: "from-pink-400 to-red-500"
    }
  ];

  const scroll = (direction: 'left' | 'right', sectionIndex: number) => {
    const container = document.getElementById(`scroll-container-${sectionIndex}`);
    if (container) {
      const scrollAmount = 320; // width of card + gap
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const RecommendationCard = ({ book, index }: { book: Book; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setHoveredBook(book.id)}
      onMouseLeave={() => setHoveredBook(null)}
      className="flex-shrink-0 w-64 group"
    >
      <Card className="glass-card border-border/50 hover:border-primary/50 transition-all duration-300 h-full overflow-hidden">
        <CardContent className="p-0">
          {/* Book Cover */}
          <div className="relative aspect-[3/4] overflow-hidden">
            <motion.img
              src={book.coverUrl}
              alt={book.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            
            {/* Hover Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: hoveredBook === book.id ? 1 : 0 }}
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center p-4"
            >
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => onBookSelect(book)}
                  className="bg-white/90 text-black hover:bg-white"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                {book.availability === 'available' ? (
                  <Button
                    size="sm"
                    onClick={() => onBorrow(book.id)}
                    className="bg-gradient-to-r from-[#189ab4] to-[#75e6da] hover:opacity-90"
                  >
                    <BookOpen className="h-3 w-3 mr-1" />
                    Borrow
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => onReserve(book.id)}
                    variant="outline"
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Reserve
                  </Button>
                )}
              </div>
            </motion.div>

            {/* Availability Badge */}
            <div className="absolute top-3 right-3">
              <Badge 
                className={
                  book.availability === 'available' 
                    ? 'bg-green-500/90 text-white' 
                    : book.availability === 'borrowed'
                    ? 'bg-red-500/90 text-white'
                    : 'bg-yellow-500/90 text-white'
                }
              >
                {book.availability}
              </Badge>
            </div>
          </div>

          {/* Book Info */}
          <div className="p-4">
            <h3 className="font-semibold text-sm mb-1 line-clamp-2 leading-tight">
              {book.title}
            </h3>
            <p className="text-xs text-muted-foreground mb-2">
              by {book.author}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium">{book.rating}</span>
                <span className="text-xs text-muted-foreground">
                  ({book.reviewCount})
                </span>
              </div>
              <Badge variant="outline" className="text-xs">
                {book.genre}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {recommendationSections.map((section, sectionIndex) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: sectionIndex * 0.2 }}
        >
          <Card className="glass-card border-none overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${section.color}`}>
                    <section.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{section.subtitle}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => scroll('left', sectionIndex)}
                    className="border-primary/20 hover:bg-primary/10"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => scroll('right', sectionIndex)}
                    className="border-primary/20 hover:bg-primary/10"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="px-6 pb-6">
              <div 
                id={`scroll-container-${sectionIndex}`}
                className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {section.books.map((book, index) => (
                  <RecommendationCard key={book.id} book={book} index={index} />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* View All Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center"
      >
        <Card className="glass-card border-none border-dashed border-primary/30 hover:border-primary/50 transition-colors">
          <CardContent className="p-8">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-gradient-to-r from-[#189ab4]/20 to-[#75e6da]/20">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Discover More Books</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Explore our complete catalog and find your next favorite read
                </p>
                <Button className="bg-gradient-to-r from-[#189ab4] to-[#75e6da] hover:opacity-90">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse All Books
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}