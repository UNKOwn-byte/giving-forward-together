export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  emailVerified?: boolean;
  provider?: 'email' | 'google' | 'facebook';
  socialId?: string;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  goal: number;
  raised: number;
  category: string;
  image: string;
  endDate?: string;
  createdAt: string;
  organizer: string;
  featured?: boolean;
}

export interface Donation {
  id: string;
  campaignId: string;
  userId?: string;
  amount: number;
  name: string;
  email: string;
  message?: string;
  transactionId?: string;
  status: 'pending' | 'confirmed' | 'failed';
  paymentMethod: 'upi' | 'card' | 'other';
  createdAt: string;
  anonymous: boolean;
}

export interface DonationFormData {
  amount: number;
  name: string;
  email: string;
  message?: string;
  anonymous: boolean;
}

// Blog Post Type
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image: string;
  author: string;
  authorImage?: string;
  category: string;
  tags: string[];
  createdAt: string;
  featured?: boolean;
}

// Success Story Type
export interface SuccessStory {
  id: string;
  title: string;
  campaignId: string;
  content: string;
  image: string;
  createdAt: string;
  featured?: boolean;
}

// FAQ Item Type
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

// Campaign Update/Milestone Type
export interface CampaignUpdate {
  id: string;
  campaignId: string;
  title: string;
  content: string;
  image?: string;
  createdAt: string;
  isMilestone: boolean;
  milestoneTarget?: number;
}

// Campaign Comment Type
export interface CampaignComment {
  id: string;
  campaignId: string;
  userId: string;
  userName: string;
  userImage?: string;
  content: string;
  createdAt: string;
  parentId?: string; // For reply functionality
}

// Campaign Category Type (expanded)
export interface CampaignCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  count?: number; // Number of campaigns in this category
}
