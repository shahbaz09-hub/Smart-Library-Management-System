import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { 
  Percent, 
  DollarSign, 
  Calculator, 
  AlertTriangle, 
  CheckCircle,
  X,
  User,
  BookOpen
} from 'lucide-react';

interface Fine {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  bookTitle: string;
  bookId: string;
  amount: number;
  dueDate: string;
  daysPastDue: number;
  status: 'pending' | 'paid' | 'waived' | 'overdue';
  issueDate: string;
  lastReminder?: string;
  paymentDate?: string;
  discountApplied?: number;
}

interface ApplyDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFines: Fine[];
  onDiscountApplied: (fineIds: string[], discountPercentage: number) => void;
}

export function ApplyDiscountModal({ 
  isOpen, 
  onClose, 
  selectedFines, 
  onDiscountApplied 
}: ApplyDiscountModalProps) {
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [reason, setReason] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const totalAmount = selectedFines.reduce((sum, fine) => sum + fine.amount, 0);
  const discountAmount = discountType === 'percentage' 
    ? (totalAmount * (parseFloat(discountValue) || 0)) / 100
    : parseFloat(discountValue) || 0;
  const finalAmount = Math.max(0, totalAmount - discountAmount);

  const predefinedDiscounts = [
    { value: 10, label: '10% - Early Payment', reason: 'Early payment incentive' },
    { value: 25, label: '25% - First Offense', reason: 'First-time fine discount' },
    { value: 50, label: '50% - Hardship', reason: 'Financial hardship consideration' },
    { value: 100, label: '100% - Waive', reason: 'Full waiver - administrative decision' }
  ];

  const handleApplyDiscount = async () => {
    if (!discountValue || !reason.trim()) return;

    setIsApplying(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const discountPercentage = discountType === 'percentage' 
      ? parseFloat(discountValue)
      : (parseFloat(discountValue) / totalAmount) * 100;
    
    onDiscountApplied(selectedFines.map(f => f.id), discountPercentage);
    
    // Reset form
    setDiscountValue('');
    setReason('');
    setIsApplying(false);
  };

  const handlePredefinedDiscount = (discount: typeof predefinedDiscounts[0]) => {
    setDiscountType('percentage');
    setDiscountValue(discount.value.toString());
    setReason(discount.reason);
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
              <DialogHeader className="pb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-[#189ab4] to-[#75e6da]">
                    <Percent className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl">Apply Discount</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                      Apply discount to {selectedFines.length} selected fine{selectedFines.length > 1 ? 's' : ''}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {/* Selected Fines Summary */}
                <Card className="glass-card border-border/50">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <Calculator className="h-4 w-4 text-primary" />
                      Selected Fines Summary
                    </h3>
                    
                    <div className="space-y-3 max-h-32 overflow-y-auto">
                      {selectedFines.map((fine) => (
                        <div key={fine.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <User className="h-3 w-3 text-muted-foreground" />
                            <span>{fine.userName}</span>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-muted-foreground">{fine.bookTitle}</span>
                          </div>
                          <span className="font-medium">${fine.amount.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t border-border/50 mt-3 pt-3">
                      <div className="flex justify-between items-center font-medium">
                        <span>Total Amount:</span>
                        <span>${totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Predefined Discounts */}
                <div>
                  <Label className="text-base font-medium mb-3 block">Quick Discounts</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {predefinedDiscounts.map((discount) => (
                      <motion.div
                        key={discount.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant="outline"
                          onClick={() => handlePredefinedDiscount(discount)}
                          className="w-full h-auto p-3 border-primary/20 hover:bg-primary/10 flex-col items-start"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Percent className="h-4 w-4" />
                            <span className="font-medium">{discount.label}</span>
                          </div>
                          <p className="text-xs text-muted-foreground text-left">
                            {discount.reason}
                          </p>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Custom Discount */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Custom Discount</Label>
                  
                  <div className="flex gap-3">
                    <Button
                      variant={discountType === 'percentage' ? 'default' : 'outline'}
                      onClick={() => setDiscountType('percentage')}
                      className={discountType === 'percentage' ? 'bg-gradient-to-r from-[#189ab4] to-[#75e6da]' : ''}
                    >
                      <Percent className="h-4 w-4 mr-2" />
                      Percentage
                    </Button>
                    <Button
                      variant={discountType === 'fixed' ? 'default' : 'outline'}
                      onClick={() => setDiscountType('fixed')}
                      className={discountType === 'fixed' ? 'bg-gradient-to-r from-[#189ab4] to-[#75e6da]' : ''}
                    >
                      <DollarSign className="h-4 w-4 mr-2" />
                      Fixed Amount
                    </Button>
                  </div>

                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      {discountType === 'percentage' ? '%' : '$'}
                    </div>
                    <Input
                      type="number"
                      placeholder={discountType === 'percentage' ? 'Enter percentage' : 'Enter amount'}
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                      className="pl-8"
                      min="0"
                      max={discountType === 'percentage' ? '100' : totalAmount.toString()}
                    />
                  </div>
                </div>

                {/* Discount Preview */}
                {discountValue && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="glass-card border-border/50 bg-gradient-to-r from-green-500/10 to-emerald-500/10">
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Discount Preview
                        </h4>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Original Amount:</span>
                            <span>${totalAmount.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-green-600">
                            <span>Discount ({discountType === 'percentage' ? `${discountValue}%` : `$${discountValue}`}):</span>
                            <span>-${discountAmount.toFixed(2)}</span>
                          </div>
                          <div className="border-t border-border/50 pt-2 flex justify-between font-medium">
                            <span>Final Amount:</span>
                            <span>${finalAmount.toFixed(2)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Reason */}
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Discount *</Label>
                  <Textarea
                    id="reason"
                    placeholder="Please provide a reason for applying this discount..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Warning */}
                {discountAmount > totalAmount * 0.5 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20"
                  >
                    <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-yellow-700 dark:text-yellow-300">Large Discount Warning</p>
                      <p className="text-yellow-600 dark:text-yellow-400">
                        You're applying a discount of more than 50%. This action may require supervisor approval.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    disabled={isApplying}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleApplyDiscount}
                    disabled={!discountValue || !reason.trim() || isApplying}
                    className="bg-gradient-to-r from-[#189ab4] to-[#75e6da] hover:opacity-90"
                  >
                    {isApplying ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"
                        />
                        Applying Discount...
                      </>
                    ) : (
                      <>
                        <Percent className="h-4 w-4 mr-2" />
                        Apply Discount
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}