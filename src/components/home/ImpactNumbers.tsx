
import React from 'react';
import { Campaign } from '@/types';

interface ImpactNumbersProps {
  campaigns: Campaign[];
}

const ImpactNumbers: React.FC<ImpactNumbersProps> = ({ campaigns }) => {
  return (
    <section className="py-16 bg-brand-600 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl md:text-5xl font-bold mb-2">
              ₹{(campaigns.reduce((sum, campaign) => sum + campaign.raised, 0) / 100000).toFixed(1)}L+
            </div>
            <div className="text-lg">Funds Raised</div>
          </div>
          
          <div>
            <div className="text-4xl md:text-5xl font-bold mb-2">{campaigns.length}+</div>
            <div className="text-lg">Active Campaigns</div>
          </div>
          
          <div>
            <div className="text-4xl md:text-5xl font-bold mb-2">1000+</div>
            <div className="text-lg">Donors</div>
          </div>
          
          <div>
            <div className="text-4xl md:text-5xl font-bold mb-2">5+</div>
            <div className="text-lg">Categories</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactNumbers;
