import React from 'react';
import { motion } from 'motion/react';
import { Book, Users, DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { formatCurrency, formatCurrencyShort } from './ui/currency-utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  index: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeType, icon, index }) => {
  const getChangeColor = (type: string) => {
    switch (type) {
      case 'positive': return 'text-green-500';
      case 'negative': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className="glass-card border-none brutal-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="p-2 rounded-lg bg-gradient-to-r from-[#189ab4] to-[#75e6da]"
          >
            {React.cloneElement(icon as React.ReactElement, { 
              className: "h-4 w-4 text-white" 
            })}
          </motion.div>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
            className="text-2xl font-bold"
          >
            {typeof value === 'number' ? (
              <motion.span
                initial={{ textContent: "0" }}
                animate={{ textContent: value.toString() }}
                transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
              />
            ) : value}
          </motion.div>
          <p className={`text-xs ${getChangeColor(changeType)} flex items-center gap-1 mt-1`}>
            <TrendingUp className={`h-3 w-3 ${
              changeType === 'negative' ? 'rotate-180' : ''
            }`} />
            {change}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface DashboardStatsProps {
  userRole: 'admin' | 'librarian' | 'user';
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ userRole }) => {
  const getStatsForRole = () => {
    switch (userRole) {
      case 'admin':
        return [
          {
            title: 'Total Books',
            value: 15420,
            change: '+12% from last month',
            changeType: 'positive' as const,
            icon: <Book />
          },
          {
            title: 'Active Users',
            value: 2847,
            change: '+8% from last month',
            changeType: 'positive' as const,
            icon: <Users />
          },
          {
            title: 'Pending Fines',
            value: formatCurrencyShort(26145),
            change: '-5% from last month',
            changeType: 'positive' as const,
            icon: <DollarSign />
          },
          {
            title: 'Books Borrowed Today',
            value: 234,
            change: '+15% from yesterday',
            changeType: 'positive' as const,
            icon: <TrendingUp />
          }
        ];
      
      case 'librarian':
        return [
          {
            title: 'Books to Check In',
            value: 28,
            change: '5 overdue',
            changeType: 'negative' as const,
            icon: <Clock />
          },
          {
            title: 'Books Checked Out Today',
            value: 45,
            change: '+3 from yesterday',
            changeType: 'positive' as const,
            icon: <Book />
          },
          {
            title: 'New Reservations',
            value: 12,
            change: '2 urgent',
            changeType: 'neutral' as const,
            icon: <Users />
          },
          {
            title: 'Fines Collected',
            value: formatCurrency(3045),
            change: 'Today',
            changeType: 'positive' as const,
            icon: <DollarSign />
          }
        ];
      
      default: // user
        return [
          {
            title: 'Books Borrowed',
            value: 3,
            change: '2 due this week',
            changeType: 'neutral' as const,
            icon: <Book />
          },
          {
            title: 'Books Read This Year',
            value: 15,
            change: '5 more than last year',
            changeType: 'positive' as const,
            icon: <CheckCircle />
          },
          {
            title: 'Pending Fines',
            value: formatCurrency(252),
            change: '1 overdue book',
            changeType: 'negative' as const,
            icon: <DollarSign />
          },
          {
            title: 'Reading Streak',
            value: '24 days',
            change: 'Personal best!',
            changeType: 'positive' as const,
            icon: <TrendingUp />
          }
        ];
    }
  };

  const stats = getStatsForRole();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          changeType={stat.changeType}
          icon={stat.icon}
          index={index}
        />
      ))}
    </div>
  );
};