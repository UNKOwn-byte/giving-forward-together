
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
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
