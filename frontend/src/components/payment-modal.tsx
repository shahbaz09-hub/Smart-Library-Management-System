import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { formatCurrency } from './ui/currency-utils';
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  User, 
  BookOpen,
  AlertTriangle,
  Shield,
  Receipt
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

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  fine: Fine | null;
  onPaymentComplete: (fineId: string) => void;
}

export function PaymentModal({ isOpen, onClose, fine, onPaymentComplete }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'check'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    checkNumber: '',
    cashReceived: ''
  });

  if (!fine) return null;

  const discountedAmount = fine.discountApplied 
    ? fine.amount * (1 - fine.discountApplied / 100) 
    : fine.amount;

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setPaymentComplete(true);
    
    // Complete payment after showing success animation
    setTimeout(() => {
      onPaymentComplete(fine.id);
      handleClose();
    }, 2000);
  };

  const handleClose = () => {
    setPaymentComplete(false);
    setFormData({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: '',
      checkNumber: '',
      cashReceived: ''
    });
    onClose();
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setFormData(prev => ({ ...prev, cardNumber: formatted }));
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setFormData(prev => ({ ...prev, expiryDate: formatted }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={handleClose}>
          <DialogContent className="max-w-2xl glass-card border-border/50 max-h-[90vh] overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {paymentComplete ? (
                // Payment Success Screen
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-emerald-600 mb-6"
                  >
                    <CheckCircle className="h-10 w-10 text-white" />
                  </motion.div>
                  
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl font-bold text-green-600 mb-2"
                  >
                    Payment Successful!
                  </motion.h2>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-muted-foreground mb-4"
                  >
                    Fine payment of {formatCurrency(discountedAmount)} has been processed successfully.
                  </motion.p>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex justify-center"
                  >
                    <Badge className="bg-green-500/20 text-green-700 dark:text-green-300">
                      <Receipt className="h-3 w-3 mr-1" />
                      Receipt will be sent via email
                    </Badge>
                  </motion.div>
                </motion.div>
              ) : (
                <>
                  <DialogHeader className="pb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-[#189ab4] to-[#75e6da]">
                        <CreditCard className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <DialogTitle className="text-xl">Process Payment</DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground">
                          Complete payment for library fine
                        </DialogDescription>
                      </div>
                    </div>
                  </DialogHeader>

                  <div className="space-y-6">
                    {/* Fine Details */}
                    <Card className="glass-card border-border/50">
                      <CardContent className="p-4">
                        <h3 className="font-medium mb-3 flex items-center gap-2">
                          <Receipt className="h-4 w-4 text-primary" />
                          Fine Details
                        </h3>
                        
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-gradient-to-r from-[#189ab4] to-[#75e6da] text-white">
                              {fine.userName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{fine.userName}</span>
                              <span className="text-muted-foreground">•</span>
                              <span className="text-sm text-muted-foreground">{fine.userEmail}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{fine.bookTitle}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>Due: {new Date(fine.dueDate).toLocaleDateString()}</span>
                              <span>•</span>
                              <span>{fine.daysPastDue} days overdue</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border-t border-border/50 mt-4 pt-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Original Amount:</span>
                              <span>${fine.amount.toFixed(2)}</span>
                            </div>
                            
                            {fine.discountApplied && (
                              <div className="flex justify-between text-sm text-green-600">
                                <span>Discount ({fine.discountApplied}%):</span>
                                <span>-${(fine.amount * fine.discountApplied / 100).toFixed(2)}</span>
                              </div>
                            )}
                            
                            <div className="flex justify-between font-medium text-lg border-t border-border/50 pt-2">
                              <span>Total Amount:</span>
                              <span>${discountedAmount.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Payment Method Selection */}
                    <div>
                      <Label className="text-base font-medium mb-3 block">Payment Method</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: 'card', label: 'Credit Card', icon: CreditCard },
                          { value: 'cash', label: 'Cash', icon: DollarSign },
                          { value: 'check', label: 'Check', icon: Receipt }
                        ].map((method) => (
                          <motion.div
                            key={method.value}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              variant={paymentMethod === method.value ? 'default' : 'outline'}
                              onClick={() => setPaymentMethod(method.value as any)}
                              className={`w-full h-auto p-4 flex-col gap-2 ${
                                paymentMethod === method.value 
                                  ? 'bg-gradient-to-r from-[#189ab4] to-[#75e6da]' 
                                  : 'border-primary/20 hover:bg-primary/10'
                              }`}
                            >
                              <method.icon className="h-5 w-5" />
                              <span className="text-sm">{method.label}</span>
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Payment Form */}
                    {paymentMethod === 'card' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <div>
                          <Label htmlFor="cardholder">Cardholder Name</Label>
                          <Input
                            id="cardholder"
                            placeholder="John Doe"
                            value={formData.cardholderName}
                            onChange={(e) => setFormData(prev => ({ ...prev, cardholderName: e.target.value }))}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="cardnumber">Card Number</Label>
                          <Input
                            id="cardnumber"
                            placeholder="1234 5678 9012 3456"
                            value={formData.cardNumber}
                            onChange={handleCardNumberChange}
                            maxLength={19}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <Input
                              id="expiry"
                              placeholder="MM/YY"
                              value={formData.expiryDate}
                              onChange={handleExpiryChange}
                              maxLength={5}
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              placeholder="123"
                              value={formData.cvv}
                              onChange={(e) => setFormData(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '') }))}
                              maxLength={4}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {paymentMethod === 'cash' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Label htmlFor="cashReceived">Cash Received</Label>
                        <Input
                          id="cashReceived"
                          type="number"
                          placeholder="0.00"
                          value={formData.cashReceived}
                          onChange={(e) => setFormData(prev => ({ ...prev, cashReceived: e.target.value }))}
                          min={discountedAmount}
                          step="0.01"
                        />
                        {parseFloat(formData.cashReceived) > discountedAmount && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Change: ${(parseFloat(formData.cashReceived) - discountedAmount).toFixed(2)}
                          </p>
                        )}
                      </motion.div>
                    )}

                    {paymentMethod === 'check' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Label htmlFor="checkNumber">Check Number</Label>
                        <Input
                          id="checkNumber"
                          placeholder="Enter check number"
                          value={formData.checkNumber}
                          onChange={(e) => setFormData(prev => ({ ...prev, checkNumber: e.target.value }))}
                        />
                      </motion.div>
                    )}

                    {/* Security Notice */}
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <Shield className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-blue-700 dark:text-blue-300">Secure Payment</p>
                        <p className="text-blue-600 dark:text-blue-400">
                          Your payment information is encrypted and secure.
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
                      <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={isProcessing}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="bg-gradient-to-r from-[#189ab4] to-[#75e6da] hover:opacity-90"
                      >
                        {isProcessing ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"
                            />
                            Processing Payment...
                          </>
                        ) : (
                          <>
                            <CreditCard className="h-4 w-4 mr-2" />
                            Pay ${discountedAmount.toFixed(2)}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}