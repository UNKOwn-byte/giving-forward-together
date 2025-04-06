
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { formatCurrency, formatDate } from '../utils/donationUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  QrCode, 
  CheckCircle2, 
  XCircle, 
  Edit, 
  Trash2,
  Users,
  FileText,
  ChartBar,
  Shield
} from 'lucide-react';
import AddCampaignDialog from '../components/admin/AddCampaignDialog';
import UserManagement from '@/components/admin/UserManagement';
import CampaignModeration from '@/components/admin/CampaignModeration';
import ContentModeration from '@/components/admin/ContentModeration';
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
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { User, Campaign } from '../types';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a855f7', '#ec4899'];

const AdminDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { 
    campaigns, 
    donations, 
    updateDonationStatus, 
    verifyTransaction, 
    deleteCampaign,
    updateCampaignStatus,
    getUsers,
    getCampaignsByStatus,
    getAnalyticsData 
  } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [campaignSearchTerm, setCampaignSearchTerm] = useState('');
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
  const [currentDonationId, setCurrentDonationId] = useState<string | null>(null);
  const [verificationTransactionId, setVerificationTransactionId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  const analyticsData = getAnalyticsData();
  const users = getUsers();
  const pendingCampaigns = getCampaignsByStatus('pending');
  
  const confirmedDonations = donations.filter(d => d.status === 'confirmed');
  const pendingDonations = donations.filter(d => d.status === 'pending');
  
  const totalDonations = confirmedDonations.reduce((sum, d) => sum + d.amount, 0);
  const totalCampaigns = campaigns.length;
  const totalDonors = new Set(confirmedDonations.map(d => d.userId || d.email)).size;
  
  // Chart data
  const chartData = campaigns.map(campaign => ({
    name: campaign.title.length > 20 ? campaign.title.substring(0, 20) + '...' : campaign.title,
    raised: campaign.raised,
    goal: campaign.goal
  }));
  
  // Prepare category data for pie chart
  const categoryData = Object.entries(analyticsData.categoryCounts).map(([name, value]) => ({
    name,
    value
  }));
  
  // Monthly donations chart data
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonth = new Date().getMonth();
  
  const monthlyDonationData = analyticsData.monthlyDonations.map((amount, index) => {
    const monthIndex = (currentMonth - 5 + index + 12) % 12;
    return {
      name: months[monthIndex],
      amount: amount
    };
  });
  
  // Filter donations based on search term
  const filteredDonations = donations.filter(donation => 
    donation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donation.campaignId.toString().includes(searchTerm) ||
    (donation.transactionId && donation.transactionId.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Filter campaigns based on search term
  const filteredCampaigns = campaigns.filter(campaign => 
    campaign.title.toLowerCase().includes(campaignSearchTerm.toLowerCase()) ||
    campaign.category.toLowerCase().includes(campaignSearchTerm.toLowerCase()) ||
    campaign.description.toLowerCase().includes(campaignSearchTerm.toLowerCase())
  );
  
  // Open verification dialog for a donation
  const handleOpenVerifyDialog = (donationId: string) => {
    setCurrentDonationId(donationId);
    setVerificationTransactionId('');
    setIsVerifyDialogOpen(true);
  };
  
  // Handle verification of transaction ID
  const handleVerifyTransaction = async () => {
    if (!currentDonationId || !verificationTransactionId.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a valid transaction ID.",
        variant: "destructive"
      });
      return;
    }
    
    setIsVerifying(true);
    
    try {
      // Verify the transaction ID
      const isValid = await verifyTransaction(verificationTransactionId);
      
      if (isValid) {
        // Update donation status to confirmed
        await updateDonationStatus(currentDonationId, 'confirmed', verificationTransactionId);
        
        toast({
          title: "Verification Successful",
          description: "The donation has been marked as confirmed.",
        });
        
        setIsVerifyDialogOpen(false);
      } else {
        toast({
          title: "Verification Failed",
          description: "This transaction ID is invalid or has already been used.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Verification Error",
        description: "An error occurred during verification. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle campaign deletion
  const handleDeleteCampaign = async (id: string) => {
    try {
      await deleteCampaign(id);
      toast({
        title: "Campaign deleted",
        description: "The campaign has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete campaign. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle campaign status update
  const handleCampaignStatusUpdate = async (id: string, status: 'pending' | 'approved' | 'rejected') => {
    try {
      await updateCampaignStatus(id, status);
      toast({
        title: "Campaign updated",
        description: `Campaign has been ${status}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update campaign status. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Check if user is admin and redirect if not
  useEffect(() => {
    if (isAuthenticated && user?.role !== 'admin') {
      navigate('/');
    } else if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);
  
  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  const fadeInAnimation = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        {/* Admin Navigation Tabs */}
        <div className="mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <ChartBar className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Users</span>
              </TabsTrigger>
              <TabsTrigger value="campaigns" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Campaigns</span>
              </TabsTrigger>
              <TabsTrigger value="approvals" className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span className="hidden sm:inline">Approvals</span>
                {pendingCampaigns.length > 0 && (
                  <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                    {pendingCampaigns.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="moderation" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Moderation</span>
              </TabsTrigger>
            </TabsList>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInAnimation}
              className="mt-6"
            >
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Total Donations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatCurrency(totalDonations)}</div>
                      <p className="text-xs text-gray-500 mt-1">From {confirmedDonations.length} confirmed donations</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Active Campaigns</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{totalCampaigns}</div>
                      <p className="text-xs text-gray-500 mt-1">Across {new Set(campaigns.map(c => c.category)).size} categories</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Total Donors</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{totalDonors}</div>
                      <p className="text-xs text-gray-500 mt-1">Unique contributors</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Pending Campaigns</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{pendingCampaigns.length}</div>
                      <p className="text-xs text-gray-500 mt-1">Awaiting approval</p>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Monthly Donations Chart */}
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Monthly Donations (Last 6 Months)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={monthlyDonationData}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 20,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value) => formatCurrency(value as number)} />
                          <Legend />
                          <Bar dataKey="amount" name="Donations" fill="#0ea5e9" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Campaign Categories */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Campaign Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={categoryData}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              nameKey="name"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value} campaigns`, 'Count']} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Campaign Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={chartData.slice(0, 5)} // Show top 5 campaigns
                            layout="vertical"
                            margin={{
                              top: 20,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="name" width={150} />
                            <Tooltip formatter={(value) => formatCurrency(value as number)} />
                            <Legend />
                            <Bar dataKey="raised" name="Amount Raised" fill="#2da06f" />
                            <Bar dataKey="goal" name="Goal" fill="#0ea5e9" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Recent Transactions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Donor</TableHead>
                          <TableHead>Campaign</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {donations.slice(0, 5).map(donation => {
                          const campaign = campaigns.find(c => c.id === donation.campaignId);
                          return (
                            <TableRow key={donation.id}>
                              <TableCell>{donation.name}</TableCell>
                              <TableCell>{campaign?.title || 'Unknown'}</TableCell>
                              <TableCell>{formatCurrency(donation.amount)}</TableCell>
                              <TableCell>
                                <Badge variant={
                                  donation.status === 'confirmed' ? 'default' :
                                  donation.status === 'pending' ? 'outline' : 'destructive'
                                }>
                                  {donation.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{formatDate(donation.createdAt)}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Users Tab */}
              <TabsContent value="users">
                <UserManagement />
              </TabsContent>

              {/* Campaigns Tab - Same as original */}
              <TabsContent value="campaigns">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                      <CardTitle>All Campaigns</CardTitle>
                      <AddCampaignDialog />
                    </div>
                    <div className="mt-4">
                      <Input
                        placeholder="Search campaigns by title, category..."
                        value={campaignSearchTerm}
                        onChange={(e) => setCampaignSearchTerm(e.target.value)}
                        className="max-w-md"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50 text-left">
                            <th className="p-3 border-b">Title</th>
                            <th className="p-3 border-b">Category</th>
                            <th className="p-3 border-b">Goal</th>
                            <th className="p-3 border-b">Raised</th>
                            <th className="p-3 border-b">Progress</th>
                            <th className="p-3 border-b">Status</th>
                            <th className="p-3 border-b">End Date</th>
                            <th className="p-3 border-b">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCampaigns.length > 0 ? (
                            filteredCampaigns.map(campaign => {
                              const progress = Math.round((campaign.raised / campaign.goal) * 100);
                              return (
                                <tr key={campaign.id} className="border-b hover:bg-gray-50">
                                  <td className="p-3 font-medium">{campaign.title}</td>
                                  <td className="p-3">{campaign.category}</td>
                                  <td className="p-3">{formatCurrency(campaign.goal)}</td>
                                  <td className="p-3">{formatCurrency(campaign.raised)}</td>
                                  <td className="p-3">
                                    <div className="flex items-center">
                                      <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                                        <div 
                                          className="bg-brand-500 h-2.5 rounded-full" 
                                          style={{ width: `${progress}%` }}
                                        ></div>
                                      </div>
                                      <span className="text-xs font-medium">{progress}%</span>
                                    </div>
                                  </td>
                                  <td className="p-3">
                                    <Badge variant={
                                      campaign.status === 'approved' ? 'default' :
                                      campaign.status === 'pending' ? 'outline' : 'destructive'
                                    }>
                                      {campaign.status || 'pending'}
                                    </Badge>
                                  </td>
                                  <td className="p-3">{campaign.endDate ? formatDate(campaign.endDate) : 'Ongoing'}</td>
                                  <td className="p-3">
                                    <div className="flex space-x-2">
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        className="flex items-center gap-1"
                                        asChild
                                      >
                                        <Link to={`/edit-campaign/${campaign.id}`}>
                                          <Edit size={14} />
                                          Edit
                                        </Link>
                                      </Button>
                                      
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button 
                                            size="sm" 
                                            variant="outline" 
                                            className="flex items-center gap-1 text-red-500 border-red-500 hover:bg-red-50"
                                          >
                                            <Trash2 size={14} />
                                            Delete
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              This action cannot be undone. This will permanently delete the campaign
                                              and all associated data.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction 
                                              onClick={() => handleDeleteCampaign(campaign.id)}
                                              className="bg-red-500 hover:bg-red-600"
                                            >
                                              Delete
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan={8} className="p-3 text-center text-gray-500">
                                No campaigns found. Try adjusting your search or create a new campaign.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Approvals Tab */}
              <TabsContent value="approvals">
                <CampaignModeration />
              </TabsContent>

              {/* Content Moderation Tab */}
              <TabsContent value="moderation">
                <ContentModeration />
              </TabsContent>
            </motion.div>
          </Tabs>
        </div>
      </div>
      
      {/* Transaction Verification Dialog */}
      <Dialog open={isVerifyDialogOpen} onOpenChange={setIsVerifyDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verify Transaction</DialogTitle>
            <DialogDescription>
              Enter the UPI transaction ID to verify the payment.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="transactionId" className="text-sm font-medium">
                Transaction ID
              </label>
              <Input
                id="transactionId"
                value={verificationTransactionId}
                onChange={(e) => setVerificationTransactionId(e.target.value)}
                placeholder="Enter UPI transaction ID"
                className="col-span-3"
              />
              <p className="text-xs text-gray-500">
                Verify the transaction ID from the donor's UPI app or scan the QR code.
              </p>
            </div>
            
            <div className="flex justify-center">
              <QrCode size={80} className="text-gray-400" />
            </div>
            
            <p className="text-center text-sm text-gray-500">
              You can also scan this QR code to verify the payment
            </p>
          </div>
          
          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsVerifyDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleVerifyTransaction}
              disabled={isVerifying || !verificationTransactionId.trim()}
            >
              {isVerifying ? 'Verifying...' : 'Verify Transaction'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default AdminDashboard;
