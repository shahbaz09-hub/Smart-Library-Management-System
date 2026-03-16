import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home,
  Book,
  Users,
  BarChart3,
  Settings,
  BookOpen,
  UserCheck,
  DollarSign,
  TrendingUp,
  Calendar,
  Star,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: 'admin' | 'librarian' | 'user';
  currentPage?: string;
  onNavigate?: (page: 'dashboard' | 'browse' | 'admin') => void;
}

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  badge?: string;
  active?: boolean;
  onClick?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, userRole, currentPage, onNavigate }) => {
  const adminMenuItems: MenuItem[] = [
    {
      icon: <Home className="h-5 w-5" />,
      label: 'Dashboard',
      active: currentPage === 'dashboard',
      onClick: () => onNavigate?.('dashboard')
    },
    {
      icon: <Book className="h-5 w-5" />,
      label: 'Browse Books',
      active: currentPage === 'browse',
      onClick: () => onNavigate?.('browse')
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: 'Admin Panel',
      active: currentPage === 'admin',
      onClick: () => onNavigate?.('admin')
    },
    { icon: <Users className="h-5 w-5" />, label: 'Users Management' },
    { icon: <BarChart3 className="h-5 w-5" />, label: 'Analytics' },
    { icon: <DollarSign className="h-5 w-5" />, label: 'Fines Management', badge: '12' },
    { icon: <TrendingUp className="h-5 w-5" />, label: 'Reports' },
    { icon: <Settings className="h-5 w-5" />, label: 'Settings' },
  ];

  const librarianMenuItems: MenuItem[] = [
    {
      icon: <Home className="h-5 w-5" />,
      label: 'Dashboard',
      active: currentPage === 'dashboard',
      onClick: () => onNavigate?.('dashboard')
    },
    {
      icon: <Book className="h-5 w-5" />,
      label: 'Browse Books',
      active: currentPage === 'browse',
      onClick: () => onNavigate?.('browse')
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: 'Admin Panel',
      active: currentPage === 'admin',
      onClick: () => onNavigate?.('admin')
    },
    { icon: <UserCheck className="h-5 w-5" />, label: 'Check In/Out' },
    { icon: <Calendar className="h-5 w-5" />, label: 'Reservations', badge: '5' },
    {
      icon: <DollarSign className="h-5 w-5" />,
      label: 'Fine Management',
      active: currentPage === 'fines',
      onClick: () => onNavigate?.('fines'),
      badge: '3'
    },
    { icon: <BarChart3 className="h-5 w-5" />, label: 'Reports' },
  ];

  const userMenuItems: MenuItem[] = [
    {
      icon: <Home className="h-5 w-5" />,
      label: 'Dashboard',
      active: currentPage === 'dashboard',
      onClick: () => onNavigate?.('dashboard')
    },
    {
      icon: <Book className="h-5 w-5" />,
      label: 'Browse Books',
      active: currentPage === 'browse',
      onClick: () => onNavigate?.('browse')
    },
    { icon: <BookOpen className="h-5 w-5" />, label: 'My Books' },
    { icon: <Star className="h-5 w-5" />, label: 'Recommendations' },
    { icon: <Calendar className="h-5 w-5" />, label: 'Reservations' },
    { icon: <DollarSign className="h-5 w-5" />, label: 'Fines', badge: '1' },
    { icon: <Settings className="h-5 w-5" />, label: 'Profile' },
  ];

  const getMenuItems = () => {
    switch (userRole) {
      case 'admin': return adminMenuItems;
      case 'librarian': return librarianMenuItems;
      default: return userMenuItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="fixed left-0 top-0 bottom-0 w-72 glass-card border-r z-50 lg:translate-x-0 lg:static lg:z-auto"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-[#189ab4] to-[#75e6da]">
                    <Book className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-semibold capitalize">{userRole} Panel</h2>
                    <p className="text-sm text-muted-foreground">Welcome back!</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="lg:hidden"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Menu Items */}
              <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Button
                      variant={item.active ? "default" : "ghost"}
                      onClick={item.onClick}
                      className={`w-full justify-start gap-3 h-12 ${item.active
                          ? 'bg-gradient-to-r from-[#189ab4] to-[#75e6da] text-white brutal-shadow'
                          : 'hover:bg-white/10 dark:hover:bg-white/5'
                        }`}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {item.icon}
                      </motion.div>
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <Badge
                            variant="secondary"
                            className="bg-gradient-to-r from-[#189ab4] to-[#75e6da] text-white"
                          >
                            {item.badge}
                          </Badge>
                        </motion.div>
                      )}
                    </Button>
                  </motion.div>
                ))}
              </nav>

              {/* Footer */}
              <div className="p-4 border-t border-border/50">
                <div className="glass-card p-4 rounded-lg">
                  <h4 className="font-medium mb-2">📚 Reading Goal</h4>
                  <div className="w-full bg-muted rounded-full h-2 mb-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '75%' }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="bg-gradient-to-r from-[#189ab4] to-[#75e6da] h-2 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    15 of 20 books this year
                  </p>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};