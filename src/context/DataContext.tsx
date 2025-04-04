
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
  verifyTransaction: (transactionId: string) => Promise<boolean>;
  addCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt' | 'raised'>) => Promise<Campaign>;
  updateCampaign: (id: string, updates: Partial<Omit<Campaign, 'id' | 'createdAt' | 'raised'>>) => Promise<Campaign>;
  deleteCampaign: (id: string) => Promise<void>;
  getUserCampaigns: (organizerId: string) => Campaign[];
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

  // Get campaigns created by a specific user
  const getUserCampaigns = (organizerId: string) => {
    return campaignData.filter(campaign => campaign.organizer === organizerId);
  };

  // Verify a transaction by its ID
  const verifyTransaction = async (transactionId: string): Promise<boolean> => {
    // In a real app, this would verify with a payment gateway API
    // For demo purposes, we'll simulate a verification delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if transaction ID already exists (to prevent duplicate submissions)
    const existingDonation = donationData.find(
      donation => donation.transactionId === transactionId
    );
    
    // For demo purposes, all transaction IDs that don't already exist are considered valid
    return !existingDonation;
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
    
    // Update campaign raised amount if donation is confirmed
    if (donationInput.status === 'confirmed') {
      setCampaignData(prev => 
        prev.map(campaign => 
          campaign.id === donationInput.campaignId 
            ? { ...campaign, raised: campaign.raised + donationInput.amount } 
            : campaign
        )
      );
    }
    
    return newDonation;
  };

  // Add a new campaign
  const addCampaign = async (campaignInput: Omit<Campaign, 'id' | 'createdAt' | 'raised'>) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newCampaign: Campaign = {
      ...campaignInput,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      raised: 0,
    };
    
    setCampaignData(prev => [...prev, newCampaign]);
    return newCampaign;
  };

  // Update an existing campaign
  const updateCampaign = async (id: string, updates: Partial<Omit<Campaign, 'id' | 'createdAt' | 'raised'>>) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let updatedCampaign: Campaign | undefined;
    
    setCampaignData(prev => {
      const updated = prev.map(campaign => {
        if (campaign.id === id) {
          updatedCampaign = { ...campaign, ...updates };
          return updatedCampaign;
        }
        return campaign;
      });
      return updated;
    });
    
    if (!updatedCampaign) {
      throw new Error('Campaign not found');
    }
    
    return updatedCampaign;
  };

  // Delete a campaign
  const deleteCampaign = async (id: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setCampaignData(prev => prev.filter(campaign => campaign.id !== id));
  };

  // Update donation status
  const updateDonationStatus = async (id: string, status: Donation['status'], transactionId?: string) => {
    // This would be a real API call in production
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let donation = donationData.find(d => d.id === id);
    
    if (!donation) return;
    
    setDonationData(prev => 
      prev.map(donation => 
        donation.id === id 
          ? { ...donation, status, ...(transactionId ? { transactionId } : {}) } 
          : donation
      )
    );
    
    // If status changed to confirmed, update the campaign raised amount
    if (status === 'confirmed' && donation.status !== 'confirmed') {
      setCampaignData(prev => 
        prev.map(campaign => 
          campaign.id === donation.campaignId 
            ? { ...campaign, raised: campaign.raised + donation.amount } 
            : campaign
        )
      );
    }
    // If status changed from confirmed to something else, subtract the amount
    else if (status !== 'confirmed' && donation.status === 'confirmed') {
      setCampaignData(prev => 
        prev.map(campaign => 
          campaign.id === donation.campaignId 
            ? { ...campaign, raised: campaign.raised - donation.amount } 
            : campaign
        )
      );
    }
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
        verifyTransaction,
        addCampaign,
        updateCampaign,
        deleteCampaign,
        getUserCampaigns,
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
