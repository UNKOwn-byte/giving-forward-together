
import { Campaign, Donation } from '../types';

export const campaigns: Campaign[] = [
  {
    id: '1',
    title: 'Education for Underprivileged Children',
    shortDescription: 'Help us provide quality education to children who cannot afford it.',
    description: 'Every child deserves an education. Our mission is to provide quality education to children from underprivileged backgrounds, giving them the tools they need to build a better future. Your donation will help us purchase books, school supplies, and cover tuition fees for these deserving children. Together, we can make a difference in their lives and break the cycle of poverty through education.',
    goal: 500000,
    raised: 320000,
    category: 'Education',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop',
    endDate: '2023-12-31',
    createdAt: '2023-01-15',
    organizer: 'Education For All Foundation',
    featured: true
  },
  {
    id: '2',
    title: 'Medical Aid for Rural Communities',
    shortDescription: 'Support our healthcare initiatives in remote villages with limited medical access.',
    description: 'Many rural communities lack access to basic healthcare services. Our medical outreach program aims to bridge this gap by bringing essential healthcare services to these remote areas. Your donation will fund mobile medical camps, medicine distribution, and basic health education. Help us ensure that everyone, regardless of where they live, has access to the healthcare they deserve.',
    goal: 750000,
    raised: 420000,
    category: 'Healthcare',
    image: 'https://images.unsplash.com/photo-1530490125459-847a6d437825?q=80&w=2069&auto=format&fit=crop',
    endDate: '2023-11-30',
    createdAt: '2023-02-20',
    organizer: 'Rural Health Initiative',
    featured: true
  },
  {
    id: '3',
    title: 'Clean Water Project',
    shortDescription: 'Help us provide clean drinking water to communities facing water scarcity.',
    description: 'Access to clean water is a basic human right, yet millions of people around the world lack this essential resource. Our Clean Water Project aims to install water purification systems and dig wells in areas suffering from water scarcity. Your contribution will directly impact the health and well-being of entire communities, reducing waterborne diseases and improving overall quality of life.',
    goal: 600000,
    raised: 350000,
    category: 'Environment',
    image: 'https://images.unsplash.com/photo-1526749837599-b4eba9fd855e?q=80&w=2070&auto=format&fit=crop',
    endDate: '2023-10-31',
    createdAt: '2023-03-10',
    organizer: 'Water For Life',
    featured: true
  },
  {
    id: '4',
    title: 'Women Empowerment Initiative',
    shortDescription: 'Support skill development and entrepreneurship programs for underprivileged women.',
    description: 'Economic independence is key to empowering women in marginalized communities. Our initiative focuses on providing vocational training, microloans, and mentorship to women from underprivileged backgrounds. By equipping them with skills and resources, we aim to help them become financially independent and contribute to their families and communities. Your donation will fund training programs, equipment, and seed capital for small businesses.',
    goal: 400000,
    raised: 180000,
    category: 'Women Empowerment',
    image: 'https://images.unsplash.com/photo-1573497019236-61f323342eb4?q=80&w=2070&auto=format&fit=crop',
    endDate: '2023-12-15',
    createdAt: '2023-04-05',
    organizer: 'Women for Change',
    featured: false
  },
  {
    id: '5',
    title: 'Disaster Relief Fund',
    shortDescription: 'Help us provide immediate assistance to victims of natural disasters.',
    description: 'When disasters strike, immediate response is crucial to save lives and provide relief. Our Disaster Relief Fund aims to mobilize quickly in case of emergencies like floods, earthquakes, and other natural calamities. Your donation will help us stock emergency supplies, set up temporary shelters, and provide food and medical aid to affected populations. By contributing, you become part of our emergency response team, ready to help those in dire need.',
    goal: 1000000,
    raised: 650000,
    category: 'Disaster Relief',
    image: 'https://images.unsplash.com/photo-1573152958734-1922c188fba3?q=80&w=2070&auto=format&fit=crop',
    endDate: '2023-12-31',
    createdAt: '2023-01-30',
    organizer: 'Rapid Relief Network',
    featured: false
  },
  {
    id: '6',
    title: 'Animal Welfare Project',
    shortDescription: 'Support our efforts to rescue and rehabilitate abandoned and injured animals.',
    description: 'Abandoned and injured animals need our help and compassion. Our Animal Welfare Project is dedicated to rescuing, treating, and finding loving homes for these vulnerable creatures. Your donation will cover veterinary care, shelter maintenance, food, and rescue operations. Together, we can give these animals a second chance at life and help them find the love and care they deserve.',
    goal: 300000,
    raised: 120000,
    category: 'Animal Welfare',
    image: 'https://images.unsplash.com/photo-1581888227599-779811939961?q=80&w=2074&auto=format&fit=crop',
    endDate: '2023-11-15',
    createdAt: '2023-05-12',
    organizer: 'Animal Rescue Foundation',
    featured: false
  }
];

export const donations: Donation[] = [
  {
    id: '1',
    campaignId: '1',
    userId: '2',
    amount: 5000,
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    message: 'Education is the most powerful weapon we can use to change the world.',
    transactionId: 'UPI123456789',
    status: 'confirmed',
    paymentMethod: 'upi',
    createdAt: '2023-05-20T10:30:00Z',
    anonymous: false
  },
  {
    id: '2',
    campaignId: '1',
    amount: 10000,
    name: 'Anonymous',
    email: 'anonymous@example.com',
    status: 'confirmed',
    paymentMethod: 'upi',
    transactionId: 'UPI987654321',
    createdAt: '2023-05-22T14:45:00Z',
    anonymous: true
  },
  {
    id: '3',
    campaignId: '2',
    userId: '2',
    amount: 7500,
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    message: 'Health is wealth. Happy to contribute to this noble cause.',
    transactionId: 'UPI456789123',
    status: 'confirmed',
    paymentMethod: 'upi',
    createdAt: '2023-05-25T09:15:00Z',
    anonymous: false
  },
  {
    id: '4',
    campaignId: '3',
    amount: 3000,
    name: 'Vijay Kumar',
    email: 'vijay.kumar@example.com',
    status: 'confirmed',
    paymentMethod: 'upi',
    transactionId: 'UPI789123456',
    createdAt: '2023-05-28T16:20:00Z',
    anonymous: false
  },
  {
    id: '5',
    campaignId: '1',
    amount: 1000,
    name: 'Anonymous',
    email: 'anonymous2@example.com',
    status: 'confirmed',
    paymentMethod: 'upi',
    transactionId: 'UPI321654987',
    createdAt: '2023-06-01T11:10:00Z',
    anonymous: true
  }
];
