import React from 'react';
import { motion } from 'motion/react';
import { Book, User, Clock, Calendar, DollarSign, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { formatCurrency } from './ui/currency-utils';
import { Badge } from './ui/badge';

interface ActivityItem {
  id: string;
  type: 'borrow' | 'return' | 'reserve' | 'fine' | 'register';
  user: {
    name: string;
    avatar?: string;
    initials: string;
  };
  book?: {
    title: string;
    author: string;
  };
  timestamp: string;
  details?: string;
}

interface ActivityFeedProps {
  userRole: 'admin' | 'librarian' | 'user';
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ userRole }) => {
  const getActivitiesForRole = (): ActivityItem[] => {
    const baseActivities: ActivityItem[] = [
      {
        id: '1',
        type: 'borrow',
        user: { name: 'Sarah Johnson', initials: 'SJ' },
        book: { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
        timestamp: '2 minutes ago'
      },
      {
        id: '2',
        type: 'return',
        user: { name: 'Mike Chen', initials: 'MC' },
        book: { title: 'To Kill a Mockingbird', author: 'Harper Lee' },
        timestamp: '15 minutes ago'
      },
      {
        id: '3',
        type: 'reserve',
        user: { name: 'Emily Davis', initials: 'ED' },
        book: { title: '1984', author: 'George Orwell' },
        timestamp: '1 hour ago'
      },
      {
        id: '4',
        type: 'fine',
        user: { name: 'John Smith', initials: 'JS' },
        timestamp: '2 hours ago',
        details: `${formatCurrency(105)} late fee paid`
      },
      {
        id: '5',
        type: 'register',
        user: { name: 'Lisa Wang', initials: 'LW' },
        timestamp: '3 hours ago'
      }
    ];

    if (userRole === 'user') {
      return [
        {
          id: '1',
          type: 'borrow',
          user: { name: 'You', initials: 'ME' },
          book: { title: 'Dune', author: 'Frank Herbert' },
          timestamp: '1 day ago'
        },
        {
          id: '2',
          type: 'return',
          user: { name: 'You', initials: 'ME' },
          book: { title: 'The Hobbit', author: 'J.R.R. Tolkien' },
          timestamp: '3 days ago'
        },
        {
          id: '3',
          type: 'reserve',
          user: { name: 'You', initials: 'ME' },
          book: { title: 'Project Hail Mary', author: 'Andy Weir' },
          timestamp: '1 week ago'
        }
      ];
    }

    return baseActivities;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'borrow': return <Book className="h-4 w-4 text-blue-500" />;
      case 'return': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'reserve': return <Calendar className="h-4 w-4 text-yellow-500" />;
      case 'fine': return <DollarSign className="h-4 w-4 text-red-500" />;
      case 'register': return <User className="h-4 w-4 text-purple-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityText = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'borrow':
        return (
          <span>
            <span className="font-medium">{activity.user.name}</span> borrowed{' '}
            <span className="font-medium">{activity.book?.title}</span>
          </span>
        );
      case 'return':
        return (
          <span>
            <span className="font-medium">{activity.user.name}</span> returned{' '}
            <span className="font-medium">{activity.book?.title}</span>
          </span>
        );
      case 'reserve':
        return (
          <span>
            <span className="font-medium">{activity.user.name}</span> reserved{' '}
            <span className="font-medium">{activity.book?.title}</span>
          </span>
        );
      case 'fine':
        return (
          <span>
            <span className="font-medium">{activity.user.name}</span> paid a fine
            {activity.details && <span className="text-muted-foreground"> - {activity.details}</span>}
          </span>
        );
      case 'register':
        return (
          <span>
            <span className="font-medium">{activity.user.name}</span> registered as a new user
          </span>
        );
      default:
        return <span>Unknown activity</span>;
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'borrow': return 'default';
      case 'return': return 'secondary';
      case 'reserve': return 'outline';
      case 'fine': return 'destructive';
      case 'register': return 'secondary';
      default: return 'outline';
    }
  };

  const activities = getActivitiesForRole();

  return (
    <Card className="glass-card border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 dark:hover:bg-white/5 transition-colors"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.user.avatar} />
                <AvatarFallback className="text-xs bg-gradient-to-r from-[#189ab4] to-[#75e6da] text-white">
                  {activity.user.initials}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  {getActivityIcon(activity.type)}
                  <Badge variant={getBadgeVariant(activity.type) as any} className="text-xs">
                    {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                  </Badge>
                </div>
                
                <p className="text-sm">
                  {getActivityText(activity)}
                </p>
                
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {activity.timestamp}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};