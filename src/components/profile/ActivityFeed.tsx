
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Heart, MessageSquare, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ActivityItem {
  id: string;
  type: 'donation' | 'comment' | 'like';
  title: string;
  description: string;
  timestamp: string;
  campaignId?: string;
  campaignTitle?: string;
}

interface ActivityFeedProps {
  userId: string;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  
  // This would come from an API in a real app
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'donation',
      title: 'You donated $50',
      description: 'You made a donation to "Help Build a School"',
      timestamp: '3 hours ago',
      campaignId: '123',
      campaignTitle: 'Help Build a School'
    },
    {
      id: '2',
      type: 'comment',
      title: 'You left a comment',
      description: '"This is an amazing initiative, I\'m happy to support!"',
      timestamp: '1 day ago',
      campaignId: '456',
      campaignTitle: 'Clean Water Project'
    },
    {
      id: '3',
      type: 'like',
      title: 'You liked a campaign',
      description: 'You showed support for "Animal Shelter Renovation"',
      timestamp: '2 days ago',
      campaignId: '789',
      campaignTitle: 'Animal Shelter Renovation'
    },
    {
      id: '4',
      type: 'donation',
      title: 'You donated $25',
      description: 'You made a donation to "Food for Families"',
      timestamp: '1 week ago',
      campaignId: '101',
      campaignTitle: 'Food for Families'
    },
    {
      id: '5',
      type: 'like',
      title: 'You liked a campaign',
      description: 'You showed support for "Ocean Cleanup Initiative"',
      timestamp: '1 week ago',
      campaignId: '202',
      campaignTitle: 'Ocean Cleanup Initiative'
    }
  ];
  
  const filteredActivities = activeTab === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === activeTab);
    
  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'donation': 
        return <DollarSign size={16} className="text-green-500" />;
      case 'comment': 
        return <MessageSquare size={16} className="text-blue-500" />;
      case 'like': 
        return <Heart size={16} className="text-red-500" />;
      default:
        return <Activity size={16} />;
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5" />
          <span>Activity Feed</span>
        </CardTitle>
        <CardDescription>
          See your recent activity on the platform
        </CardDescription>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full mt-2">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="donation">Donations</TabsTrigger>
            <TabsTrigger value="comment">Comments</TabsTrigger>
            <TabsTrigger value="like">Likes</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      
      <CardContent>
        <motion.div 
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => (
              <motion.div 
                key={activity.id}
                variants={itemVariants}
                className={cn(
                  "flex items-start p-3 rounded-lg transition-all border",
                  "hover:bg-muted/50"
                )}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.timestamp}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No activities to display.</p>
            </div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
