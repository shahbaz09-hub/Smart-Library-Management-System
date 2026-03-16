import React from 'react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface AnalyticsChartsProps {
  userRole: 'admin' | 'librarian' | 'user';
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ userRole }) => {
  const borrowingData = [
    { month: 'Jan', borrowed: 320, returned: 280 },
    { month: 'Feb', borrowed: 450, returned: 400 },
    { month: 'Mar', borrowed: 380, returned: 420 },
    { month: 'Apr', borrowed: 520, returned: 380 },
    { month: 'May', borrowed: 690, returned: 540 },
    { month: 'Jun', borrowed: 750, returned: 720 },
  ];

  const genreData = [
    { name: 'Fiction', value: 35, color: '#189ab4' },
    { name: 'Science', value: 25, color: '#75e6da' },
    { name: 'History', value: 20, color: '#05445e' },
    { name: 'Biography', value: 12, color: '#d4f1f4' },
    { name: 'Other', value: 8, color: '#189ab4' },
  ];

  const userReadingData = [
    { week: 'Week 1', pages: 45 },
    { week: 'Week 2', pages: 120 },
    { week: 'Week 3', pages: 85 },
    { week: 'Week 4', pages: 200 },
    { week: 'Week 5', pages: 150 },
    { week: 'Week 6', pages: 180 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border-none">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (userRole === 'user') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid gap-6 md:grid-cols-2"
      >
        <Card className="glass-card border-none">
          <CardHeader>
            <CardTitle>Reading Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userReadingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(117, 230, 218, 0.2)" />
                <XAxis dataKey="week" stroke="#75e6da" />
                <YAxis stroke="#75e6da" />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="pages"
                  stroke="#189ab4"
                  strokeWidth={3}
                  dot={{ fill: '#75e6da', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card border-none">
          <CardHeader>
            <CardTitle>Reading Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={genreData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {genreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-2 mt-4">
              {genreData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-card border-none">
        <CardHeader>
          <CardTitle>Library Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="borrowing" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="borrowing">Borrowing Trends</TabsTrigger>
              <TabsTrigger value="genres">Popular Genres</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="borrowing" className="mt-6">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={borrowingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(117, 230, 218, 0.2)" />
                  <XAxis dataKey="month" stroke="#75e6da" />
                  <YAxis stroke="#75e6da" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="borrowed" fill="#189ab4" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="returned" fill="#75e6da" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="genres" className="mt-6">
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={genreData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {genreData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="space-y-4">
                  {genreData.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg glass"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{item.value}%</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="overview" className="mt-6">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={borrowingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(117, 230, 218, 0.2)" />
                  <XAxis dataKey="month" stroke="#75e6da" />
                  <YAxis stroke="#75e6da" />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="borrowed"
                    stroke="#189ab4"
                    strokeWidth={3}
                    dot={{ fill: '#189ab4', strokeWidth: 2, r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="returned"
                    stroke="#75e6da"
                    strokeWidth={3}
                    dot={{ fill: '#75e6da', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};