
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Campaign, Donation, User } from '../types';

// Sample data for demo purposes
import { campaigns, donations } from '../data/sampleData';

interface DataContextType {
  campaigns: Campaign[];
  donations: Donation[];
  featuredCampaigns: Campaign[];
  users: User[];
  getCampaign: (id: string) => Campaign | undefined;
  getCampaignDonations: (campaignId: string) => Donation[];
  addDonation: (donation: Omit<Donation, 'id' | 'createdAt'>) => Promise<Donation>;
  updateDonationStatus: (id: string, status: Donation['status'], transactionId?: string) => Promise<void>;
  verifyTransaction: (transactionId: string) => Promise<boolean>;
  addCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt' | 'raised'>) => Promise<Campaign>;
  updateCampaign: (id: string, updates: Partial<Omit<Campaign, 'id' | 'createdAt' | 'raised'>>) => Promise<Campaign>;
  deleteCampaign: (id: string) => Promise<void>;
  getUserCampaigns: (organizerId: string) => Campaign[];
  updateCampaignStatus: (id: string, status: 'pending' | 'approved' | 'rejected') => Promise<void>;
  flagContent: (type: 'campaign' | 'donation', id: string, reason: string) => Promise<void>;
  updateUserRole: (id: string, role: 'user' | 'admin') => Promise<void>;
  getFlaggedContent: () => Array<{type: 'campaign' | 'donation', id: string, reason: string}>;
  getUsers: () => User[];
  getCampaignsByStatus: (status: 'pending' | 'approved' | 'rejected') => Campaign[];
  getAnalyticsData: () => any;
}

// Sample users for demo
const sampleUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    avatar: '/placeholder.svg',
    emailVerified: true,
    provider: 'email',
    donationsCount: 5,
    totalDonated: 1200
  },
  {
    id: '2',
    name: 'Regular User',
    email: 'user@example.com',
    role: 'user',
    avatar: '/placeholder.svg',
    emailVerified: true,
    provider: 'email',
    donationsCount: 3,
    totalDonated: 450
  },
  {
    id: '3',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    avatar: '/placeholder.svg',
    emailVerified: false,
    provider: 'email',
    donationsCount: 1,
    totalDonated: 100
  },
  {
    id: '4',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    avatar: '/placeholder.svg',
    emailVerified: true,
    provider: 'google',
    donationsCount: 2,
    totalDonated: 300
  },
];

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [campaignData, setCampaignData] = useState<Campaign[]>(
    campaigns.map(campaign => ({
      ...campaign,
      status: campaign.featured ? 'approved' : 'pending'
    }))
  );
  const [donationData, setDonationData] = useState<Donation[]>(donations);
  const [userData, setUserData] = useState<User[]>(sampleUsers);
  const [flaggedContent, setFlaggedContent] = useState<Array<{type: 'campaign' | 'donation', id: string, reason: string}>>([]);

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

  // Get campaigns by status
  const getCampaignsByStatus = (status: 'pending' | 'approved' | 'rejected') => {
    return campaignData.filter(campaign => campaign.status === status);
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
      status: 'pending' // All new campaigns start as pending
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

  // Update campaign approval status
  const updateCampaignStatus = async (id: string, status: 'pending' | 'approved' | 'rejected') => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setCampaignData(prev => 
      prev.map(campaign => 
        campaign.id === id ? { ...campaign, status } : campaign
      )
    );
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

  // Flag content for moderation
  const flagContent = async (type: 'campaign' | 'donation', id: string, reason: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setFlaggedContent(prev => [...prev, { type, id, reason }]);
  };

  // Get all flagged content
  const getFlaggedContent = () => {
    return flaggedContent;
  };

  // Update user role
  const updateUserRole = async (id: string, role: 'user' | 'admin') => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setUserData(prev => 
      prev.map(user => 
        user.id === id ? { ...user, role } : user
      )
    );
  };

  // Get all users
  const getUsers = () => {
    return userData;
  };

  // Get analytics data
  const getAnalyticsData = () => {
    // In a real app, this would fetch analytics from a database
    // For demo purposes, we'll calculate some basic metrics
    
    const totalRaised = campaignData.reduce((total, campaign) => total + campaign.raised, 0);
    const totalDonors = new Set(donationData.map(d => d.userId || d.email)).size;
    const totalCampaigns = campaignData.length;
    const approvedCampaigns = campaignData.filter(c => c.status === 'approved').length;
    const pendingCampaigns = campaignData.filter(c => c.status === 'pending').length;
    const rejectedCampaigns = campaignData.filter(c => c.status === 'rejected').length;
    
    // Calculate monthly donations for the past 6 months
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);
    
    const monthlyDonations = Array(6).fill(0);
    
    donationData
      .filter(d => d.status === 'confirmed' && new Date(d.createdAt) >= sixMonthsAgo)
      .forEach(donation => {
        const donationDate = new Date(donation.createdAt);
        const monthIndex = (now.getMonth() - donationDate.getMonth() + 12) % 12;
        if (monthIndex < 6) {
          monthlyDonations[monthIndex] += donation.amount;
        }
      });
    
    // Get donation methods breakdown
    const donationMethods = donationData
      .filter(d => d.status === 'confirmed')
      .reduce((methods, donation) => {
        methods[donation.paymentMethod] = (methods[donation.paymentMethod] || 0) + donation.amount;
        return methods;
      }, {} as Record<string, number>);
    
    return {
      totalRaised,
      totalDonors,
      totalCampaigns,
      approvedCampaigns,
      pendingCampaigns,
      rejectedCampaigns,
      monthlyDonations: monthlyDonations.reverse(),
      donationMethods,
      categoryCounts: campaignData.reduce((counts, campaign) => {
        counts[campaign.category] = (counts[campaign.category] || 0) + 1;
        return counts;
      }, {} as Record<string, number>)
    };
  };

  return (
    <DataContext.Provider
      value={{
        campaigns: campaignData,
        donations: donationData,
        featuredCampaigns,
        users: userData,
        getCampaign,
        getCampaignDonations,
        addDonation,
        updateDonationStatus,
        verifyTransaction,
        addCampaign,
        updateCampaign,
        deleteCampaign,
        getUserCampaigns,
        updateCampaignStatus,
        flagContent,
        updateUserRole,
        getFlaggedContent,
        getUsers,
        getCampaignsByStatus,
        getAnalyticsData
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
