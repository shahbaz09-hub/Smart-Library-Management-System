import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { Card, CardContent } from './ui/card';
import { useNotifications, Notification } from './notification-service';
import { 
  Bell, 
  X, 
  BookOpen, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Heart,
  Star,
  Calendar,
  Gift,
  TrendingUp,
  MessageSquare,
  Settings,
  DollarSign,
  UserPlus,
  BookmarkPlus,
  Package,
  Eye,
  Trash2,
  MoreHorizontal,
  Mail,
  CheckCheck,
  Users,
  BookCheck,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: 'admin' | 'librarian' | 'user';
  userId?: string;
  onNotificationAction: (notification: Notification) => void;
}

export function NotificationsPanel({ 
  isOpen, 
  onClose, 
  userRole,
  userId,
  onNotificationAction 
}: NotificationsPanelProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [newNotificationIds, setNewNotificationIds] = useState<string[]>([]);
  const previousNotificationIdsRef = useRef<string[]>([]);

  const { 
    getNotificationsByRole, 
    markAsRead, 
    markAllAsRead, 
    dismissNotification 
  } = useNotifications();

  // Get role-based notifications
  const notifications = getNotificationsByRole(userRole, userId);

  // Handle new notifications detection
  useEffect(() => {
    if (!notifications || !Array.isArray(notifications)) return;
    
    const currentIds = notifications.map(n => n.id);
    const previousIds = previousNotificationIdsRef.current;
    
    // Only update if the IDs have actually changed
    const idsChanged = currentIds.length !== previousIds.length || 
                      currentIds.some(id => !previousIds.includes(id));
    
    if (idsChanged) {
      const newIds = currentIds.filter(id => !previousIds.includes(id));
      
      if (newIds.length > 0 && previousIds.length > 0) {
        setNewNotificationIds(newIds);
        // Remove the "new" status after animation
        setTimeout(() => {
          setNewNotificationIds([]);
        }, 2000);
      }
      
      previousNotificationIdsRef.current = currentIds;
    }
  }, [notifications]);

  const getNotificationIcon = (type: string, priority?: string) => {
    const iconClass = `h-4 w-4 ${priority === 'urgent' ? 'animate-pulse' : ''}`;
    
    switch (type) {
      case 'due_soon': return <Clock className={`${iconClass} text-yellow-500`} />;
      case 'overdue': return <AlertTriangle className={`${iconClass} text-red-500`} />;
      case 'returned': return <CheckCircle className={`${iconClass} text-green-500`} />;
      case 'reserved': return <BookOpen className={`${iconClass} text-blue-500`} />;
      case 'recommendation': return <Heart className={`${iconClass} text-pink-500`} />;
      case 'achievement': return <Star className={`${iconClass} text-yellow-500`} />;
      case 'system': return <Bell className={`${iconClass} text-primary`} />;
      case 'fine': return <DollarSign className={`${iconClass} text-red-500`} />;
      case 'new_arrival': return <Package className={`${iconClass} text-green-500`} />;
      case 'book_request': return <BookmarkPlus className={`${iconClass} text-blue-500`} />;
      case 'stock_alert': return <AlertCircle className={`${iconClass} text-orange-500`} />;
      case 'user_registration': return <UserPlus className={`${iconClass} text-green-500`} />;
      case 'book_approved': return <CheckCircle className={`${iconClass} text-green-500`} />;
      case 'book_rejected': return <XCircle className={`${iconClass} text-red-500`} />;
      case 'book_available': return <BookCheck className={`${iconClass} text-blue-500`} />;
      default: return <Bell className={`${iconClass} text-muted-foreground`} />;
    }
  };

  const getNotificationColor = (type: string, priority?: string) => {
    if (priority === 'urgent') return 'border-l-red-500 bg-red-500/5';
    if (priority === 'high') return 'border-l-orange-500 bg-orange-500/5';
    
    switch (type) {
      case 'due_soon': return 'border-l-yellow-500';
      case 'overdue': return 'border-l-red-500';
      case 'returned': return 'border-l-green-500';
      case 'reserved': return 'border-l-blue-500';
      case 'recommendation': return 'border-l-pink-500';
      case 'achievement': return 'border-l-yellow-500';
      case 'system': return 'border-l-primary';
      case 'fine': return 'border-l-red-500';
      case 'new_arrival': return 'border-l-green-500';
      case 'book_request': return 'border-l-blue-500';
      case 'stock_alert': return 'border-l-orange-500';
      case 'user_registration': return 'border-l-green-500';
      case 'book_approved': return 'border-l-green-500';
      case 'book_rejected': return 'border-l-red-500';
      case 'book_available': return 'border-l-blue-500';
      default: return 'border-l-muted';
    }
  };

  const getPriorityBadge = (priority?: string) => {
    if (!priority || priority === 'low') return null;
    
    const colors = {
      medium: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300',
      high: 'bg-orange-500/20 text-orange-700 dark:text-orange-300',
      urgent: 'bg-red-500/20 text-red-700 dark:text-red-300 animate-pulse'
    };

    return (
      <Badge className={`text-xs ${colors[priority as keyof typeof colors]}`}>
        {priority.toUpperCase()}
      </Badge>
    );
  };

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
  };

  const handleDismiss = (id: string) => {
    dismissNotification(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead(userRole);
  };

  const getFilteredNotifications = () => {
    if (!notifications || !Array.isArray(notifications)) return [];
    
    let filtered = [...notifications];
    
    switch (activeTab) {
      case 'unread':
        filtered = filtered.filter(n => !n.read);
        break;
      case 'books':
        filtered = filtered.filter(n => ['due_soon', 'overdue', 'returned', 'reserved', 'new_arrival', 'book_approved', 'book_rejected', 'book_available'].includes(n.type));
        break;
      case 'system':
        if (userRole === 'admin' || userRole === 'librarian') {
          filtered = filtered.filter(n => ['system', 'book_request', 'stock_alert', 'user_registration', 'fine'].includes(n.type));
        } else {
          filtered = filtered.filter(n => ['system', 'achievement', 'fine'].includes(n.type));
        }
        break;
    }
    
    // Sort by timestamp (newest first) and priority
    return filtered.sort((a, b) => {
      // Urgent notifications first
      if (a.priority === 'urgent' && b.priority !== 'urgent') return -1;
      if (b.priority === 'urgent' && a.priority !== 'urgent') return 1;
      
      // Then by timestamp
      return b.timestamp - a.timestamp;
    });
  };

  const unreadCount = (notifications || []).filter(n => !n.read).length;
  const urgentCount = (notifications || []).filter(n => n.priority === 'urgent' && !n.read).length;

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const filteredNotifications = getFilteredNotifications();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 lg:hidden"
            onClick={onClose}
          />

          {/* Desktop Panel - Slide from right */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-96 max-w-[90vw] glass-card border-l border-border/50 z-50 hidden lg:flex flex-col backdrop-blur-xl bg-background/80"
          >
            {/* Header */}
            <div className="p-6 pb-4 border-b border-border/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-[#189ab4] to-[#75e6da]">
                    <Bell className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Notifications</h2>
                    {unreadCount > 0 && (
                      <p className="text-sm text-muted-foreground">
                        {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
                        {urgentCount > 0 && (
                          <span className="text-red-500 font-medium ml-1">
                            ({urgentCount} urgent)
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMarkAllAsRead}
                      className="text-xs hover:bg-primary/10"
                    >
                      <CheckCheck className="h-3 w-3 mr-1" />
                      Mark all read
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="rounded-full hover:bg-accent"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 glass-card">
                  <TabsTrigger value="all" className="text-xs">
                    All
                    <Badge variant="outline" className="ml-1 text-xs">
                      {notifications.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="unread" className="text-xs">
                    Unread
                    {unreadCount > 0 && (
                      <Badge className="ml-1 text-xs bg-gradient-to-r from-[#189ab4] to-[#75e6da] text-white">
                        {unreadCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="books" className="text-xs">
                    {userRole === 'admin' || userRole === 'librarian' ? 'Books' : 'Library'}
                  </TabsTrigger>
                  <TabsTrigger value="system" className="text-xs">
                    {userRole === 'admin' || userRole === 'librarian' ? 'Admin' : 'System'}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-6 space-y-3">
                  {filteredNotifications.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#189ab4]/20 to-[#75e6da]/20 flex items-center justify-center mx-auto mb-4">
                        <Bell className="h-8 w-8 text-muted-foreground opacity-50" />
                      </div>
                      <h3 className="font-medium mb-2">No notifications</h3>
                      <p className="text-sm text-muted-foreground">
                        You're all caught up! 🎉
                      </p>
                    </motion.div>
                  ) : (
                    filteredNotifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        layout
                        initial={{ 
                          opacity: 0, 
                          x: newNotificationIds.includes(notification.id) ? -100 : 20,
                          scale: newNotificationIds.includes(notification.id) ? 1.05 : 1
                        }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 100, scale: 0.95 }}
                        transition={{ 
                          delay: index * 0.05,
                          type: "spring",
                          stiffness: 300,
                          damping: 30
                        }}
                        className={`glass-card rounded-lg border-l-4 ${getNotificationColor(notification.type, notification.priority)} 
                          cursor-pointer hover:scale-[1.02] transition-all duration-200 group
                          ${!notification.read ? 'bg-primary/5 ring-1 ring-primary/10' : ''}
                          ${newNotificationIds.includes(notification.id) ? 'ring-2 ring-green-500/50' : ''}`}
                      >
                        <div className="p-4">
                          <div className="flex gap-3">
                            {/* Avatar/Icon */}
                            <div className="flex-shrink-0 mt-1">
                              {notification.bookCover ? (
                                <div className="w-12 h-12 rounded-lg overflow-hidden ring-2 ring-border/50">
                                  <img 
                                    src={notification.bookCover} 
                                    alt="Book cover"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <Avatar className="h-12 w-12 ring-2 ring-border/50">
                                  <AvatarFallback className="bg-gradient-to-r from-[#189ab4] to-[#75e6da] text-white">
                                    {notification.avatar || getNotificationIcon(notification.type, notification.priority)}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <h4 className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                    {notification.title}
                                  </h4>
                                  {getPriorityBadge(notification.priority)}
                                </div>
                                
                                <div className="flex items-center gap-1">
                                  {!notification.read && (
                                    <motion.div 
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="w-2 h-2 bg-gradient-to-r from-[#189ab4] to-[#75e6da] rounded-full flex-shrink-0"
                                    />
                                  )}
                                  
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <MoreHorizontal className="h-3 w-3" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="glass-card border-border/50">
                                      {!notification.read ? (
                                        <DropdownMenuItem onClick={() => handleMarkAsRead(notification.id)}>
                                          <CheckCircle className="h-3 w-3 mr-2" />
                                          Mark as read
                                        </DropdownMenuItem>
                                      ) : (
                                        <DropdownMenuItem onClick={() => handleMarkAsRead(notification.id)}>
                                          <Mail className="h-3 w-3 mr-2" />
                                          Mark as unread
                                        </DropdownMenuItem>
                                      )}
                                      <DropdownMenuItem onClick={() => onNotificationAction(notification)}>
                                        <Eye className="h-3 w-3 mr-2" />
                                        View details
                                      </DropdownMenuItem>
                                      {notification.dismissible !== false && (
                                        <DropdownMenuItem 
                                          onClick={() => handleDismiss(notification.id)}
                                          className="text-red-600 dark:text-red-400"
                                        >
                                          <Trash2 className="h-3 w-3 mr-2" />
                                          Dismiss
                                        </DropdownMenuItem>
                                      )}
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                              
                              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                {notification.message}
                              </p>
                              
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">
                                  {formatTime(notification.timestamp)}
                                </span>
                                
                                {notification.actionLabel && (
                                  <Button
                                    size="sm"
                                    onClick={() => onNotificationAction(notification)}
                                    className="text-xs h-7 px-3 bg-gradient-to-r from-[#189ab4] to-[#75e6da] hover:opacity-90"
                                  >
                                    {notification.actionLabel}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border/50">
              <Button
                variant="ghost"
                className="w-full justify-center text-sm hover:bg-primary/10"
                onClick={onClose}
              >
                <Settings className="h-4 w-4 mr-2" />
                Notification Settings
              </Button>
            </div>
          </motion.div>

          {/* Mobile Panel - Slide from bottom */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 h-[85vh] glass-card border-t border-border/50 z-50 lg:hidden flex flex-col backdrop-blur-xl bg-background/90 rounded-t-2xl"
          >
            {/* Handle */}
            <div className="w-12 h-1 bg-muted-foreground/30 rounded-full mx-auto mt-3 mb-4" />
            
            {/* Header */}
            <div className="px-6 pb-4 border-b border-border/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-[#189ab4] to-[#75e6da]">
                    <Bell className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Notifications</h2>
                    {unreadCount > 0 && (
                      <p className="text-sm text-muted-foreground">
                        {unreadCount} unread
                      </p>
                    )}
                  </div>
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

              {/* Mobile Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 glass-card">
                  <TabsTrigger value="all" className="text-sm">
                    All ({notifications.length})
                  </TabsTrigger>
                  <TabsTrigger value="unread" className="text-sm">
                    Unread ({unreadCount})
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Mobile Notifications List */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-3">
                  {filteredNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`glass-card rounded-lg border-l-4 ${getNotificationColor(notification.type, notification.priority)} 
                        ${!notification.read ? 'bg-primary/5' : ''}`}
                    >
                      <div className="p-4">
                        <div className="flex gap-3">
                          <div className="flex-shrink-0">
                            {notification.bookCover ? (
                              <div className="w-10 h-10 rounded-lg overflow-hidden">
                                <img 
                                  src={notification.bookCover} 
                                  alt="Book cover"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-gradient-to-r from-[#189ab4] to-[#75e6da] text-white">
                                  {notification.avatar || getNotificationIcon(notification.type)}
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <h4 className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                              )}
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-2">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                {formatTime(notification.timestamp)}
                              </span>
                              
                              <div className="flex gap-2">
                                {!notification.read && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleMarkAsRead(notification.id)}
                                    className="text-xs h-6 px-2"
                                  >
                                    Mark Read
                                  </Button>
                                )}
                                {notification.actionLabel && (
                                  <Button
                                    size="sm"
                                    onClick={() => onNotificationAction(notification)}
                                    className="text-xs h-6 px-2 bg-gradient-to-r from-[#189ab4] to-[#75e6da] hover:opacity-90"
                                  >
                                    {notification.actionLabel}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}