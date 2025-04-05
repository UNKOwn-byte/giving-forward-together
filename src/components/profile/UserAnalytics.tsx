
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { BarChart3, PieChart as PieChartIcon } from 'lucide-react';

interface UserAnalyticsProps {
  userId: string;
}

const UserAnalytics: React.FC<UserAnalyticsProps> = ({ userId }) => {
  const [period, setPeriod] = useState<string>('month');

  // This would come from an API in a real app
  const donationData = [
    { month: 'Jan', amount: 50 },
    { month: 'Feb', amount: 75 },
    { month: 'Mar', amount: 25 },
    { month: 'Apr', amount: 100 },
    { month: 'May', amount: 50 },
    { month: 'Jun', amount: 125 },
  ];
  
  const categoryData = [
    { name: 'Education', value: 400 },
    { name: 'Environment', value: 300 },
    { name: 'Medical', value: 200 },
    { name: 'Animal Welfare', value: 100 },
  ];
  
  const impactData = [
    { metric: 'Campaigns Supported', value: 12 },
    { metric: 'Total Donated', value: '$425' },
    { metric: 'Lives Impacted', value: '~1,200' },
    { metric: 'Support Streak', value: '6 months' },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  const fadeInVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100 
      }
    }
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Donation Analytics</CardTitle>
                <CardDescription>
                  Track your donation history and impact
                </CardDescription>
              </div>
              <Tabs defaultValue={period} onValueChange={setPeriod}>
                <TabsList>
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="quarter">Quarter</TabsTrigger>
                  <TabsTrigger value="year">Year</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <motion.div 
              key={period} // Causes re-render animation when period changes
              initial="hidden"
              animate="visible"
              variants={fadeInVariants}
              className="w-full h-64"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={donationData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value) => [`$${value}`, 'Amount']}
                  />
                  <Legend />
                  <Bar 
                    dataKey="amount" 
                    name="Donation Amount" 
                    fill="#8884d8" 
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChartIcon className="h-5 w-5" />
                <span>Categories Supported</span>
              </CardTitle>
              <CardDescription>
                Distribution of your donations by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      animationDuration={1500}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`$${value}`, 'Amount']}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Your Impact</span>
              </CardTitle>
              <CardDescription>
                The difference your contributions have made
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {impactData.map((item, index) => (
                  <motion.div
                    key={item.metric}
                    variants={itemVariants}
                    className={cn(
                      "p-4 rounded-xl flex flex-col items-center justify-center text-center",
                      index === 0 ? "bg-blue-50 text-blue-700" : "",
                      index === 1 ? "bg-green-50 text-green-700" : "",
                      index === 2 ? "bg-amber-50 text-amber-700" : "",
                      index === 3 ? "bg-purple-50 text-purple-700" : ""
                    )}
                  >
                    <div className="text-2xl font-bold mb-1">{item.value}</div>
                    <div className="text-xs">{item.metric}</div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UserAnalytics;
