
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { formatCurrency, formatDate } from '../utils/donationUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { QrCode, CheckCircle2, XCircle } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { campaigns, donations, updateDonationStatus, verifyTransaction } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
  const [currentDonationId, setCurrentDonationId] = useState<string | null>(null);
  const [verificationTransactionId, setVerificationTransactionId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  
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
  
  // Filter donations based on search term
  const filteredDonations = donations.filter(donation => 
    donation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donation.campaignId.toString().includes(searchTerm) ||
    (donation.transactionId && donation.transactionId.toLowerCase().includes(searchTerm.toLowerCase()))
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
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
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
              <CardTitle className="text-sm font-medium text-gray-500">Pending Donations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingDonations.length}</div>
              <p className="text-xs text-gray-500 mt-1">Awaiting confirmation</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Campaign Performance Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 70,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Legend />
                  <Bar dataKey="raised" name="Amount Raised" fill="#2da06f" />
                  <Bar dataKey="goal" name="Goal" fill="#0ea5e9" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Tabs for Donations and Campaigns */}
        <Tabs defaultValue="donations">
          <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
            <TabsTrigger value="donations">Donations</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          </TabsList>
          
          <TabsContent value="donations">
            <Card>
              <CardHeader>
                <CardTitle>All Donations</CardTitle>
                <div className="mt-4">
                  <Input
                    placeholder="Search by name, email, or transaction ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-md"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        <th className="p-3 border-b">Donor</th>
                        <th className="p-3 border-b">Campaign</th>
                        <th className="p-3 border-b">Amount</th>
                        <th className="p-3 border-b">Date</th>
                        <th className="p-3 border-b">Status</th>
                        <th className="p-3 border-b">Transaction ID</th>
                        <th className="p-3 border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDonations.length > 0 ? (
                        filteredDonations.map(donation => {
                          const campaign = campaigns.find(c => c.id === donation.campaignId);
                          return (
                            <tr key={donation.id} className="border-b hover:bg-gray-50">
                              <td className="p-3">
                                <div className="font-medium">{donation.name}</div>
                                <div className="text-sm text-gray-500">{donation.email}</div>
                              </td>
                              <td className="p-3">
                                {campaign?.title || 'Unknown Campaign'}
                              </td>
                              <td className="p-3 font-medium">
                                {formatCurrency(donation.amount)}
                              </td>
                              <td className="p-3 text-gray-600">
                                {formatDate(donation.createdAt)}
                              </td>
                              <td className="p-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  donation.status === 'confirmed' 
                                    ? 'bg-green-100 text-green-800' 
                                    : donation.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                                </span>
                              </td>
                              <td className="p-3 text-gray-600">
                                {donation.transactionId || 'Not provided'}
                              </td>
                              <td className="p-3">
                                <div className="flex space-x-2">
                                  {donation.status === 'pending' && (
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="flex items-center gap-1"
                                      onClick={() => handleOpenVerifyDialog(donation.id)}
                                    >
                                      <QrCode size={14} />
                                      Verify
                                    </Button>
                                  )}
                                  
                                  {donation.status !== 'confirmed' && (
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="flex items-center gap-1 text-green-600 border-green-600 hover:bg-green-50"
                                      onClick={() => updateDonationStatus(donation.id, 'confirmed')}
                                    >
                                      <CheckCircle2 size={14} />
                                      Approve
                                    </Button>
                                  )}
                                  
                                  {donation.status !== 'failed' && (
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="flex items-center gap-1 text-red-600 border-red-600 hover:bg-red-50"
                                      onClick={() => updateDonationStatus(donation.id, 'failed')}
                                    >
                                      <XCircle size={14} />
                                      Reject
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={7} className="p-3 text-center text-gray-500">
                            No donations found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="campaigns">
            <Card>
              <CardHeader>
                <CardTitle>All Campaigns</CardTitle>
                <div className="flex justify-end mt-4">
                  <Button>Add New Campaign</Button>
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
                        <th className="p-3 border-b">End Date</th>
                        <th className="p-3 border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaigns.map(campaign => {
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
                            <td className="p-3">{campaign.endDate ? formatDate(campaign.endDate) : 'Ongoing'}</td>
                            <td className="p-3">
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">Edit</Button>
                                <Button size="sm" variant="outline" className="text-red-500 border-red-500 hover:bg-red-50">
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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
