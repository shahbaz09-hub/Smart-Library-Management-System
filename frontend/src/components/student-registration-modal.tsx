import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Mail, Hash, GraduationCap, Calendar, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { registerStudent } from '../lib/apiClient';
import { toast } from "sonner@2.0.3";

interface StudentRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (student: {
    name: string;
    rollNumber: string;
    email: string;
    department: string;
    semester: number;
    password: string;
    confirmPassword: string;
  }) => void;
}

const departments = [
  { value: 'CSE', label: 'Computer Science Engineering' },
  { value: 'Mechanical', label: 'Mechanical Engineering' },
  { value: 'Civil', label: 'Civil Engineering' },
  { value: 'Diploma', label: 'Diploma Engineering' },
  { value: 'BBA', label: 'Bachelor of Business Administration' },
  { value: 'MBA', label: 'Master of Business Administration' },
  { value: 'BCA', label: 'Bachelor of Computer Applications' },
  { value: 'MCA', label: 'Master of Computer Applications' },
  { value: 'BHMCT', label: 'Bachelor of Hotel Management & Catering Technology' }
];

const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

export function StudentRegistrationModal({ isOpen, onClose, onRegister }: StudentRegistrationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    email: '',
    department: '',
    semester: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.rollNumber.trim()) {
      newErrors.rollNumber = 'Roll number is required';
    } else if (!/^[A-Z]+\d{5}$/.test(formData.rollNumber.toUpperCase())) {
      newErrors.rollNumber = 'Roll number format: DEPT21001 (e.g., CSE21001)';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    if (!formData.semester) {
      newErrors.semester = 'Semester is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Prepare data for backend API
    const studentData = {
      name: formData.name.trim(),
      rollNumber: formData.rollNumber.toUpperCase(),
      email: formData.email.trim().toLowerCase(),
      department: formData.department,
      semester: parseInt(formData.semester),
      password: formData.password,
      confirmPassword: formData.confirmPassword
    };

    try {
      // Call actual backend API
      await registerStudent(studentData);
      
      toast.success('Student registered successfully! Saved to database.');
      
      onRegister(studentData);
      setIsLoading(false);
      handleClose();
    } catch (error: any) {
      console.error('Failed to register student:', error);
      toast.error(error.message || 'Failed to register student. Please try again.');
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      rollNumber: '',
      email: '',
      department: '',
      semester: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative z-10 w-full max-w-md mx-4"
        >
          <Card className="glass-card border-0 shadow-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="bg-gradient-to-r from-[#189ab4] to-[#75e6da] bg-clip-text text-transparent">
                  Student Registration
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Register as a new student to access library services
              </p>
            </CardHeader>

            <CardContent className="max-h-[70vh] overflow-y-auto pr-2">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={errors.name ? 'border-destructive' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                {/* Roll Number */}
                <div className="space-y-2">
                  <Label htmlFor="rollNumber" className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Roll Number *
                  </Label>
                  <Input
                    id="rollNumber"
                    placeholder="e.g., CSE21001"
                    value={formData.rollNumber}
                    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value.toUpperCase() })}
                    className={errors.rollNumber ? 'border-destructive' : ''}
                  />
                  {errors.rollNumber && (
                    <p className="text-sm text-destructive">{errors.rollNumber}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@college.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                {/* Department */}
                <div className="space-y-2">
                  <Label htmlFor="department" className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Department *
                  </Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, department: value })}>
                    <SelectTrigger className={errors.department ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select your department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.value} value={dept.value}>
                          {dept.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.department && (
                    <p className="text-sm text-destructive">{errors.department}</p>
                  )}
                </div>

                {/* Semester */}
                <div className="space-y-2">
                  <Label htmlFor="semester" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Semester *
                  </Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, semester: value })}>
                    <SelectTrigger className={errors.semester ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {semesters.map((sem) => (
                        <SelectItem key={sem} value={sem.toString()}>
                          Semester {sem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.semester && (
                    <p className="text-sm text-destructive">{errors.semester}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className={errors.confirmPassword ? 'border-destructive pr-10' : 'pr-10'}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                  )}
                </div>

                <Alert>
                  <AlertDescription className="text-sm">
                    <strong>Note:</strong> Your Roll Number will be used as your unique identifier. 
                    Make sure it's correct as it cannot be changed later.
                  </AlertDescription>
                </Alert>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#189ab4] to-[#75e6da] hover:opacity-90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                  ) : null}
                  {isLoading ? 'Registering...' : 'Register Student'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}