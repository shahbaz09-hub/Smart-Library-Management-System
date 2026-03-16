import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookCard } from './book-card';
import { BookModal } from './book-modal';
import { BookCarousel } from './book-carousel';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Skeleton } from './ui/skeleton';
import { 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  Grid3X3, 
  List,
  Plus,
  Star,
  Calendar,
  TrendingUp,
  Users,
  BookOpen
} from 'lucide-react';

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

interface BookBrowsePageProps {
  books: Book[];
  userRole: 'admin' | 'librarian' | 'user';
  onBookSelect: (book: Book) => void;
  onBorrow: (bookId: string) => void;
  onReserve: (bookId: string) => void;
}

type SortOption = 'latest' | 'popular' | 'rating' | 'title' | 'availability';
type ViewMode = 'grid' | 'list';

export function BookBrowsePage({ 
  books, 
  userRole, 
  onBookSelect, 
  onBorrow, 
  onReserve 
}: BookBrowsePageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All Books');
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Generate search suggestions
  useEffect(() => {
    if (searchQuery.length > 1) {
      const suggestions = books
        .filter(book => 
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
        .map(book => book.title);
      setSearchSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery, books]);

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

  const departmentStats = {
    'All Books': books.length,
    'CSE': books.filter(b => b.department === 'CSE').length,
    'Mechanical': books.filter(b => b.department === 'Mechanical').length,
    'Civil': books.filter(b => b.department === 'Civil').length,
    'Electrical': books.filter(b => b.department === 'Electrical').length,
    'BCA': books.filter(b => b.department === 'BCA').length,
    'MCA': books.filter(b => b.department === 'MCA').length,
    'MBA': books.filter(b => b.department === 'MBA').length,
    'BBA': books.filter(b => b.department === 'BBA').length,
    'Diploma': books.filter(b => b.department === 'Diploma').length,
    'BHMCT': books.filter(b => b.department === 'BHMCT').length,
  };

  // Department color mapping for visual distinction
  const departmentColors = {
    'All Books': 'from-[#189ab4] to-[#75e6da]',
    'CSE': 'from-blue-500 to-blue-600',
    'Mechanical': 'from-orange-500 to-red-500',
    'Civil': 'from-green-500 to-green-600',
    'Electrical': 'from-yellow-500 to-orange-500',
    'BCA': 'from-purple-500 to-purple-600',
    'MCA': 'from-indigo-500 to-indigo-600',
    'MBA': 'from-pink-500 to-rose-500',
    'BBA': 'from-teal-500 to-cyan-500',
    'Diploma': 'from-gray-500 to-gray-600',
    'BHMCT': 'from-emerald-500 to-teal-500',
  };

  // Filter and sort books
  const filteredAndSortedBooks = React.useMemo(() => {
    let filtered = books.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           book.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDepartment = selectedDepartment === 'All Books' || book.department === selectedDepartment;
      return matchesSearch && matchesDepartment;
    });

    // Sort books
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return b.publishYear - a.publishYear;
        case 'popular':
          return b.reviewCount - a.reviewCount;
        case 'rating':
          return b.rating - a.rating;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'availability':
          const availabilityOrder = { 'available': 0, 'reserved': 1, 'borrowed': 2 };
          return availabilityOrder[a.availability] - availabilityOrder[b.availability];
        default:
          return 0;
      }
    });

    return filtered;
  }, [books, searchQuery, selectedDepartment, sortBy]);

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    onBookSelect(book);
  };

  // Skeleton loader component
  const BookCardSkeleton = () => (
    <div className="glass-card rounded-xl p-6 space-y-4">
      <Skeleton className="h-48 w-full rounded-lg bg-muted/50" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4 bg-muted/50" />
        <Skeleton className="h-3 w-1/2 bg-muted/50" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-16 bg-muted/50" />
          <Skeleton className="h-6 w-20 bg-muted/50" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <div className="flex">
        {/* Left Sidebar - Categories */}
        <motion.aside 
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:block w-80 min-h-screen bg-background/50 backdrop-blur-sm border-r border-border/50 p-6"
        >
          <div className="sticky top-24 space-y-6">
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Browse by Department
              </h3>
              <div className="space-y-2">
                {departments.map((department, index) => (
                  <motion.button
                    key={department}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedDepartment(department)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                      selectedDepartment === department
                        ? `bg-gradient-to-r ${departmentColors[department as keyof typeof departmentColors]} text-white shadow-lg`
                        : 'hover:bg-accent/50 text-foreground'
                    }`}
                  >
                    <span className="group-hover:translate-x-1 transition-transform">
                      {department === 'All Books' 
                        ? '📚 All Books' 
                        : department === 'CSE' 
                        ? '💻 Computer Science' 
                        : department === 'Mechanical' 
                        ? '⚙️ Mechanical Engineering'
                        : department === 'Civil'
                        ? '🏗️ Civil Engineering'
                        : department === 'Electrical'
                        ? '⚡ Electrical Engineering'
                        : department === 'BCA'
                        ? '🖥️ BCA'
                        : department === 'MCA'
                        ? '💾 MCA'
                        : department === 'MBA'
                        ? '💼 MBA'
                        : department === 'BBA'
                        ? '📊 BBA'
                        : department === 'Diploma'
                        ? '🎓 Diploma'
                        : department === 'BHMCT'
                        ? '🏨 BHMCT'
                        : department
                      }
                    </span>
                    <Badge 
                      variant="secondary" 
                      className={`${
                        selectedDepartment === department 
                          ? 'bg-white/20 text-white' 
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {departmentStats[department as keyof typeof departmentStats]}
                    </Badge>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-4 space-y-3"
            >
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Library Stats
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-[#189ab4]" />
                    <span className="text-sm">Total Books</span>
                  </div>
                  <Badge variant="outline">{books.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#75e6da]" />
                    <span className="text-sm">Available</span>
                  </div>
                  <Badge className="bg-green-500/20 text-green-700 dark:text-green-300">
                    {books.filter(b => b.availability === 'available').length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-[#05445e]" />
                    <span className="text-sm">Popular</span>
                  </div>
                  <Badge variant="outline">
                    {books.filter(b => b.rating >= 4.5).length}
                  </Badge>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
            >
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#189ab4] to-[#75e6da] bg-clip-text text-transparent">
                  College Library Collection 📚
                </h1>
                <p className="text-muted-foreground mt-1">
                  Browse academic books by department and find resources for your studies
                </p>
              </div>
              
              {(userRole === 'admin' || userRole === 'librarian') && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button className="bg-gradient-to-r from-[#189ab4] to-[#75e6da] hover:opacity-90 shadow-lg">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Book
                  </Button>
                </motion.div>
              )}
            </motion.div>

            {/* Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="glass-card p-6 space-y-4"
            >
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                  <Input
                    placeholder="Search books, authors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50"
                    onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  />
                  
                  {/* Search Suggestions */}
                  <AnimatePresence>
                    {showSuggestions && searchSuggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 z-50 mt-2 glass-card border border-border/50 rounded-lg overflow-hidden"
                      >
                        {searchSuggestions.map((suggestion, index) => (
                          <motion.button
                            key={suggestion}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => {
                              setSearchQuery(suggestion);
                              setShowSuggestions(false);
                            }}
                            className="w-full text-left p-3 hover:bg-accent/50 transition-colors flex items-center gap-2"
                          >
                            <Search className="h-3 w-3 text-muted-foreground" />
                            {suggestion}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Sort and View Controls */}
                <div className="flex gap-2">
                  <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                    <SelectTrigger className="w-40 h-12 bg-background/50 backdrop-blur-sm border-border/50">
                      <div className="flex items-center gap-2">
                        <SortAsc className="h-4 w-4" />
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="glass-card border-border/50">
                      <SelectItem value="latest">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Latest
                        </div>
                      </SelectItem>
                      <SelectItem value="popular">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Popular
                        </div>
                      </SelectItem>
                      <SelectItem value="rating">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4" />
                          Rating
                        </div>
                      </SelectItem>
                      <SelectItem value="title">
                        <div className="flex items-center gap-2">
                          <SortAsc className="h-4 w-4" />
                          Title A-Z
                        </div>
                      </SelectItem>
                      <SelectItem value="availability">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          Availability
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex border border-border/50 rounded-lg overflow-hidden bg-background/50 backdrop-blur-sm">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="rounded-none h-12 px-3"
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="rounded-none h-12 px-3"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Department Filter Pills - Mobile Only */}
              <div className="lg:hidden flex gap-2 flex-wrap">
                {departments.slice(0, 6).map((department) => (
                  <Badge
                    key={department}
                    variant={selectedDepartment === department ? "default" : "outline"}
                    className={`cursor-pointer transition-all hover:scale-105 ${
                      selectedDepartment === department 
                        ? `bg-gradient-to-r ${departmentColors[department as keyof typeof departmentColors]} shadow-lg` 
                        : 'hover:bg-accent/50'
                    }`}
                    onClick={() => setSelectedDepartment(department)}
                  >
                    {department === 'All Books' ? 'All' : department}
                  </Badge>
                ))}
              </div>
            </motion.div>

            {/* Results Summary */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center justify-between text-sm text-muted-foreground"
            >
              <div>
                Showing {filteredAndSortedBooks.length} of {books.length} books
                {selectedDepartment !== 'All Books' && ` in ${selectedDepartment} Department`}
                {searchQuery && ` matching "${searchQuery}"`}
              </div>
              <div className="hidden sm:block">
                Sort by: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
              </div>
            </motion.div>

            {/* Books Grid/List */}
            <div className={`${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6' 
                : 'space-y-4'
            }`}>
              {isLoading ? (
                // Skeleton loaders with staggered animation
                Array.from({ length: 12 }).map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <BookCardSkeleton />
                  </motion.div>
                ))
              ) : filteredAndSortedBooks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="col-span-full flex flex-col items-center justify-center py-16 text-center"
                >
                  <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                    <BookOpen className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No books found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search criteria or browse different categories
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedDepartment('All Books');
                    }}
                  >
                    Clear Filters
                  </Button>
                </motion.div>
              ) : (
                // Books with staggered animation
                filteredAndSortedBooks.map((book, index) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      delay: index * 0.05, 
                      duration: 0.4,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ y: -5 }}
                  >
                    <BookCard
                      book={book}
                      onQuickView={handleBookClick}
                      onBorrow={onBorrow}
                      onReserve={onReserve}
                      viewMode={viewMode}
                      userRole={userRole}
                    />
                  </motion.div>
                ))
              )}
            </div>

            {/* Recommendations Carousel */}
            {!isLoading && filteredAndSortedBooks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="pt-8 border-t border-border/50"
              >
                <BookCarousel
                  title="📖 You might also like"
                  books={books.filter(book => !filteredAndSortedBooks.includes(book)).slice(0, 8)}
                  onBookClick={handleBookClick}
                />
              </motion.div>
            )}
          </div>
        </main>
      </div>

      {/* Sticky Add Book Button for Admin/Librarian */}
      {(userRole === 'admin' || userRole === 'librarian') && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 200 }}
          className="fixed bottom-6 right-6 z-40"
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-[#189ab4] to-[#75e6da] hover:opacity-90 shadow-2xl rounded-full h-14 w-14 p-0 group"
            onClick={() => console.log('Add new book')}
          >
            <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
          </Button>
        </motion.div>
      )}

      {/* Book Modal */}
      <BookModal
        book={selectedBook}
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
        onBorrow={onBorrow}
        onReserve={onReserve}
      />
    </div>
  );
}