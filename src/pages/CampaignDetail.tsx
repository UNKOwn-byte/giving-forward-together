
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, calculateProgress, formatDate, generateUPIPaymentURL } from '../utils/donationUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CampaignDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getCampaign, getCampaignDonations, addDonation, updateDonationStatus } = useData();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const campaign = getCampaign(id || '');
  const donations = getCampaignDonations(id || '');
  
  const [donationAmount, setDonationAmount] = useState<number>(1000);
  const [donorName, setDonorName] = useState<string>(user?.name || '');
  const [donorEmail, setDonorEmail] = useState<string>(user?.email || '');
  const [message, setMessage] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [transactionId, setTransactionId] = useState<string>('');
  const [activeDonation, setActiveDonation] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  if (!campaign) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Campaign Not Found</h1>
          <p className="text-lg text-gray-600 mb-6">
            The campaign you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/campaigns')}>
            Browse Campaigns
          </Button>
        </div>
      </Layout>
    );
  }
  
  const progress = calculateProgress(campaign.raised, campaign.goal);
  
  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (donationAmount < 10) {
      toast({
        title: "Invalid Amount",
        description: "Donation amount must be at least ₹10",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create the donation record
      const newDonation = await addDonation({
        campaignId: campaign.id,
        userId: user?.id,
        amount: donationAmount,
        name: isAnonymous ? 'Anonymous' : donorName,
        email: donorEmail,
        message,
        status: 'pending',
        paymentMethod: 'upi',
        anonymous: isAnonymous
      });
      
      setActiveDonation(newDonation.id);
      
      // Generate UPI payment URL
      const upiURL = generateUPIPaymentURL(
        'GivingForward',
        'givingforward@okaxis', // Example UPI ID
        donationAmount,
        `Donation for ${campaign.title}`
      );
      
      // Open the UPI URL in a new window or redirect
      window.open(upiURL, '_blank');
      
      toast({
        title: "Payment Initiated",
        description: "Complete the payment in your UPI app and return to confirm your donation.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error processing your donation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleConfirmPayment = async () => {
    if (!activeDonation) return;
    
    if (!transactionId || transactionId.length < 5) {
      toast({
        title: "Invalid Transaction ID",
        description: "Please enter a valid UPI transaction reference ID",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await updateDonationStatus(activeDonation, 'confirmed', transactionId);
      
      toast({
        title: "Thank You!",
        description: "Your donation has been confirmed. We appreciate your support!",
      });
      
      // Reset form
      setDonationAmount(1000);
      setMessage('');
      setTransactionId('');
      setActiveDonation(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error confirming your donation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src={campaign.image} 
                alt={campaign.title} 
                className="w-full h-80 object-cover"
              />
              
              <div className="p-6">
                <h1 className="text-3xl font-bold mb-4">{campaign.title}</h1>
                
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <span className="inline-block bg-brand-100 text-brand-800 px-3 py-1 rounded-full text-sm font-medium">
                      {campaign.category}
                    </span>
                  </div>
                  <div className="text-gray-600">
                    Organized by: <span className="font-medium">{campaign.organizer}</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-1">
                    <div className="font-medium">
                      <span className="text-xl font-bold text-brand-700">{formatCurrency(campaign.raised)}</span> 
                      <span className="text-gray-600"> of {formatCurrency(campaign.goal)} goal</span>
                    </div>
                    <span className="font-medium text-gray-700">{Math.round(progress)}%</span>
                  </div>
                  <div className="progress-bar h-3">
                    <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
                
                <div className="mb-8">
                  {campaign.endDate && (
                    <div className="text-gray-600 mb-4">
                      <span className="font-medium">End Date:</span> {formatDate(campaign.endDate)}
                    </div>
                  )}
                  
                  <p className="text-gray-700 whitespace-pre-line">
                    {campaign.description}
                  </p>
                </div>
                
                <Tabs defaultValue="donations">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="donations">Recent Donations</TabsTrigger>
                    <TabsTrigger value="updates">Campaign Updates</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="donations">
                    <div className="bg-gray-50 p-4 rounded-md my-4">
                      <h3 className="text-lg font-bold mb-4">Recent Supporters</h3>
                      
                      {donations.length > 0 ? (
                        <div className="space-y-4">
                          {donations
                            .filter(d => d.status === 'confirmed')
                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .slice(0, 5)
                            .map(donation => (
                              <div key={donation.id} className="border-b border-gray-200 pb-4 last:border-0">
                                <div className="flex justify-between">
                                  <div className="font-medium">{donation.name}</div>
                                  <div className="font-bold text-brand-700">{formatCurrency(donation.amount)}</div>
                                </div>
                                {donation.message && (
                                  <div className="text-gray-600 text-sm mt-1">
                                    "{donation.message}"
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>
                      ) : (
                        <p className="text-gray-600">No donations yet. Be the first to contribute!</p>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="updates">
                    <div className="bg-gray-50 p-4 rounded-md my-4">
                      <h3 className="text-lg font-bold mb-4">Campaign Updates</h3>
                      <p className="text-gray-600">
                        No updates yet. Check back soon for progress reports on this campaign.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            {!activeDonation ? (
              <Card>
                <CardHeader>
                  <CardTitle>Make a Donation</CardTitle>
                  <CardDescription>
                    Your contribution can make a real difference. All donations are processed via UPI.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleDonationSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Donation Amount (₹)
                        </label>
                        <div className="grid grid-cols-4 gap-2 mb-4">
                          {[500, 1000, 2000, 5000].map(amount => (
                            <Button
                              key={amount}
                              type="button"
                              variant={donationAmount === amount ? "default" : "outline"}
                              onClick={() => setDonationAmount(amount)}
                            >
                              ₹{amount}
                            </Button>
                          ))}
                        </div>
                        <Input
                          type="number"
                          value={donationAmount}
                          onChange={(e) => setDonationAmount(Number(e.target.value))}
                          min={10}
                          step={1}
                          placeholder="Enter custom amount"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <Input
                          value={donorName}
                          onChange={(e) => setDonorName(e.target.value)}
                          placeholder="Your name"
                          required={!isAnonymous}
                          disabled={isAnonymous}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <Input
                          type="email"
                          value={donorEmail}
                          onChange={(e) => setDonorEmail(e.target.value)}
                          placeholder="Your email"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Message (Optional)
                        </label>
                        <Textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Leave a message for the campaign"
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="anonymous" 
                          checked={isAnonymous}
                          onCheckedChange={(checked) => {
                            setIsAnonymous(checked === true);
                            if (checked) {
                              setDonorName('Anonymous');
                            } else {
                              setDonorName(user?.name || '');
                            }
                          }}
                        />
                        <label
                          htmlFor="anonymous"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Donate anonymously
                        </label>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full mt-6 bg-brand-500 hover:bg-brand-600"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Processing...' : 'Donate Now'}
                    </Button>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-center text-xs text-gray-600">
                  <p>Your donation is processed securely via UPI</p>
                </CardFooter>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Confirm Your Payment</CardTitle>
                  <CardDescription>
                    Complete the payment in your UPI app and provide the transaction reference ID.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-brand-50 p-4 rounded-md mb-4">
                      <p className="text-sm text-brand-800">
                        Please complete the payment in your UPI app and then enter the 
                        UPI transaction reference ID below to confirm your donation.
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        UPI Transaction Reference ID
                      </label>
                      <Input
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="e.g., UPI123456789"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        You can find this ID in your UPI app's transaction history
                      </p>
                    </div>
                    
                    <Button 
                      onClick={handleConfirmPayment} 
                      className="w-full bg-brand-500 hover:bg-brand-600"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Processing...' : 'Confirm Donation'}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => setActiveDonation(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-4">Share This Campaign</h3>
              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1">
                  Facebook
                </Button>
                <Button variant="outline" className="flex-1">
                  Twitter
                </Button>
                <Button variant="outline" className="flex-1">
                  WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CampaignDetail;
