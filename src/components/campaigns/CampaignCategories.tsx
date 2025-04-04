
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { CampaignCategory } from '../../types';
import { Card, CardContent } from '@/components/ui/card';

const CampaignCategories: React.FC = () => {
  const { campaignCategories } = useData();
  const navigate = useNavigate();
  
  const handleCategoryClick = (slug: string) => {
    navigate(`/campaigns?category=${slug}`);
  };
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {campaignCategories.map((category) => (
        <Card 
          key={category.id} 
          className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleCategoryClick(category.slug)}
        >
          <div className="h-28 relative">
            <img 
              src={category.image || 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31'} 
              alt={category.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
              <h3 className="font-medium text-sm">{category.name}</h3>
              {category.count !== undefined && (
                <div className="text-xs opacity-90">{category.count} campaigns</div>
              )}
            </div>
          </div>
          <CardContent className="p-3 hidden">
            <p className="text-xs text-gray-500 line-clamp-2">{category.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CampaignCategories;
