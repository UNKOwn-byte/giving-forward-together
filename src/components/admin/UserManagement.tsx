
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/utils/donationUtils';
import { 
  User, 
  UserCheck,
  UserX,
  Filter,
  Mail,
  ShieldCheck,
  ShieldX
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const UserManagement: React.FC = () => {
  const { users, updateUserRole } = useData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [verificationFilter, setVerificationFilter] = useState<'all' | 'verified' | 'unverified'>('all');

  // Filter users based on search term and filters
  const filteredUsers = users.filter(user => {
    // Name and email search
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Role filter
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    // Verification filter
    const matchesVerification = 
      verificationFilter === 'all' || 
      (verificationFilter === 'verified' && user.emailVerified) ||
      (verificationFilter === 'unverified' && !user.emailVerified);
    
    return matchesSearch && matchesRole && matchesVerification;
  });

  const handleUpdateRole = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      await updateUserRole(userId, newRole);
      toast({
        title: "Role updated",
        description: `User role has been updated to ${newRole}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSendVerificationEmail = (email: string) => {
    // This would typically send a verification email
    toast({
      title: "Verification email sent",
      description: `A verification email has been sent to ${email}.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>User Management</span>
          <div className="flex gap-2">
            <span className="text-sm font-normal text-muted-foreground">
              {filteredUsers.length} users
            </span>
          </div>
        </CardTitle>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="sm:max-w-sm"
          />
          
          <div className="flex flex-wrap gap-2">
            <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as any)}>
              <SelectTrigger className="w-[130px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Role: {roleFilter}</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={verificationFilter} onValueChange={(value) => setVerificationFilter(value as any)}>
              <SelectTrigger className="w-[150px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Status: {verificationFilter}</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                        ) : (
                          <User className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.emailVerified ? (
                      <Badge variant="success" className="bg-green-100 text-green-800 hover:bg-green-200">
                        verified
                      </Badge>
                    ) : (
                      <Badge variant="destructive">unverified</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {user.provider || 'email'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {/* Change Role Dialog */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="h-8">
                            <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                            <span className="hidden sm:inline">Role</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Update User Role</DialogTitle>
                            <DialogDescription>
                              Change the role of user {user.name}.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="col-span-4">
                                Current role: <Badge className="ml-2">{user.role}</Badge>
                              </span>
                            </div>
                            <div className="flex justify-center space-x-4">
                              <Button 
                                onClick={() => handleUpdateRole(user.id, 'user')}
                                variant={user.role === 'user' ? 'default' : 'outline'}
                                className="flex items-center"
                                disabled={user.role === 'user'}
                              >
                                <User className="h-4 w-4 mr-2" />
                                Regular User
                              </Button>
                              <Button 
                                onClick={() => handleUpdateRole(user.id, 'admin')}
                                variant={user.role === 'admin' ? 'default' : 'outline'}
                                className="flex items-center"
                                disabled={user.role === 'admin'}
                              >
                                <ShieldCheck className="h-4 w-4 mr-2" />
                                Admin
                              </Button>
                            </div>
                          </div>
                          <DialogFooter>
                            <DialogTrigger asChild>
                              <Button variant="outline">Close</Button>
                            </DialogTrigger>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      
                      {/* Verification Email Button */}
                      {!user.emailVerified && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleSendVerificationEmail(user.email)}
                          className="h-8"
                        >
                          <Mail className="h-3.5 w-3.5 mr-1" />
                          <span className="hidden sm:inline">Verify</span>
                        </Button>
                      )}
                      
                      {/* View Details Button */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="h-8">
                            <UserCheck className="h-3.5 w-3.5 mr-1" />
                            <span className="hidden sm:inline">Details</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>User Details</DialogTitle>
                            <DialogDescription>
                              Detailed information about {user.name}.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="flex justify-center">
                              <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                                {user.avatar ? (
                                  <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                                ) : (
                                  <User className="h-10 w-10 text-gray-500" />
                                )}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <p className="text-sm font-medium">Name</p>
                                <p className="text-sm text-gray-500">{user.name}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Email</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Role</p>
                                <p className="text-sm text-gray-500">{user.role}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Provider</p>
                                <p className="text-sm text-gray-500">{user.provider || 'email'}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Verified</p>
                                <p className="text-sm text-gray-500">{user.emailVerified ? 'Yes' : 'No'}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Donations</p>
                                <p className="text-sm text-gray-500">{user.donationsCount || 0}</p>
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <DialogTrigger asChild>
                              <Button>Close</Button>
                            </DialogTrigger>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No users found matching your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default UserManagement;
