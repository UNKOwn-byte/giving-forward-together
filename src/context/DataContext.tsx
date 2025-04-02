
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Campaign, Donation } from '../types';

// Sample data for demo purposes
import { campaigns, donations } from '../data/sampleData';

interface DataContextType {
  campaigns: Campaign[];
  donations: Donation[];
  featuredCampaigns: Campaign[];
  getCampaign: (id: string) => Campaign | undefined;
  getCampaignDonations: (campaignId: string) => Donation[];
  addDonation: (donation: Omit<Donation, 'id' | 'createdAt'>) => Promise<Donation>;
  updateDonationStatus: (id: string, status: Donation['status'], transactionId?: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [campaignData, setCampaignData] = useState<Campaign[]>(campaigns);
  const [donationData, setDonationData] = useState<Donation[]>(donations);

  // Get featured campaigns
  const featuredCampaigns = campaignData.filter(campaign => campaign.featured);

  // Get campaign by ID
  const getCampaign = (id: string) => {
    return campaignData.find(campaign => campaign.id === id);
  };

  // Get donations for a specific campaign
  const getCampaignDonations = (campaignId: string) => {
    return donationData.filter(donation => donation.campaignId === campaignId);
  };

  // Add a new donation
  const addDonation = async (donationInput: Omit<Donation, 'id' | 'createdAt'>) => {
    // This would be a real API call in production
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newDonation: Donation = {
      ...donationInput,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
    };
    
    setDonationData(prev => [...prev, newDonation]);
    
    // Update campaign raised amount
    setCampaignData(prev => 
      prev.map(campaign => 
        campaign.id === donationInput.campaignId 
          ? { ...campaign, raised: campaign.raised + donationInput.amount } 
          : campaign
      )
    );
    
    return newDonation;
  };

  // Update donation status
  const updateDonationStatus = async (id: string, status: Donation['status'], transactionId?: string) => {
    // This would be a real API call in production
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setDonationData(prev => 
      prev.map(donation => 
        donation.id === id 
          ? { ...donation, status, ...(transactionId ? { transactionId } : {}) } 
          : donation
      )
    );
  };

  return (
    <DataContext.Provider
      value={{
        campaigns: campaignData,
        donations: donationData,
        featuredCampaigns,
        getCampaign,
        getCampaignDonations,
        addDonation,
        updateDonationStatus,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
