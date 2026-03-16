import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { formatCurrency, formatCurrencyShort } from './ui/currency-utils';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
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
  ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart as PieChartIcon,
  Calendar,
  Users,
  BookOpen,
  DollarSign,
  Download,
  Filter
} from 'lucide-react';

// Mock data for charts
const monthlyData = [
  { month: 'Jan', borrowedBooks: 245, newUsers: 45, revenue: 1850, fines: 325 },
  { month: 'Feb', borrowedBooks: 289, newUsers: 52, revenue: 2100, fines: 280 },
  { month: 'Mar', borrowedBooks: 312, newUsers: 38, revenue: 2250, fines: 195 },
  { month: 'Apr', borrowedBooks: 398, newUsers: 67, revenue: 2890, fines: 410 },
  { month: 'May', borrowedBooks: 456, newUsers: 74, revenue: 3200, fines: 380 },
  { month: 'Jun', borrowedBooks: 523, newUsers: 89, revenue: 3650, fines: 295 }
];

const genreData = [
  { name: 'Fiction', value: 35, color: '#189ab4' },
  { name: 'Science', value: 18, color: '#75e6da' },
  { name: 'History', value: 15, color: '#05445e' },
  { name: 'Technology', value: 12, color: '#d4f1f4' },
  { name: 'Romance', value: 10, color: '#189ab4' },
  { name: 'Other', value: 10, color: '#75e6da' }
];

const dailyActivity = [
  { time: '09:00', checkouts: 12, returns: 8 },
  { time: '10:00', checkouts: 25, returns: 15 },
  { time: '11:00', checkouts: 34, returns: 22 },
  { time: '12:00', checkouts: 45, returns: 35 },
  { time: '13:00', checkouts: 38, returns: 28 },
  { time: '14:00', checkouts: 52, returns: 42 },
  { time: '15:00', checkouts: 67, returns: 48 },
  { time: '16:00', checkouts: 58, returns: 52 },
  { time: '17:00', checkouts: 43, returns: 39 },
  { time: '18:00', checkouts: 28, returns: 25 }
];

const membershipData = [
  { type: 'Standard', active: 1240, inactive: 156, color: '#189ab4' },
  { type: 'Premium', active: 340, inactive: 45, color: '#75e6da' },
  { type: 'Student', active: 890, inactive: 123, color: '#05445e' },
  { type: 'Faculty', active: 180, inactive: 22, color: '#d4f1f4' }
];

const topBooks = [
  { title: 'The Great Classic', borrowCount: 45, rating: 4.8 },
  { title: 'Modern Design Principles', borrowCount: 38, rating: 4.6 },
  { title: 'Science Fiction Adventure', borrowCount: 35, rating: 4.7 },
  { title: 'Mystery Novel', borrowCount: 32, rating: 4.5 },
  { title: 'Romance in Paris', borrowCount: 28, rating: 4.4 }
];

export function AdminAnalyticsCharts() {
  const [timeRange, setTimeRange] = useState('6months');
  const [chartType, setChartType] = useState('overview');
  const [animationKey, setAnimationKey] = useState(0);

  // Trigger animation when chart type changes
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [chartType, timeRange]);

  const StatCard = ({ title, value, change, changeType, icon: Icon, color }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 rounded-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm text-muted-foreground">{title}</h3>
        <div className={`p-2 rounded-lg bg-gradient-to-r ${color}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-2xl font-bold">{value}</p>
        <div className={`flex items-center gap-1 text-sm ${
          changeType === 'positive' ? 'text-green-600' : 'text-red-600'
        }`}>
          {changeType === 'positive' ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          {change}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Comprehensive insights into library operations</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40 glass-card border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass-card border-border/50">
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="border-primary/20">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Checkouts"
          value="2,847"
          change="+12.5%"
          changeType="positive"
          icon={BookOpen}
          color="from-[#189ab4] to-[#75e6da]"
        />
        <StatCard
          title="Active Members"
          value="1,256"
          change="+8.2%"
          changeType="positive"
          icon={Users}
          color="from-[#75e6da] to-[#d4f1f4]"
        />
        <StatCard
          title="Revenue"
          value={formatCurrencyShort(328440)}
          change="+15.3%"
          changeType="positive"
          icon={DollarSign}
          color="from-emerald-400 to-emerald-600"
        />
        <StatCard
          title="Overdue Books"
          value="84"
          change="-5.8%"
          changeType="positive"
          icon={Calendar}
          color="from-orange-400 to-orange-600"
        />
      </div>

      {/* Chart Type Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-2 flex-wrap"
      >
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'genres', label: 'Genres', icon: PieChartIcon },
          { id: 'activity', label: 'Daily Activity', icon: TrendingUp },
          { id: 'membership', label: 'Membership', icon: Users }
        ].map((type) => (
          <Button
            key={type.id}
            variant={chartType === type.id ? 'default' : 'outline'}
            onClick={() => setChartType(type.id)}
            className={`${
              chartType === type.id 
                ? 'bg-gradient-to-r from-[#189ab4] to-[#75e6da] text-white' 
                : 'border-primary/20 hover:bg-primary/10'
            }`}
          >
            <type.icon className="h-4 w-4 mr-2" />
            {type.label}
          </Button>
        ))}
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {chartType === 'overview' && (
          <>
            {/* Monthly Trends */}
            <motion.div
              key={`overview-1-${animationKey}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="glass-card border-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Monthly Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(24, 154, 180, 0.1)" />
                      <XAxis dataKey="month" stroke="currentColor" />
                      <YAxis stroke="currentColor" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                          backdropFilter: 'blur(16px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="borrowedBooks" 
                        stroke="#189ab4" 
                        strokeWidth={3}
                        name="Borrowed Books"
                        dot={{ fill: '#189ab4', strokeWidth: 2, r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="newUsers" 
                        stroke="#75e6da" 
                        strokeWidth={3}
                        name="New Users"
                        dot={{ fill: '#75e6da', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Revenue vs Fines */}
            <motion.div
              key={`overview-2-${animationKey}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="glass-card border-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Revenue vs Fines
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(24, 154, 180, 0.1)" />
                      <XAxis dataKey="month" stroke="currentColor" />
                      <YAxis stroke="currentColor" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                          backdropFilter: 'blur(16px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stackId="1"
                        stroke="#189ab4" 
                        fill="rgba(24, 154, 180, 0.6)"
                        name="Revenue ($)"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="fines" 
                        stackId="2"
                        stroke="#ef4444" 
                        fill="rgba(239, 68, 68, 0.6)"
                        name="Fines ($)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}

        {chartType === 'genres' && (
          <>
            {/* Genre Distribution */}
            <motion.div
              key={`genres-1-${animationKey}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="glass-card border-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-primary" />
                    Book Genre Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={genreData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {genreData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Top Books */}
            <motion.div
              key={`genres-2-${animationKey}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="glass-card border-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Most Popular Books
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topBooks.map((book, index) => (
                      <motion.div
                        key={book.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-center justify-between p-3 rounded-lg glass-card"
                      >
                        <div>
                          <p className="font-medium">{book.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{book.borrowCount} borrows</Badge>
                            <Badge className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-300">
                              ⭐ {book.rating}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">#{index + 1}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}

        {chartType === 'activity' && (
          <>
            {/* Daily Activity */}
            <motion.div
              key={`activity-1-${animationKey}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2"
            >
              <Card className="glass-card border-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Daily Activity Pattern
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={dailyActivity}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(24, 154, 180, 0.1)" />
                      <XAxis dataKey="time" stroke="currentColor" />
                      <YAxis stroke="currentColor" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                          backdropFilter: 'blur(16px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                      <Bar 
                        dataKey="checkouts" 
                        fill="#189ab4" 
                        name="Checkouts"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar 
                        dataKey="returns" 
                        fill="#75e6da" 
                        name="Returns"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}

        {chartType === 'membership' && (
          <>
            {/* Membership Status */}
            <motion.div
              key={`membership-1-${animationKey}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2"
            >
              <Card className="glass-card border-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Membership Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={membershipData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(24, 154, 180, 0.1)" />
                      <XAxis type="number" stroke="currentColor" />
                      <YAxis dataKey="type" type="category" stroke="currentColor" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                          backdropFilter: 'blur(16px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                      <Bar 
                        dataKey="active" 
                        stackId="a"
                        fill="#189ab4" 
                        name="Active Members"
                        radius={[0, 4, 4, 0]}
                      />
                      <Bar 
                        dataKey="inactive" 
                        stackId="a"
                        fill="#ef4444" 
                        name="Inactive Members"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}