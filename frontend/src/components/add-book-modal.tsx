import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { 
  BookOpen, 
  Upload, 
  X, 
  Star,
  Calendar,
  Hash,
  FileText,
  Globe,
  Building
} from 'lucide-react';
import { toast } from "sonner@2.0.3";
import { addBook } from '../lib/apiClient';
// Note: unsplash_tool would be imported from your API utilities

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (book: any) => void;
}

export function AddBookModal({ isOpen, onClose, onAdd }: AddBookModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    department: '',
    publishYear: new Date().getFullYear().toString(),
    publisher: '',
    language: 'English',
    pages: '',
    description: '',
    coverUrl: '',
    availability: 'available',
    rating: '0',
    copies: '1'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingCover, setIsGeneratingCover] = useState(false);

  const departments = [
    'CSE', 'Mechanical', 'Civil', 'Diploma', 'BBA', 'MBA', 'BCA', 'MCA', 'BHMCT',
    'Electronics', 'Electrical', 'Chemical', 'Automobile', 'Biotechnology',
    'Information Technology', 'Mathematics', 'Physics', 'Chemistry', 'English'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Generate cover if not provided
    let coverUrl = formData.coverUrl;
    if (!coverUrl && formData.title) {
      setIsGeneratingCover(true);
      try {
        // In a real implementation, you would use the unsplash_tool function
        // For now, we'll use a placeholder URL
        coverUrl = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400';
      } catch (error) {
        console.error('Failed to generate cover:', error);
        coverUrl = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400';
      }
      setIsGeneratingCover(false);
    }

    // Prepare book data for backend API
    const bookData = {
      title: formData.title,
      author: formData.author,
      isbn: formData.isbn,
      department: formData.department,
      publishYear: parseInt(formData.publishYear),
      publisher: formData.publisher || undefined,
      language: formData.language || 'English',
      pages: formData.pages ? parseInt(formData.pages) : undefined,
      description: formData.description || undefined,
      coverUrl: coverUrl,
      totalCopies: parseInt(formData.copies) || 1,
      availableCopies: parseInt(formData.copies) || 1,
      issuedCopies: 0,
      reservedCopies: 0,
      rating: parseFloat(formData.rating) || 0,
      reviewCount: 0
    };

    try {
      // Call actual backend API
      const savedBook = await addBook(bookData);
      
      onAdd(savedBook);
      toast.success('Book added successfully! Saved to database.');
      
      // Reset form
      setFormData({
        title: '',
        author: '',
        isbn: '',
        department: '',
        publishYear: new Date().getFullYear().toString(),
        publisher: '',
        language: 'English',
        pages: '',
        description: '',
        coverUrl: '',
        availability: 'available',
        rating: '0',
        copies: '1'
      });
    } catch (error: any) {
      console.error('Failed to add book:', error);
      toast.error(error.message || 'Failed to add book. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateCover = async () => {
    if (!formData.title && !formData.department) {
      toast.error('Please enter a title or select a department first');
      return;
    }

    setIsGeneratingCover(true);
    try {
      // Mock cover generation - in real app, this would call your image API
      const mockCovers = [
        'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400'
      ];
      const randomCover = mockCovers[Math.floor(Math.random() * mockCovers.length)];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      handleChange('coverUrl', randomCover);
      toast.success('Book cover generated!');
    } catch (error) {
      toast.error('Failed to generate cover. Please try again.');
    }
    setIsGeneratingCover(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-4xl glass-card border-border/50 max-h-[90vh] overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <DialogHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#189ab4] to-[#75e6da] bg-clip-text text-transparent">
                      Add New Book
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground mt-1">
                      Add a new book to the college library collection
                    </DialogDescription>
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
                
                {/* Book Preview Card */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass-card p-4 rounded-lg"
                >
                  <div className="flex gap-4">
                    <div className="w-20 h-28 bg-muted/50 rounded-lg overflow-hidden flex-shrink-0">
                      {formData.coverUrl ? (
                        <img 
                          src={formData.coverUrl} 
                          alt="Book cover" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">
                        {formData.title || 'Book Title'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        by {formData.author || 'Author Name'}
                      </p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {formData.department && (
                          <Badge variant="outline">{formData.department}</Badge>
                        )}
                        {formData.publishYear && (
                          <Badge variant="outline">{formData.publishYear}</Badge>
                        )}
                        <Badge 
                          className={
                            formData.availability === 'available' 
                              ? 'bg-green-500/20 text-green-700 dark:text-green-300'
                              : 'bg-red-500/20 text-red-700 dark:text-red-300'
                          }
                        >
                          {formData.availability}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-4"
                    >
                      <h4 className="font-semibold flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        Basic Information
                      </h4>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Book Title *</Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            placeholder="Enter book title"
                            className="glass-card border-border/50"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="author">Author *</Label>
                          <Input
                            id="author"
                            value={formData.author}
                            onChange={(e) => handleChange('author', e.target.value)}
                            placeholder="Author name"
                            className="glass-card border-border/50"
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="isbn">ISBN</Label>
                            <Input
                              id="isbn"
                              value={formData.isbn}
                              onChange={(e) => handleChange('isbn', e.target.value)}
                              placeholder="978-0-123456-78-9"
                              className="glass-card border-border/50"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="department">Department *</Label>
                            <Select value={formData.department} onValueChange={(value) => handleChange('department', value)}>
                              <SelectTrigger className="glass-card border-border/50">
                                <SelectValue placeholder="Select department" />
                              </SelectTrigger>
                              <SelectContent className="glass-card border-border/50">
                                {departments.map((dept) => (
                                  <SelectItem key={dept} value={dept}>
                                    {dept}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Publication Details */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-4"
                    >
                      <h4 className="font-semibold flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        Publication Details
                      </h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="publishYear">Publish Year</Label>
                          <Input
                            id="publishYear"
                            type="number"
                            value={formData.publishYear}
                            onChange={(e) => handleChange('publishYear', e.target.value)}
                            placeholder="2024"
                            className="glass-card border-border/50"
                            min="1000"
                            max={new Date().getFullYear() + 1}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="pages">Pages</Label>
                          <Input
                            id="pages"
                            type="number"
                            value={formData.pages}
                            onChange={(e) => handleChange('pages', e.target.value)}
                            placeholder="320"
                            className="glass-card border-border/50"
                            min="1"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="publisher">Publisher</Label>
                        <Input
                          id="publisher"
                          value={formData.publisher}
                          onChange={(e) => handleChange('publisher', e.target.value)}
                          placeholder="Publisher name"
                          className="glass-card border-border/50"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select value={formData.language} onValueChange={(value) => handleChange('language', value)}>
                          <SelectTrigger className="glass-card border-border/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="glass-card border-border/50">
                            <SelectItem value="English">English</SelectItem>
                            <SelectItem value="Spanish">Spanish</SelectItem>
                            <SelectItem value="French">French</SelectItem>
                            <SelectItem value="German">German</SelectItem>
                            <SelectItem value="Italian">Italian</SelectItem>
                            <SelectItem value="Portuguese">Portuguese</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </motion.div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Book Cover */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="space-y-4"
                    >
                      <h4 className="font-semibold flex items-center gap-2">
                        <Upload className="h-4 w-4 text-primary" />
                        Book Cover
                      </h4>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="coverUrl">Cover Image URL</Label>
                          <div className="flex gap-2">
                            <Input
                              id="coverUrl"
                              value={formData.coverUrl}
                              onChange={(e) => handleChange('coverUrl', e.target.value)}
                              placeholder="https://example.com/cover.jpg"
                              className="glass-card border-border/50"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={generateCover}
                              disabled={isGeneratingCover}
                              className="whitespace-nowrap"
                            >
                              {isGeneratingCover ? (
                                <motion.div
                                  className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                              ) : (
                                'Generate'
                              )}
                            </Button>
                          </div>
                        </div>
                        
                        {formData.coverUrl && (
                          <div className="w-32 h-44 bg-muted/50 rounded-lg overflow-hidden">
                            <img 
                              src={formData.coverUrl} 
                              alt="Book cover preview" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </motion.div>

                    {/* Library Settings */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="space-y-4"
                    >
                      <h4 className="font-semibold flex items-center gap-2">
                        <Building className="h-4 w-4 text-primary" />
                        Library Settings
                      </h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="availability">Availability</Label>
                          <Select value={formData.availability} onValueChange={(value) => handleChange('availability', value)}>
                            <SelectTrigger className="glass-card border-border/50">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="glass-card border-border/50">
                              <SelectItem value="available">Available</SelectItem>
                              <SelectItem value="borrowed">Borrowed</SelectItem>
                              <SelectItem value="reserved">Reserved</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="copies">Number of Copies</Label>
                          <Input
                            id="copies"
                            type="number"
                            value={formData.copies}
                            onChange={(e) => handleChange('copies', e.target.value)}
                            placeholder="1"
                            className="glass-card border-border/50"
                            min="1"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="rating">Initial Rating (0-5)</Label>
                        <Input
                          id="rating"
                          type="number"
                          value={formData.rating}
                          onChange={(e) => handleChange('rating', e.target.value)}
                          placeholder="0"
                          className="glass-card border-border/50"
                          min="0"
                          max="5"
                          step="0.1"
                        />
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-4"
                >
                  <h4 className="font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Description
                  </h4>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Enter book description, summary, or synopsis..."
                    className="glass-card border-border/50 resize-none"
                    rows={4}
                  />
                </motion.div>

                {/* Form Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex justify-end gap-3 pt-6 border-t border-border/50"
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || isGeneratingCover}
                    className="bg-gradient-to-r from-[#189ab4] to-[#75e6da] hover:opacity-90"
                  >
                    {isSubmitting ? (
                      <motion.div
                        className="flex items-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <motion.div
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Adding Book...
                      </motion.div>
                    ) : (
                      <>
                        <BookOpen className="h-4 w-4 mr-2" />
                        Add Book
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}