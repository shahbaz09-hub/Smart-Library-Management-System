import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  Send, 
  Mail, 
  MessageSquare, 
  Clock, 
  User, 
  BookOpen,
  AlertTriangle,
  CheckCircle
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

interface SendReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFines: Fine[];
  onReminderSent: () => void;
}

export function SendReminderModal({ 
  isOpen, 
  onClose, 
  selectedFines = [], // Add default empty array
  onReminderSent 
}: SendReminderModalProps) {
  const [reminderType, setReminderType] = useState<'email' | 'sms' | 'both'>('email');
  const [subject, setSubject] = useState('Outstanding Library Fine Reminder');
  const [message, setMessage] = useState(`Dear [USER_NAME],

This is a friendly reminder that you have an outstanding fine of $[FINE_AMOUNT] for the book "[BOOK_TITLE]".

Fine Details:
- Book: [BOOK_TITLE]
- Due Date: [DUE_DATE]
- Days Overdue: [DAYS_OVERDUE]
- Fine Amount: $[FINE_AMOUNT]

Please visit the library or use our online portal to pay your fine at your earliest convenience.

Thank you for your cooperation.

Best regards,
Library Management Team`);
  const [isSending, setIsSending] = useState(false);
  const [sendComplete, setSendComplete] = useState(false);

  const totalFines = (selectedFines || []).reduce((sum, fine) => sum + fine.amount, 0);
  const uniqueUsers = [...new Set((selectedFines || []).map(f => f.userId))];

  const predefinedTemplates = [
    {
      name: 'Gentle Reminder',
      subject: 'Friendly Library Fine Reminder',
      message: `Dear [USER_NAME],

We hope this message finds you well. This is a gentle reminder about your outstanding library fine.

Fine Details:
- Book: [BOOK_TITLE]
- Amount: $[FINE_AMOUNT]
- Days Overdue: [DAYS_OVERDUE]

We understand that things can slip through the cracks. Please pay your fine when convenient.

Thank you for being a valued library member!

Best regards,
Library Team`
    },
    {
      name: 'Standard Notice',
      subject: 'Outstanding Library Fine Notice',
      message: `Dear [USER_NAME],

This is a notice regarding your outstanding library fine of $[FINE_AMOUNT] for "[BOOK_TITLE]".

The book was due on [DUE_DATE] and is now [DAYS_OVERDUE] days overdue.

Please settle this fine promptly to avoid any restrictions on your library account.

Thank you for your cooperation.

Library Management`
    },
    {
      name: 'Final Notice',
      subject: 'FINAL NOTICE: Overdue Library Fine',
      message: `Dear [USER_NAME],

This is a FINAL NOTICE regarding your overdue library fine.

URGENT: Your fine of $[FINE_AMOUNT] for "[BOOK_TITLE]" is now [DAYS_OVERDUE] days overdue.

Failure to pay this fine within 5 business days may result in:
- Account suspension
- Additional late fees
- Referral to collections

Please contact us immediately to resolve this matter.

Library Administration`
    }
  ];

  const handleSendReminder = async () => {
    setIsSending(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSending(false);
    setSendComplete(true);
    
    // Complete after showing success animation
    setTimeout(() => {
      onReminderSent();
      handleClose();
    }, 2000);
  };

  const handleClose = () => {
    setSendComplete(false);
    setSubject('Outstanding Library Fine Reminder');
    setMessage(predefinedTemplates[0].message);
    onClose();
  };

  const applyTemplate = (template: typeof predefinedTemplates[0]) => {
    setSubject(template.subject);
    setMessage(template.message);
  };

  const getVariablePreview = () => {
    if (!selectedFines || selectedFines.length === 0) return '';
    
    const sampleFine = selectedFines[0];
    return message
      .replace(/\[USER_NAME\]/g, sampleFine.userName)
      .replace(/\[BOOK_TITLE\]/g, sampleFine.bookTitle)
      .replace(/\[FINE_AMOUNT\]/g, sampleFine.amount.toFixed(2))
      .replace(/\[DUE_DATE\]/g, new Date(sampleFine.dueDate).toLocaleDateString())
      .replace(/\[DAYS_OVERDUE\]/g, sampleFine.daysPastDue.toString());
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={handleClose}>
          <DialogContent className="max-w-4xl glass-card border-border/50 max-h-[90vh] overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {sendComplete ? (
                // Success Screen
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
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
                    Reminders Sent Successfully!
                  </motion.h2>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-muted-foreground mb-4"
                  >
                    {(selectedFines || []).length} reminder{(selectedFines || []).length > 1 ? 's' : ''} sent to {uniqueUsers.length} user{uniqueUsers.length > 1 ? 's' : ''}
                  </motion.p>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex justify-center"
                  >
                    <Badge className="bg-green-500/20 text-green-700 dark:text-green-300">
                      <Mail className="h-3 w-3 mr-1" />
                      Delivery confirmed
                    </Badge>
                  </motion.div>
                </motion.div>
              ) : (
                <>
                  <DialogHeader className="pb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-[#189ab4] to-[#75e6da]">
                        <Send className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <DialogTitle className="text-xl">Send Reminder</DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground">
                          Send reminder to {uniqueUsers.length} user{uniqueUsers.length > 1 ? 's' : ''} about {(selectedFines || []).length} fine{(selectedFines || []).length > 1 ? 's' : ''}
                        </DialogDescription>
                      </div>
                    </div>
                  </DialogHeader>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column - Form */}
                    <div className="space-y-6">
                      {/* Delivery Method */}
                      <div>
                        <Label className="text-base font-medium mb-3 block">Delivery Method</Label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { value: 'email', label: 'Email', icon: Mail },
                            { value: 'sms', label: 'SMS', icon: MessageSquare },
                            { value: 'both', label: 'Both', icon: Send }
                          ].map((method) => (
                            <motion.div
                              key={method.value}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Button
                                variant={reminderType === method.value ? 'default' : 'outline'}
                                onClick={() => setReminderType(method.value as any)}
                                className={`w-full h-auto p-4 flex-col gap-2 ${
                                  reminderType === method.value 
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

                      {/* Quick Templates */}
                      <div>
                        <Label className="text-base font-medium mb-3 block">Quick Templates</Label>
                        <div className="space-y-2">
                          {predefinedTemplates.map((template, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              onClick={() => applyTemplate(template)}
                              className="w-full justify-start text-left h-auto p-3 border-primary/20 hover:bg-primary/10"
                            >
                              <div>
                                <div className="font-medium text-sm">{template.name}</div>
                                <div className="text-xs text-muted-foreground truncate">
                                  {template.subject}
                                </div>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Subject */}
                      <div>
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          placeholder="Enter email subject"
                        />
                      </div>

                      {/* Message */}
                      <div>
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Enter your message"
                          rows={8}
                          className="resize-none"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Available variables: [USER_NAME], [BOOK_TITLE], [FINE_AMOUNT], [DUE_DATE], [DAYS_OVERDUE]
                        </p>
                      </div>
                    </div>

                    {/* Right Column - Preview & Summary */}
                    <div className="space-y-6">
                      {/* Summary */}
                      <Card className="glass-card border-border/50">
                        <CardContent className="p-4">
                          <h3 className="font-medium mb-3 flex items-center gap-2">
                            <User className="h-4 w-4 text-primary" />
                            Reminder Summary
                          </h3>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span>Recipients:</span>
                              <span className="font-medium">{uniqueUsers.length} users</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Total Fines:</span>
                              <span className="font-medium">${totalFines.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Delivery Method:</span>
                              <span className="font-medium capitalize">{reminderType}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Selected Fines */}
                      <Card className="glass-card border-border/50">
                        <CardContent className="p-4">
                          <h3 className="font-medium mb-3 flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-primary" />
                            Selected Fines ({(selectedFines || []).length})
                          </h3>
                          
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {(selectedFines || []).slice(0, 5).map((fine) => (
                              <div key={fine.id} className="flex items-center gap-2 text-sm">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="bg-gradient-to-r from-[#189ab4] to-[#75e6da] text-white text-xs">
                                    {fine.userName.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="truncate">{fine.userName}</div>
                                  <div className="text-xs text-muted-foreground truncate">
                                    ${fine.amount.toFixed(2)} - {fine.bookTitle}
                                  </div>
                                </div>
                              </div>
                            ))}
                            {(selectedFines || []).length > 5 && (
                              <div className="text-xs text-muted-foreground text-center">
                                +{(selectedFines || []).length - 5} more...
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Preview */}
                      <Card className="glass-card border-border/50">
                        <CardContent className="p-4">
                          <h3 className="font-medium mb-3 flex items-center gap-2">
                            <Mail className="h-4 w-4 text-primary" />
                            Message Preview
                          </h3>
                          
                          <div className="text-sm space-y-2">
                            <div>
                              <span className="font-medium">Subject:</span> {subject}
                            </div>
                            <div className="border-t border-border/50 pt-2">
                              <pre className="whitespace-pre-wrap text-xs text-muted-foreground max-h-48 overflow-y-auto">
                                {getVariablePreview()}
                              </pre>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-6 border-t border-border/50">
                    <Button
                      variant="outline"
                      onClick={handleClose}
                      disabled={isSending}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSendReminder}
                      disabled={isSending || !subject.trim() || !message.trim()}
                      className="bg-gradient-to-r from-[#189ab4] to-[#75e6da] hover:opacity-90"
                    >
                      {isSending ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"
                          />
                          Sending Reminders...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send {(selectedFines || []).length} Reminder{(selectedFines || []).length > 1 ? 's' : ''}
                        </>
                      )}
                    </Button>
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