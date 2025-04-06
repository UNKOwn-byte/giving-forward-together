
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { User, Save, X, Check, Bell, Activity, Award, ChevronRight, BarChart3, Settings, Shield, Key, Smartphone, Mail, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProfilePictureUploader from '../components/profile/ProfilePictureUploader';
import ActivityFeed from '../components/profile/ActivityFeed';
import UserAchievements from '../components/profile/UserAchievements';
import UserAnalytics from '../components/profile/UserAnalytics';
import { Switch } from "@/components/ui/switch";
import { motion } from 'framer-motion';
import TwoFactorAuth from '../components/profile/TwoFactorAuth';
import ConnectedAccounts from '../components/profile/ConnectedAccounts';
import EmailSubscriptions from '../components/profile/EmailSubscriptions';

const DEFAULT_AVATAR = '/placeholder.svg';

const Profile: React.FC = () => {
  const { user, isAuthenticated, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('account');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || DEFAULT_AVATAR,
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    donationAlerts: true,
    campaignUpdates: true,
    marketingEmails: false,
    commentReplies: true,
    newFollowers: false,
    campaignMilestones: true,
    systemUpdates: true,
  });

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        name: profileData.name,
        email: profileData.email,
        avatar: profileData.avatar
      });

      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
        variant: "default",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile.",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    // Reset form data to original user data
    setProfileData({
      name: user.name,
      email: user.email,
      avatar: user.avatar || DEFAULT_AVATAR,
    });
    setIsEditing(false);
  };

  const handleAvatarChange = (newAvatarUrl: string | null) => {
    // If null is passed, set to default avatar
    const avatarToUse = newAvatarUrl || DEFAULT_AVATAR;
    
    setProfileData({
      ...profileData,
      avatar: avatarToUse,
    });
    
    // Immediately update the profile with the new avatar
    updateProfile({
      avatar: avatarToUse
    });
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

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const toggleNotificationSetting = (setting: string) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting as keyof typeof notificationSettings]
    });
  };

  const userLevel = 3; // This would come from user data in a real app
  const progress = 65; // This would be calculated based on user activity

  return (
    <Layout>
      <motion.div 
        className="container mx-auto px-4 py-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1 
          className="text-3xl font-bold mb-6"
          variants={itemVariants}
        >
          My Profile
        </motion.h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div 
            className="md:col-span-1"
            variants={itemVariants}
          >
            <Card className="overflow-hidden border-t-4 border-t-primary">
              <CardHeader className="pb-0 flex flex-col items-center">
                <ProfilePictureUploader
                  currentAvatar={profileData.avatar}
                  name={profileData.name}
                  onAvatarChange={handleAvatarChange}
                />
                <CardTitle className="mt-4 text-center">{profileData.name}</CardTitle>
                <CardDescription className="text-center">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 text-center">
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">{profileData.email}</p>
                  <div className="flex items-center justify-center mt-2">
                    <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                      Level {userLevel}
                    </span>
                  </div>
                </div>
                
                <div className="w-full bg-muted rounded-full h-2.5 mb-4">
                  <div className="bg-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-xs text-muted-foreground mb-4">{progress}% to Level {userLevel + 1}</p>
                
                <div className="flex justify-center">
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={handleCancelEdit} size="sm">
                        <X className="mr-1 h-4 w-4" />
                        Cancel
                      </Button>
                      <Button onClick={handleSaveProfile} size="sm">
                        <Save className="mr-1 h-4 w-4" />
                        Save
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <motion.div 
              variants={itemVariants}
              className="mt-6"
            >
              <UserAchievements userId={user.id} />
            </motion.div>
          </motion.div>
          
          {/* Profile Details */}
          <motion.div 
            className="md:col-span-2"
            variants={itemVariants}
          >
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="mb-6 grid grid-cols-3 md:grid-cols-6">
                <TabsTrigger value="account" className="flex items-center gap-2">
                  <User size={16} />
                  <span className="hidden md:inline">Account</span>
                </TabsTrigger>
                <TabsTrigger value="activity" className="flex items-center gap-2">
                  <Activity size={16} />
                  <span className="hidden md:inline">Activity</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <BarChart3 size={16} />
                  <span className="hidden md:inline">Analytics</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell size={16} />
                  <span className="hidden md:inline">Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <Shield size={16} />
                  <span className="hidden md:inline">Security</span>
                </TabsTrigger>
                <TabsTrigger value="subscriptions" className="flex items-center gap-2">
                  <Mail size={16} />
                  <span className="hidden md:inline">Subscriptions</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="account">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Information</CardTitle>
                      <CardDescription>
                        Update your account information here.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={profileData.name}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="transition-all duration-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={profileData.email}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="transition-all duration-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Input
                          id="role"
                          value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          disabled
                          className="transition-all duration-300"
                        />
                      </div>
                    </CardContent>
                    {isEditing && (
                      <CardFooter className="justify-end space-x-2">
                        <Button variant="outline" onClick={handleCancelEdit}>
                          <X className="mr-1 h-4 w-4" />
                          Cancel
                        </Button>
                        <Button onClick={handleSaveProfile}>
                          <Save className="mr-1 h-4 w-4" />
                          Save Changes
                        </Button>
                      </CardFooter>
                    )}
                  </Card>

                  <div className="mt-6">
                    <ConnectedAccounts />
                  </div>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="activity">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ActivityFeed userId={user.id} />
                </motion.div>
              </TabsContent>
              
              <TabsContent value="analytics">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <UserAnalytics userId={user.id} />
                </motion.div>
              </TabsContent>
              
              <TabsContent value="notifications">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Notification Preferences</CardTitle>
                      <CardDescription>
                        Control what notifications you receive.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications via email
                          </p>
                        </div>
                        <Switch 
                          checked={notificationSettings.emailNotifications} 
                          onCheckedChange={() => toggleNotificationSetting('emailNotifications')}
                          className="data-[state=checked]:bg-primary"
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Donation Alerts</p>
                          <p className="text-sm text-muted-foreground">
                            Get notified when someone donates to your campaigns
                          </p>
                        </div>
                        <Switch 
                          checked={notificationSettings.donationAlerts} 
                          onCheckedChange={() => toggleNotificationSetting('donationAlerts')}
                          className="data-[state=checked]:bg-primary"
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Campaign Updates</p>
                          <p className="text-sm text-muted-foreground">
                            Stay informed about campaigns you've donated to
                          </p>
                        </div>
                        <Switch 
                          checked={notificationSettings.campaignUpdates} 
                          onCheckedChange={() => toggleNotificationSetting('campaignUpdates')}
                          className="data-[state=checked]:bg-primary"
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Comment Replies</p>
                          <p className="text-sm text-muted-foreground">
                            Get notified when someone replies to your comments
                          </p>
                        </div>
                        <Switch 
                          checked={notificationSettings.commentReplies} 
                          onCheckedChange={() => toggleNotificationSetting('commentReplies')}
                          className="data-[state=checked]:bg-primary"
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">New Followers</p>
                          <p className="text-sm text-muted-foreground">
                            Get notified when someone follows your profile
                          </p>
                        </div>
                        <Switch 
                          checked={notificationSettings.newFollowers} 
                          onCheckedChange={() => toggleNotificationSetting('newFollowers')}
                          className="data-[state=checked]:bg-primary"
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Campaign Milestones</p>
                          <p className="text-sm text-muted-foreground">
                            Get notified when your campaigns reach milestones
                          </p>
                        </div>
                        <Switch 
                          checked={notificationSettings.campaignMilestones} 
                          onCheckedChange={() => toggleNotificationSetting('campaignMilestones')}
                          className="data-[state=checked]:bg-primary"
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">System Updates</p>
                          <p className="text-sm text-muted-foreground">
                            Receive updates about platform features and changes
                          </p>
                        </div>
                        <Switch 
                          checked={notificationSettings.systemUpdates} 
                          onCheckedChange={() => toggleNotificationSetting('systemUpdates')}
                          className="data-[state=checked]:bg-primary"
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={() => {
                        toast({
                          title: "Notification settings saved",
                          description: "Your notification preferences have been updated.",
                          variant: "default",
                        });
                      }}>Save Preferences</Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="security">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Password & Security</CardTitle>
                      <CardDescription>
                        Manage your password and security preferences.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <TwoFactorAuth />
                      
                      <Separator className="my-4" />
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Advanced Security</h3>
                        
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">Active Sessions</h4>
                            <p className="text-sm text-muted-foreground">
                              Manage your active login sessions
                            </p>
                          </div>
                          <Button variant="outline">View</Button>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">Login History</h4>
                            <p className="text-sm text-muted-foreground">
                              Review recent account access
                            </p>
                          </div>
                          <Button variant="outline">View Log</Button>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={() => {
                        toast({
                          title: "Password updated",
                          description: "Your password has been changed successfully.",
                          variant: "default",
                        });
                      }}>Update Password</Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="subscriptions">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <EmailSubscriptions />
                </motion.div>
              </TabsContent>
              
              {user.role === 'admin' && (
                <TabsContent value="admin">
                  <Card>
                    <CardHeader>
                      <CardTitle>Admin Settings</CardTitle>
                      <CardDescription>
                        Manage administrator-specific settings.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="rounded-md border p-4">
                          <div className="font-medium">Admin Dashboard Access</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            You have full access to the admin dashboard and all its features.
                          </div>
                          <div className="mt-2 flex items-center text-sm text-green-600">
                            <Check className="mr-1 h-4 w-4" />
                            Active
                          </div>
                        </div>
                        
                        <div className="rounded-md border p-4">
                          <div className="font-medium">Manage User Permissions</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Control user roles and access levels.
                          </div>
                          <Button size="sm" className="mt-2">
                            Manage Users
                          </Button>
                        </div>
                        
                        <div className="rounded-md border p-4">
                          <div className="font-medium">System Notifications</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Receive important system alerts and notifications.
                          </div>
                          <div className="mt-2">
                            <Button size="sm" variant="outline">
                              Configure Notifications
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Profile;
