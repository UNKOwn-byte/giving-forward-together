
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import DonationForm from '../components/donation/DonationForm';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate, calculateDaysLeft } from '../utils/donationUtils';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SocialShare from '../components/campaigns/SocialShare';
import { Edit } from 'lucide-react';

const CampaignDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getCampaign, getCampaignDonations } = useData();
  const { user } = useAuth();
  
  if (!id) return <div>Campaign not found</div>;
  
  const campaign = getCampaign(id);
  const donations = getCampaignDonations(id);
  const confirmedDonations = donations.filter(d => d.status === 'confirmed');
  
  if (!campaign) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Campaign Not Found</h1>
          <p className="mb-8">The campaign you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/campaigns">Browse Campaigns</Link>
          </Button>
        </div>
      </Layout>
    );
  }
  
  const progress = calculateProgress(campaign.raised, campaign.goal);
  
  // Calculate days left if there's an end date
  const daysLeft = campaign.endDate ? calculateDaysLeft(campaign.endDate) : null;
  
  // Check if the current user is the campaign organizer or an admin
  const isOwnerOrAdmin = user && (user.id === campaign.organizer || user.role === 'admin');
  
  // Get current URL for sharing
  const currentUrl = window.location.href;
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Campaign Details */}
          <div className="lg:w-2/3">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold">{campaign.title}</h1>
              <div className="flex space-x-2">
                <SocialShare 
                  url={currentUrl}
                  title={campaign.title}
                  description={campaign.shortDescription}
                />
                
                {isOwnerOrAdmin && (
                  <Button variant="outline" asChild>
                    <Link to={`/edit-campaign/${campaign.id}`} className="flex items-center gap-2">
                      <Edit size={16} />
                      Edit
                    </Link>
                  </Button>
                )}
              </div>
            </div>
            
            <div className="relative h-96 rounded-lg overflow-hidden mb-6">
              <img 
                src={campaign.image}
                alt={campaign.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-medium">
                {campaign.category}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-gray-600 text-sm mb-1">Raised</div>
                <div className="text-2xl font-bold">{formatCurrency(campaign.raised)}</div>
                <div className="text-sm text-gray-500">of {formatCurrency(campaign.goal)} goal</div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-gray-600 text-sm mb-1">Supporters</div>
                <div className="text-2xl font-bold">{confirmedDonations.length}</div>
                <div className="text-sm text-gray-500">
                  {confirmedDonations.length === 1 ? 'person has donated' : 'people have donated'}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-gray-600 text-sm mb-1">
                  {daysLeft !== null ? 'Time Left' : 'Status'}
                </div>
                <div className="text-2xl font-bold">
                  {daysLeft !== null
                    ? daysLeft > 0
                      ? `${daysLeft} Days`
                      : 'Ended'
                    : 'Ongoing'}
                </div>
                <div className="text-sm text-gray-500">
                  {campaign.endDate 
                    ? `Ends on ${formatDate(campaign.endDate)}` 
                    : 'No end date set'}
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span>{Math.round(progress)}% Complete</span>
                <span>{formatCurrency(campaign.raised)} raised of {formatCurrency(campaign.goal)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-brand-500 h-2.5 rounded-full" 
                  style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <Tabs defaultValue="about">
              <TabsList>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="donations">Donations</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="py-4">
                <div className="prose max-w-none">
                  <p className="text-lg font-medium mb-4">{campaign.shortDescription}</p>
                  <div className="whitespace-pre-wrap">
                    {campaign.description.split('\n').map((paragraph, i) => (
                      <p key={i} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="donations" className="py-4">
                {confirmedDonations.length > 0 ? (
                  <div className="space-y-4">
                    {confirmedDonations.map(donation => (
                      <div key={donation.id} className="border-b pb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">
                              {donation.anonymous ? 'Anonymous Donor' : donation.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatDate(donation.createdAt)}
                            </div>
                            {donation.message && (
                              <div className="mt-2 text-gray-700">
                                "{donation.message}"
                              </div>
                            )}
                          </div>
                          <div className="font-medium">
                            {formatCurrency(donation.amount)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">No donations yet. Be the first to contribute!</p>
                    <Button>Donate Now</Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Donation Form */}
          <div className="lg:w-1/3">
            <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
              <h2 className="text-xl font-bold mb-4">Support This Campaign</h2>
              <DonationForm campaignId={campaign.id} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const calculateProgress = (raised: number, goal: number): number => {
  return (raised / goal) * 100;
};

export default CampaignDetail;
