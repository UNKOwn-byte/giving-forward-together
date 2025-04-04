
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyDonations = () => {
  const { user, isAuthenticated } = useAuth();
  const { donations, campaigns } = useData();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  // Filter donations by current user
  const userDonations = donations.filter(
    donation => donation.userId === user.id || donation.email === user.email
  );

  // Get campaign details for each donation
  const donationsWithCampaignInfo = userDonations.map(donation => {
    const campaign = campaigns.find(c => c.id === donation.campaignId);
    return {
      ...donation,
      campaignTitle: campaign ? campaign.title : 'Unknown Campaign',
      campaignImage: campaign ? campaign.image : '/placeholder.svg',
    };
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Donations</h1>
        
        {donationsWithCampaignInfo.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <p className="text-lg text-muted-foreground mb-4">
                You haven't made any donations yet.
              </p>
              <Link
                to="/campaigns"
                className="flex items-center text-brand-600 hover:text-brand-700"
              >
                Browse campaigns <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Donation History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donationsWithCampaignInfo.map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <img
                            src={donation.campaignImage}
                            alt={donation.campaignTitle}
                            className="h-10 w-10 rounded object-cover mr-3"
                          />
                          <span className="font-medium">{donation.campaignTitle}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(donation.createdAt), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>₹{donation.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(donation.status) as any}>
                          {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Link 
                          to={`/campaign/${donation.campaignId}`}
                          className="text-brand-600 hover:text-brand-700 text-sm"
                        >
                          View Campaign
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default MyDonations;
