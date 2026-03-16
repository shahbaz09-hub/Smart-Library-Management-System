import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  UserCheck,
  Shield,
  Upload,
  X
} from 'lucide-react';
import { toast } from "sonner@2.0.3";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (user: any) => void;
}

export function AddUserModal({ isOpen, onClose, onAdd }: AddUserModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    role: 'user',
    status: 'active',
    membershipType: 'standard',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newUser = {
      id: Date.now().toString(),
      name: `${formData.firstName} ${formData.lastName}`,
      ...formData,
      joinDate: new Date().toISOString().split('T')[0],
      booksCount: 0,
      fines: 0,
      lastActive: 'Never'
    };

    onAdd(newUser);
    toast.success('User added successfully!');
    
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      role: 'user',
      status: 'active',
      membershipType: 'standard',
      notes: ''
    });
    
    setIsSubmitting(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-2xl glass-card border-border/50 max-h-[90vh] overflow-y-auto">
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
                      Add New User
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground mt-1">
                      Add a new student or librarian to the system
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
                
                {/* User Preview Card */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass-card p-4 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-primary/20">
                      <AvatarFallback className="bg-gradient-to-r from-[#189ab4] to-[#75e6da] text-white text-lg">
                        {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">
                        {formData.firstName || formData.lastName 
                          ? `${formData.firstName} ${formData.lastName}`.trim()
                          : 'New User'
                        }
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {formData.email || 'email@example.com'}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="capitalize">
                          {formData.role}
                        </Badge>
                        <Badge 
                          className={
                            formData.status === 'active' 
                              ? 'bg-green-500/20 text-green-700 dark:text-green-300'
                              : 'bg-gray-500/20 text-gray-700 dark:text-gray-300'
                          }
                        >
                          {formData.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                {/* Personal Information */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <h4 className="font-semibold flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    Personal Information
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                        placeholder="John"
                        className="glass-card border-border/50"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleChange('lastName', e.target.value)}
                        placeholder="Doe"
                        className="glass-card border-border/50"
                        required
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Contact Information */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-4"
                >
                  <h4 className="font-semibold flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    Contact Information
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="john.doe@example.com"
                        className="glass-card border-border/50"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        className="glass-card border-border/50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                        placeholder="123 Main St, City, State 12345"
                        className="glass-card border-border/50 resize-none"
                        rows={2}
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Account Settings */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-4"
                >
                  <h4 className="font-semibold flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    Account Settings
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="role">User Role</Label>
                      <Select value={formData.role} onValueChange={(value) => handleChange('role', value)}>
                        <SelectTrigger className="glass-card border-border/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass-card border-border/50">
                          <SelectItem value="user">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              User
                            </div>
                          </SelectItem>
                          <SelectItem value="librarian">
                            <div className="flex items-center gap-2">
                              <UserCheck className="h-4 w-4" />
                              Librarian
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                        <SelectTrigger className="glass-card border-border/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass-card border-border/50">
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="membershipType">Membership Type</Label>
                      <Select value={formData.membershipType} onValueChange={(value) => handleChange('membershipType', value)}>
                        <SelectTrigger className="glass-card border-border/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass-card border-border/50">
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="faculty">Faculty</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </motion.div>

                {/* Additional Notes */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-4"
                >
                  <h4 className="font-semibold">Additional Notes</h4>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    placeholder="Any additional notes about this user..."
                    className="glass-card border-border/50 resize-none"
                    rows={3}
                  />
                </motion.div>

                {/* Form Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
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
                    disabled={isSubmitting}
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
                        Adding User...
                      </motion.div>
                    ) : (
                      <>
                        <User className="h-4 w-4 mr-2" />
                        Add User
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