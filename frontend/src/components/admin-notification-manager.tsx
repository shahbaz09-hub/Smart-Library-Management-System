import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { useNotifications } from './notification-service';
import { 
  Send, 
  Users, 
  BookOpen, 
  AlertTriangle, 
  TrendingUp,
  Settings,
  Bell,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Filter,
  Download,
  Upload,
  Trash2,
  Edit3
} from 'lucide-react';

interface AdminNotificationManagerProps {
  userRole: 'admin' | 'librarian' | 'user';
}

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  department: string;
  email: string;
}

const mockStudents: Student[] = [
  { id: '1', name: 'Aarav Sharma', rollNumber: 'CSE21001', department: 'CSE', email: 'aarav.sharma@college.edu' },
  { id: '2', name: 'Priya Patel', rollNumber: 'MECH21045', department: 'Mechanical', email: 'priya.patel@college.edu' },
  { id: '3', name: 'Neha Yadav', rollNumber: 'CIVIL21023', department: 'Civil', email: 'neha.yadav@college.edu' },
  { id: '4', name: 'Rakesh Verma', rollNumber: 'BBA21067', department: 'BBA', email: 'rakesh.verma@college.edu' },
  { id: '5', name: 'Ananya Gupta', rollNumber: 'MBA22012', department: 'MBA', email: 'ananya.gupta@college.edu' },
  { id: '6', name: 'Rohit Singh', rollNumber: 'BCA21089', department: 'BCA', email: 'rohit.singh@college.edu' },
  { id: '7', name: 'Pooja Patel', rollNumber: 'MCA22034', department: 'MCA', email: 'pooja.patel@college.edu' },
  { id: '8', name: 'Vikash Jha', rollNumber: 'DIP21156', department: 'Diploma', email: 'vikash.jha@college.edu' },
  { id: '9', name: 'Sneha Agarwal', rollNumber: 'BHMCT21078', department: 'BHMCT', email: 'sneha.agarwal@college.edu' }
];

export function AdminNotificationManager({ userRole }: AdminNotificationManagerProps) {
  const { 
    notifications, 
    sendCustomNotification, 
    generateSystemNotification,
    generateStockAlert,
    getNotificationsByRole,
    getUnreadCount
  } = useNotifications();

  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationPriority, setNotificationPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isComposing, setIsComposing] = useState(false);
  const [activeTab, setActiveTab] = useState('send');

  const departments = ['all', 'CSE', 'Mechanical', 'Civil', 'Electrical', 'BCA', 'MCA', 'MBA', 'BBA', 'Diploma', 'BHMCT'];

  const filteredStudents = selectedDepartment === 'all' 
    ? mockStudents 
    : mockStudents.filter(student => student.department === selectedDepartment);

  const handleStudentSelection = (studentId: string, checked: boolean) => {
    if (checked) {
      setSelectedStudents(prev => [...prev, studentId]);
    } else {
      setSelectedStudents(prev => prev.filter(id => id !== studentId));
    }
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s.rollNumber));
    }
  };

  const handleSendNotification = () => {
    if (!notificationTitle || !notificationMessage || selectedStudents.length === 0) {
      return;
    }

    sendCustomNotification(
      selectedStudents,
      notificationTitle,
      notificationMessage,
      notificationPriority
    );

    // Reset form
    setNotificationTitle('');
    setNotificationMessage('');
    setSelectedStudents([]);
    setNotificationPriority('medium');
    setIsComposing(false);
  };

  const handleGenerateSystemNotification = (type: 'maintenance' | 'system_update', message: string) => {
    generateSystemNotification(message, type, 'medium');
  };

  const adminNotifications = getNotificationsByRole('admin');
  const unreadAdminCount = getUnreadCount('admin');

  const notificationStats = {
    total: adminNotifications.length,
    unread: unreadAdminCount,
    urgent: adminNotifications.filter(n => n.priority === 'urgent' && !n.read).length,
    today: adminNotifications.filter(n => 
      new Date(n.timestamp).toDateString() === new Date().toDateString()
    ).length
  };

  const quickActions = [
    {
      title: 'Low Stock Alert',
      description: 'Send alert for books running low on stock',
      icon: BookOpen,
      action: () => generateStockAlert('Sample Book Title', 2, 'low_stock'),
      color: 'text-yellow-600'
    },
    {
      title: 'Maintenance Notice',
      description: 'Notify about scheduled maintenance',
      icon: Settings,
      action: () => handleGenerateSystemNotification('maintenance', 'Library system will be under maintenance from 2 AM to 4 AM tomorrow.'),
      color: 'text-blue-600'
    },
    {
      title: 'System Update',
      description: 'Announce new features or updates',
      icon: TrendingUp,
      action: () => handleGenerateSystemNotification('system_update', 'New features have been added to the library management system. Check them out!'),
      color: 'text-green-600'
    }
  ];

  if (userRole !== 'admin' && userRole !== 'librarian') {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Notification Management</h2>
          <p className="text-muted-foreground">Send custom notifications and manage system alerts</p>
        </div>
        <Button 
          onClick={() => setIsComposing(true)}
          className="bg-gradient-to-r from-[#189ab4] to-[#75e6da] hover:opacity-90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Compose Notification
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sent</p>
                <p className="text-2xl font-bold">{notificationStats.total}</p>
              </div>
              <Bell className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unread</p>
                <p className="text-2xl font-bold">{notificationStats.unread}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Urgent</p>
                <p className="text-2xl font-bold">{notificationStats.urgent}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today</p>
                <p className="text-2xl font-bold">{notificationStats.today}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="send">Send Notifications</TabsTrigger>
          <TabsTrigger value="quick">Quick Actions</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="send" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Compose Custom Notification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Department Filter */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Department Filter</Label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>
                          {dept === 'all' ? 'All Departments' : dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Priority Level</Label>
                  <Select value={notificationPriority} onValueChange={(value: 'low' | 'medium' | 'high') => setNotificationPriority(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="high">High Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Student Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label>Select Recipients ({selectedStudents.length} selected)</Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSelectAll}
                  >
                    {selectedStudents.length === filteredStudents.length ? 'Deselect All' : 'Select All'}
                  </Button>
                </div>
                <div className="max-h-40 overflow-y-auto border rounded-lg p-3 space-y-2">
                  {filteredStudents.map(student => (
                    <div key={student.id} className="flex items-center space-x-3">
                      <Checkbox
                        checked={selectedStudents.includes(student.rollNumber)}
                        onCheckedChange={(checked) => handleStudentSelection(student.rollNumber, checked as boolean)}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{student.name}</p>
                        <p className="text-xs text-muted-foreground">{student.rollNumber} - {student.department}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notification Content */}
              <div className="space-y-3">
                <div>
                  <Label>Notification Title</Label>
                  <Input
                    placeholder="Enter notification title..."
                    value={notificationTitle}
                    onChange={(e) => setNotificationTitle(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Message</Label>
                  <Textarea
                    placeholder="Enter notification message..."
                    value={notificationMessage}
                    onChange={(e) => setNotificationMessage(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>

              {/* Send Button */}
              <div className="flex justify-end">
                <Button 
                  onClick={handleSendNotification}
                  disabled={!notificationTitle || !notificationMessage || selectedStudents.length === 0}
                  className="bg-gradient-to-r from-[#189ab4] to-[#75e6da] hover:opacity-90"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send to {selectedStudents.length} Students
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quick" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="glass-card cursor-pointer hover:shadow-lg transition-all" onClick={action.action}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10`}>
                        <action.icon className={`h-6 w-6 ${action.color}`} />
                      </div>
                      <div>
                        <h3 className="font-medium">{action.title}</h3>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Template Notifications */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Common Templates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                {
                  title: 'Library Hours Extended',
                  message: 'Great news! Library hours have been extended during exam week. New timings: 7 AM - 11 PM daily.',
                  priority: 'medium' as const
                },
                {
                  title: 'New Book Arrival',
                  message: 'New academic books have arrived for your department. Visit the library to check them out!',
                  priority: 'low' as const
                },
                {
                  title: 'Fine Payment Reminder',
                  message: 'You have outstanding fines. Please clear them to continue issuing books.',
                  priority: 'high' as const
                }
              ].map((template, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{template.title}</p>
                    <p className="text-sm text-muted-foreground">{template.message}</p>
                    <Badge variant={template.priority === 'high' ? 'destructive' : template.priority === 'medium' ? 'default' : 'secondary'}>
                      {template.priority} priority
                    </Badge>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setNotificationTitle(template.title);
                      setNotificationMessage(template.message);
                      setNotificationPriority(template.priority);
                      setActiveTab('send');
                    }}
                  >
                    Use Template
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {adminNotifications.slice(0, 10).map((notification) => (
                  <div key={notification.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{notification.title}</p>
                        <Badge variant={
                          notification.priority === 'urgent' ? 'destructive' :
                          notification.priority === 'high' ? 'destructive' :
                          notification.priority === 'medium' ? 'default' : 'secondary'
                        }>
                          {notification.priority}
                        </Badge>
                        {!notification.read && (
                          <Badge className="bg-blue-500">New</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Compose Dialog */}
      <Dialog open={isComposing} onOpenChange={setIsComposing}>
        <DialogContent className="glass-card max-w-2xl">
          <DialogHeader>
            <DialogTitle>Quick Compose</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Notification title..."
              value={notificationTitle}
              onChange={(e) => setNotificationTitle(e.target.value)}
            />
            <Textarea
              placeholder="Notification message..."
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsComposing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendNotification}>
                Send
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}