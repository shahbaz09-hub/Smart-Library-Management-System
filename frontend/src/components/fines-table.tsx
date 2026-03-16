import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { formatCurrency } from './ui/currency-utils';
import { 
  ChevronUp, 
  ChevronDown, 
  MoreHorizontal, 
  Eye, 
  CreditCard, 
  Send, 
  Percent, 
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  User,
  BookOpen
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

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

interface FinesTableProps {
  fines: Fine[];
  selectedFines: string[];
  onSelectionChange: (selected: string[]) => void;
  onPayFine: (fine: Fine) => void;
  onUpdateFine: (fineId: string, updates: Partial<Fine>) => void;
  userRole: 'admin' | 'librarian' | 'user';
}

type SortField = 'userName' | 'amount' | 'dueDate' | 'daysPastDue' | 'status';
type SortDirection = 'asc' | 'desc';

export function FinesTable({ 
  fines, 
  selectedFines, 
  onSelectionChange, 
  onPayFine, 
  onUpdateFine,
  userRole 
}: FinesTableProps) {
  const [sortField, setSortField] = useState<SortField>('dueDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedFines = [...fines].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];

    if (sortField === 'amount') {
      aValue = Number(aValue);
      bValue = Number(bValue);
    } else if (sortField === 'dueDate') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const paginatedFines = sortedFines.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedFines.length / itemsPerPage);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(paginatedFines.map(fine => fine.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectFine = (fineId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedFines, fineId]);
    } else {
      onSelectionChange(selectedFines.filter(id => id !== fineId));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'waived': return <XCircle className="h-4 w-4 text-gray-500" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500/20 text-green-700 dark:text-green-300';
      case 'overdue': return 'bg-red-500/20 text-red-700 dark:text-red-300';
      case 'pending': return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300';
      case 'waived': return 'bg-gray-500/20 text-gray-700 dark:text-gray-300';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className="h-auto p-2 font-medium hover:bg-primary/10"
    >
      {children}
      {sortField === field && (
        sortDirection === 'asc' ? 
        <ChevronUp className="h-3 w-3 ml-1" /> : 
        <ChevronDown className="h-3 w-3 ml-1" />
      )}
    </Button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="glass-card border-none overflow-hidden">
        <CardContent className="p-0">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-4">
                    <Checkbox
                      checked={selectedFines.length === paginatedFines.length && paginatedFines.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="text-left p-4">
                    <SortButton field="userName">User</SortButton>
                  </th>
                  <th className="text-left p-4">Book</th>
                  <th className="text-left p-4">
                    <SortButton field="amount">Amount</SortButton>
                  </th>
                  <th className="text-left p-4">
                    <SortButton field="dueDate">Due Date</SortButton>
                  </th>
                  <th className="text-left p-4">
                    <SortButton field="daysPastDue">Days Overdue</SortButton>
                  </th>
                  <th className="text-left p-4">
                    <SortButton field="status">Status</SortButton>
                  </th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedFines.map((fine, index) => (
                  <motion.tr
                    key={fine.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border/30 hover:bg-accent/50 transition-colors group"
                  >
                    <td className="p-4">
                      <Checkbox
                        checked={selectedFines.includes(fine.id)}
                        onCheckedChange={(checked) => handleSelectFine(fine.id, !!checked)}
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gradient-to-r from-[#189ab4] to-[#75e6da] text-white text-sm">
                            {fine.userName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{fine.userName}</p>
                          <p className="text-xs text-muted-foreground">{fine.userEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-sm">{fine.bookTitle}</p>
                      <p className="text-xs text-muted-foreground">ID: {fine.bookId}</p>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{formatCurrency(fine.amount)}</p>
                        {fine.discountApplied && (
                          <p className="text-xs text-green-600">
                            -{fine.discountApplied}% discount
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm">{new Date(fine.dueDate).toLocaleDateString()}</p>
                      <p className="text-xs text-muted-foreground">
                        Issued: {new Date(fine.issueDate).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="p-4">
                      <Badge className={fine.daysPastDue > 14 ? 'bg-red-500/20 text-red-700' : 'bg-yellow-500/20 text-yellow-700'}>
                        {fine.daysPastDue} days
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={getStatusColor(fine.status)}>
                        {getStatusIcon(fine.status)}
                        <span className="ml-1 capitalize">{fine.status}</span>
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {fine.status !== 'paid' && (
                          <Button
                            size="sm"
                            onClick={() => onPayFine(fine)}
                            className="bg-gradient-to-r from-[#189ab4] to-[#75e6da] hover:opacity-90 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <CreditCard className="h-3 w-3 mr-1" />
                            Pay
                          </Button>
                        )}
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="glass-card border-border/50">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {fine.status !== 'paid' && (
                              <>
                                <DropdownMenuItem>
                                  <Send className="h-4 w-4 mr-2" />
                                  Send Reminder
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Percent className="h-4 w-4 mr-2" />
                                  Apply Discount
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuItem>
                              <User className="h-4 w-4 mr-2" />
                              View User Profile
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4 p-4">
            {paginatedFines.map((fine, index) => (
              <motion.div
                key={fine.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card border-border/50 p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedFines.includes(fine.id)}
                      onCheckedChange={(checked) => handleSelectFine(fine.id, !!checked)}
                    />
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-r from-[#189ab4] to-[#75e6da] text-white">
                        {fine.userName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{fine.userName}</p>
                      <p className="text-sm text-muted-foreground">{fine.userEmail}</p>
                    </div>
                  </div>
                  
                  <Badge className={getStatusColor(fine.status)}>
                    {getStatusIcon(fine.status)}
                    <span className="ml-1 capitalize">{fine.status}</span>
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{fine.bookTitle}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Amount</p>
                      <p className="font-medium">{formatCurrency(fine.amount)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Days Overdue</p>
                      <p className="font-medium">{fine.daysPastDue} days</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs text-muted-foreground">
                    Due: {new Date(fine.dueDate).toLocaleDateString()}
                  </p>
                  
                  <div className="flex gap-2">
                    {fine.status !== 'paid' && (
                      <Button
                        size="sm"
                        onClick={() => onPayFine(fine)}
                        className="bg-gradient-to-r from-[#189ab4] to-[#75e6da] hover:opacity-90"
                      >
                        <CreditCard className="h-3 w-3 mr-1" />
                        Pay
                      </Button>
                    )}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="glass-card border-border/50">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {fine.status !== 'paid' && (
                          <>
                            <DropdownMenuItem>
                              <Send className="h-4 w-4 mr-2" />
                              Send Reminder
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Percent className="h-4 w-4 mr-2" />
                              Apply Discount
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-border/50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, sortedFines.length)} of{' '}
                  {sortedFines.length} entries
                </p>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={currentPage === page ? "bg-gradient-to-r from-[#189ab4] to-[#75e6da]" : ""}
                      >
                        {page}
                      </Button>
                    );
                  })}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}