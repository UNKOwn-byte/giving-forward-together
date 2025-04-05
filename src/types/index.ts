
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  emailVerified?: boolean;
  provider?: 'email' | 'google' | 'facebook';
  socialId?: string;
  level?: number;
  progress?: number;
  achievements?: string[];
  donationsCount?: number;
  totalDonated?: number;
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

export interface UserActivity {
  id: string;
  userId: string;
  type: 'donation' | 'comment' | 'like' | 'share' | 'campaign_creation';
  timestamp: string;
  data: Record<string, any>;
}

export interface UserAchievement {
  id: string;
  name: string;
  description: string;
  unlockedAt?: string;
  icon: string;
  progress?: number;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  donationAlerts: boolean;
  campaignUpdates: boolean;
  marketingEmails: boolean;
}
