import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { formatCurrency, formatCurrencyShort } from './ui/currency-utils';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3
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

interface FineAnalyticsChartsProps {
  fines: Fine[];
}

export function FineAnalyticsCharts({ fines }: FineAnalyticsChartsProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Generate mock monthly data for trends
  const monthlyData = [
    { month: 'Jan', collected: 2400, pending: 1200, overdue: 800 },
    { month: 'Feb', collected: 1800, pending: 1500, overdue: 600 },
    { month: 'Mar', collected: 3200, pending: 1800, overdue: 900 },
    { month: 'Apr', collected: 2800, pending: 1400, overdue: 700 },
    { month: 'May', collected: 3600, pending: 2000, overdue: 1100 },
    { month: 'Jun', collected: 4200, pending: 1600, overdue: 850 },
    { month: 'Jul', collected: 3800, pending: 1900, overdue: 950 },
    { month: 'Aug', collected: 4500, pending: 2200, overdue: 1200 },
    { month: 'Sep', collected: 3900, pending: 1700, overdue: 800 },
    { month: 'Oct', collected: 4800, pending: 2400, overdue: 1000 },
    { month: 'Nov', collected: 5200, pending: 2100, overdue: 750 },
    { month: 'Dec', collected: 4900, pending: 1800, overdue: 650 }
  ];

  // Status distribution data
  const statusData = [
    { name: 'Paid', value: fines.filter(f => f.status === 'paid').length, color: '#10b981' },
    { name: 'Pending', value: fines.filter(f => f.status === 'pending').length, color: '#f59e0b' },
    { name: 'Overdue', value: fines.filter(f => f.status === 'overdue').length, color: '#ef4444' },
    { name: 'Waived', value: fines.filter(f => f.status === 'waived').length, color: '#6b7280' }
  ];

  // Daily collection data (last 14 days)
  const dailyCollectionData = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (13 - i));
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      amount: Math.floor(Math.random() * 500) + 100,
      fines: Math.floor(Math.random() * 10) + 2
    };
  });

  // User fine distribution (top 10 users with most fines)
  const userFineData = fines.reduce((acc, fine) => {
    if (!acc[fine.userName]) {
      acc[fine.userName] = { name: fine.userName, amount: 0, count: 0 };
    }
    acc[fine.userName].amount += fine.amount;
    acc[fine.userName].count += 1;
    return acc;
  }, {} as Record<string, { name: string; amount: number; count: number }>);

  const topUsers = Object.values(userFineData)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card border-border/50 p-3 shadow-lg">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.dataKey}: ${entry.value?.toFixed(2) || entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Time Range Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <span className="font-medium">Time Range:</span>
        <div className="flex gap-2">
          {[
            { value: '7d', label: '7 Days' },
            { value: '30d', label: '30 Days' },
            { value: '90d', label: '90 Days' },
            { value: '1y', label: '1 Year' }
          ].map((range) => (
            <Button
              key={range.value}
              variant={timeRange === range.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range.value as any)}
              className={timeRange === range.value ? 'bg-gradient-to-r from-[#189ab4] to-[#75e6da]' : ''}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Collection Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card border-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Monthly Collection Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(117, 230, 218, 0.1)" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="collected"
                    stackId="1"
                    stroke="#10b981"
                    fill="rgba(16, 185, 129, 0.3)"
                    name="Collected"
                  />
                  <Area
                    type="monotone"
                    dataKey="pending"
                    stackId="1"
                    stroke="#f59e0b"
                    fill="rgba(245, 158, 11, 0.3)"
                    name="Pending"
                  />
                  <Area
                    type="monotone"
                    dataKey="overdue"
                    stackId="1"
                    stroke="#ef4444"
                    fill="rgba(239, 68, 68, 0.3)"
                    name="Overdue"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card border-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Fine Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any, name: string) => [value, name]}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid rgba(117, 230, 218, 0.2)',
                      borderRadius: '8px',
                      backdropFilter: 'blur(16px)'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Daily Collection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-card border-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Daily Collections (Last 14 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyCollectionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(117, 230, 218, 0.1)" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#189ab4"
                    strokeWidth={3}
                    dot={{ fill: '#189ab4', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#75e6da' }}
                    name="Amount ($)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Users with Fines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-card border-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Top Users by Fine Amount
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topUsers} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(117, 230, 218, 0.1)" />
                  <XAxis type="number" stroke="#6b7280" />
                  <YAxis dataKey="name" type="category" stroke="#6b7280" width={80} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="amount"
                    fill="url(#barGradient)"
                    radius={[0, 4, 4, 0]}
                    name="Amount ($)"
                  />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#189ab4" />
                      <stop offset="100%" stopColor="#75e6da" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          {
            title: 'Collection Rate',
            value: '78%',
            subtitle: 'This month',
            icon: CheckCircle,
            color: 'from-green-400 to-emerald-600',
            trend: '+5%'
          },
          {
            title: 'Average Fine',
            value: formatCurrency(262.50),
            subtitle: 'Per incident',
            icon: DollarSign,
            color: 'from-[#189ab4] to-[#75e6da]',
            trend: `+${formatCurrency(48.30)}`
          },
          {
            title: 'Response Time',
            value: '3.2 days',
            subtitle: 'Avg payment time',
            icon: Clock,
            color: 'from-yellow-400 to-orange-500',
            trend: '-0.8 days'
          },
          {
            title: 'Outstanding',
            value: formatCurrencyShort(26145),
            subtitle: 'Total pending',
            icon: AlertTriangle,
            color: 'from-red-400 to-red-600',
            trend: `-${formatCurrency(3150)}`
          }
        ].map((stat, index) => (
          <Card key={stat.title} className="glass-card border-none hover:scale-105 transition-transform duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
                </div>
                <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-green-500">{stat.trend}</span>
                <span className="text-xs text-muted-foreground ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Insights & Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="glass-card border-none">
          <CardHeader>
            <CardTitle>Insights & Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-1">
                      Collection Rate Improved
                    </h4>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      Fine collection rate has increased by 5% this month. The automated reminder system is working effectively.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-700 dark:text-yellow-300 mb-1">
                      Peak Fine Days
                    </h4>
                    <p className="text-sm text-yellow-600 dark:text-yellow-400">
                      Mondays and Fridays show highest fine generation. Consider adjusting reminder schedules.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-700 dark:text-green-300 mb-1">
                      Discount Program Success
                    </h4>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Early payment discounts have reduced average collection time by 40%.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-purple-700 dark:text-purple-300 mb-1">
                      User Education Needed
                    </h4>
                    <p className="text-sm text-purple-600 dark:text-purple-400">
                      5 users account for 60% of all fines. Consider targeted outreach programs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}