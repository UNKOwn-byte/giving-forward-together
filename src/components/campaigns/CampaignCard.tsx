
import React from 'react';
import { Link } from 'react-router-dom';
import { Campaign } from '../../types';
import { formatCurrency, calculateProgress, formatDate } from '../../utils/donationUtils';

interface CampaignCardProps {
  campaign: Campaign;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const progress = calculateProgress(campaign.raised, campaign.goal);
  
  return (
    <div className="donation-card rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={campaign.image} 
          alt={campaign.title} 
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute bottom-0 left-0 bg-brand-500 text-white px-3 py-1 font-semibold">
          {campaign.category}
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-bold mb-2 line-clamp-2">
          <Link to={`/campaign/${campaign.id}`} className="hover:text-brand-600 transition-colors">
            {campaign.title}
          </Link>
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {campaign.shortDescription}
        </p>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-gray-700">Raised: {formatCurrency(campaign.raised)}</span>
            <span className="font-medium text-gray-700">{Math.round(progress)}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            {campaign.endDate ? (
              <>Ends on: {formatDate(campaign.endDate)}</>
            ) : (
              <>Ongoing</>
            )}
          </div>
          
          <Link 
            to={`/campaign/${campaign.id}`}
            className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Donate Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
