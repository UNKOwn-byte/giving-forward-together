
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { User, CameraIcon, Check, Save, X } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '/placeholder.svg',
  });

  // Check if user is authenticated
  React.useEffect(() => {
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

  const handleSaveProfile = () => {
    // In a real app, this would call an API to update the user profile
    // For this demo, we'll just show a success toast
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
      variant: "default",
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    // Reset form data to original user data
    setProfileData({
      name: user.name,
      email: user.email,
      avatar: user.avatar || '/placeholder.svg',
    });
    setIsEditing(false);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="md:col-span-1">
            <CardHeader className="pb-0 flex flex-col items-center">
              <div className="relative group">
                <Avatar className="h-24 w-24 mb-2">
                  <AvatarImage src={profileData.avatar} alt={profileData.name} />
                  <AvatarFallback className="text-xl">
                    {profileData.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 p-1 bg-primary rounded-full cursor-pointer">
                  <CameraIcon className="h-4 w-4 text-white" />
                </div>
              </div>
              <CardTitle className="mt-4 text-center">{profileData.name}</CardTitle>
              <CardDescription className="text-center">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 text-center">
              <p className="text-sm text-muted-foreground mb-4">{profileData.email}</p>
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
          
          {/* Profile Details */}
          <div className="md:col-span-2">
            <Tabs defaultValue="account" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                {user.role === 'admin' && (
                  <TabsTrigger value="admin">Admin Settings</TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="account">
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
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input
                        id="role"
                        value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        disabled
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
              </TabsContent>
              
              <TabsContent value="security">
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
                  </CardContent>
                  <CardFooter>
                    <Button className="ml-auto">Update Password</Button>
                  </CardFooter>
                </Card>
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
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
