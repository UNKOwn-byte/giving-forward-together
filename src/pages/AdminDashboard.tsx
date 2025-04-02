
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

const AdminDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { campaigns, donations } = useData();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
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
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="p-3 text-center text-gray-500">
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
    </Layout>
  );
};

export default AdminDashboard;
