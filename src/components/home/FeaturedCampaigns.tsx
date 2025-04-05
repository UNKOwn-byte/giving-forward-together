
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CampaignCard from '../campaigns/CampaignCard';
import { Campaign } from '@/types';

interface FeaturedCampaignsProps {
  featuredCampaigns: Campaign[];
}

const FeaturedCampaigns: React.FC<FeaturedCampaignsProps> = ({ featuredCampaigns }) => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Campaigns</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            These campaigns need your immediate attention. Your support can make a real difference.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCampaigns.map(campaign => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button asChild>
            <Link to="/campaigns">View All Campaigns</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCampaigns;
