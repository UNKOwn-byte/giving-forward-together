
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useData } from '../context/DataContext';
import { formatCurrency, calculateProgress, formatDate } from '../utils/donationUtils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import DonationForm from '@/components/donation/DonationForm';

const CampaignDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCampaign, getCampaignDonations } = useData();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('about');
  const [showDonationForm, setShowDonationForm] = useState(false);
  
  // Fetch campaign data
  const campaign = getCampaign(id || '');
  const donations = getCampaignDonations(id || '');
  
  useEffect(() => {
    if (!campaign) {
      toast({
        title: "Campaign Not Found",
        description: "The campaign you're looking for doesn't exist.",
        variant: "destructive"
      });
      navigate('/campaigns');
    }
  }, [campaign, navigate, toast]);
  
  if (!campaign) {
    return null;
  }
  
  const progress = calculateProgress(campaign.raised, campaign.goal);
  const recentDonations = donations
    .filter(donation => donation.status === 'confirmed')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  const handleDonateClick = () => {
    setShowDonationForm(true);
  };
  
  const handleDonationComplete = () => {
    setShowDonationForm(false);
    setActiveTab('donations');
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Campaign Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-10">
          <div className="md:w-2/3">
            <img 
              src={campaign.image} 
              alt={campaign.title} 
              className="w-full h-[400px] object-cover rounded-lg shadow-md mb-6"
            />
            
            <h1 className="text-3xl font-bold mb-3">{campaign.title}</h1>
            
            <div className="flex items-center text-gray-600 mb-6">
              <span className="mr-4">Organized by: {campaign.organizer}</span>
              <span>Created: {formatDate(campaign.createdAt)}</span>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">{formatCurrency(campaign.raised)} raised</span>
                <span className="text-gray-600">Goal: {formatCurrency(campaign.goal)}</span>
              </div>
              <Progress value={progress} className="h-2 mb-1" />
              <div className="text-sm text-gray-600">{progress.toFixed(1)}% of goal reached</div>
            </div>
          </div>
          
          <div className="md:w-1/3">
            {showDonationForm ? (
              <DonationForm 
                campaignId={campaign.id} 
                campaignTitle={campaign.title}
                onDonationComplete={handleDonationComplete}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h3 className="text-xl font-bold mb-4">Support This Campaign</h3>
                <p className="text-gray-600 mb-6">{campaign.shortDescription}</p>
                
                <Button 
                  onClick={handleDonateClick} 
                  className="w-full bg-brand-500 hover:bg-brand-600 mb-4"
                  size="lg"
                >
                  Donate Now
                </Button>
                
                <div className="text-sm text-gray-500 text-center">
                  <p>Secure payment via UPI</p>
                  <p>100% of your donation goes to the cause</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Campaign Content Tabs */}
        <Tabs defaultValue="about" value={activeTab} onValueChange={setActiveTab} className="mb-10">
          <TabsList className="mb-6">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="donations">Donations</TabsTrigger>
            <TabsTrigger value="updates">Updates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">About This Campaign</h2>
            <div className="prose max-w-none">
              <p className="whitespace-pre-line">{campaign.description}</p>
            </div>
          </TabsContent>
          
          <TabsContent value="donations" className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Recent Donations</h2>
            
            {recentDonations.length > 0 ? (
              <div className="space-y-4">
                {recentDonations.map(donation => (
                  <div key={donation.id} className="border-b pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">
                          {donation.anonymous ? 'Anonymous Donor' : donation.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(donation.createdAt)}
                        </p>
                        {donation.message && (
                          <p className="mt-1 text-gray-700">{donation.message}</p>
                        )}
                      </div>
                      <p className="font-semibold">{formatCurrency(donation.amount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No donations yet. Be the first to donate!</p>
            )}
            
            <Button 
              onClick={handleDonateClick}
              className="mt-6 bg-brand-500 hover:bg-brand-600"
            >
              Make a Donation
            </Button>
          </TabsContent>
          
          <TabsContent value="updates" className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Campaign Updates</h2>
            <p className="text-gray-500">No updates yet. Check back soon for updates on this campaign.</p>
          </TabsContent>
        </Tabs>
        
        {/* Similar Campaigns */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Similar Campaigns</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Similar campaigns would be shown here */}
            <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
              <p className="text-gray-500">Coming soon</p>
            </div>
            <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
              <p className="text-gray-500">Coming soon</p>
            </div>
            <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
              <p className="text-gray-500">Coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CampaignDetail;
