import React from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Bell } from 'lucide-react';

interface NotificationBellProps {
  unreadCount: number;
  hasUrgent?: boolean;
  onClick: () => void;
  className?: string;
}

export function NotificationBell({ 
  unreadCount, 
  hasUrgent = false, 
  onClick, 
  className = '' 
}: NotificationBellProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative"
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={onClick}
        className={`relative rounded-full p-2 hover:bg-accent ${className}`}
      >
        <motion.div
          animate={hasUrgent ? { 
            rotate: [0, -15, 15, -15, 15, 0],
            transition: { 
              duration: 0.6, 
              repeat: Infinity, 
              repeatDelay: 3 
            }
          } : {}}
        >
          <Bell className="h-5 w-5" />
        </motion.div>
        
        {/* Badge for unread count */}
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute -top-1 -right-1"
          >
            <Badge 
              className={`
                min-w-[18px] h-[18px] text-xs font-medium flex items-center justify-center p-0
                ${hasUrgent 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-gradient-to-r from-[#189ab4] to-[#75e6da] text-white'
                }
              `}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          </motion.div>
        )}
        
        {/* Urgent indicator pulse */}
        {hasUrgent && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-red-500"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </Button>
    </motion.div>
  );
}