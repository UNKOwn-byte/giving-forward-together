
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Heart, Gift, Target, Star, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress?: number;
  color: string;
}

interface UserAchievementsProps {
  userId: string;
}

const UserAchievements: React.FC<UserAchievementsProps> = ({ userId }) => {
  // This would come from an API in a real app
  const badges: Badge[] = [
    {
      id: '1',
      name: 'First Donation',
      description: 'Made your first donation',
      icon: <Gift />,
      unlocked: true,
      color: 'bg-green-100 text-green-700 border-green-200'
    },
    {
      id: '2',
      name: 'Generous Donor',
      description: 'Donated to 5 campaigns',
      icon: <Heart />,
      unlocked: true,
      color: 'bg-red-100 text-red-700 border-red-200'
    },
    {
      id: '3',
      name: 'Campaign Creator',
      description: 'Created your first campaign',
      icon: <Target />,
      unlocked: true,
      color: 'bg-blue-100 text-blue-700 border-blue-200'
    },
    {
      id: '4',
      name: 'Goal Achiever',
      description: 'Reached a campaign goal',
      icon: <Trophy />,
      unlocked: false,
      progress: 75,
      color: 'bg-yellow-100 text-yellow-700 border-yellow-200'
    },
    {
      id: '5',
      name: 'Super Supporter',
      description: 'Donated to 10 campaigns',
      icon: <Star />,
      unlocked: false,
      progress: 40,
      color: 'bg-purple-100 text-purple-700 border-purple-200'
    }
  ];

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
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
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
          <Award className="h-5 w-5" />
          <span>Achievements</span>
        </CardTitle>
        <CardDescription>
          Your earned badges and achievements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 gap-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {badges.map((badge) => (
            <motion.div
              key={badge.id}
              variants={itemVariants}
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-lg border text-center",
                badge.unlocked ? badge.color : "bg-gray-100 text-gray-500 border-gray-200 opacity-60"
              )}
            >
              <div className="h-10 w-10 flex items-center justify-center mb-2">
                {badge.icon}
              </div>
              <h3 className="font-medium text-sm">{badge.name}</h3>
              <p className="text-xs mt-1">{badge.description}</p>
              
              {badge.progress !== undefined && !badge.unlocked && (
                <div className="w-full mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-gray-500 h-1.5 rounded-full"
                      style={{ width: `${badge.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs mt-1">{badge.progress}%</p>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default UserAchievements;
