
import React from 'react';
import Layout from '../components/layout/Layout';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

// Import the new components
import HeroSection from '../components/home/HeroSection';
import FeaturedCampaigns from '../components/home/FeaturedCampaigns';
import HowItWorksSection from '../components/home/HowItWorksSection';
import ImpactNumbers from '../components/home/ImpactNumbers';
import TestimonialsSection from '../components/home/TestimonialsSection';
import CallToAction from '../components/home/CallToAction';

const Home: React.FC = () => {
  const { featuredCampaigns, campaigns } = useData();
  const { user, isAuthenticated } = useAuth();
  
  return (
    <Layout>
      <HeroSection isAuthenticated={isAuthenticated} user={user} />
      <FeaturedCampaigns featuredCampaigns={featuredCampaigns} />
      <HowItWorksSection />
      <ImpactNumbers campaigns={campaigns} />
      <TestimonialsSection />
      <CallToAction />
    </Layout>
  );
};

export default Home;
