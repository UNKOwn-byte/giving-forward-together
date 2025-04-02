
import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import CampaignCard from '../components/campaigns/CampaignCard';
import { useData } from '../context/DataContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Campaigns: React.FC = () => {
  const { campaigns } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Extract unique categories
  const categories = ['all', ...new Set(campaigns.map(campaign => campaign.category))];
  
  // Filter campaigns based on search term and category
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || campaign.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="bg-gradient-to-r from-brand-50 to-donation-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 text-center">Browse Campaigns</h1>
          <p className="text-lg text-gray-700 mb-8 text-center max-w-2xl mx-auto">
            Discover causes that need your support. Every donation makes a difference, no matter how small.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
            <Input
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow"
            />
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button onClick={() => { setSearchTerm(''); setCategoryFilter('all'); }}>
              Reset
            </Button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        {filteredCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCampaigns.map(campaign => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-2xl font-bold mb-4">No campaigns found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <Button onClick={() => { setSearchTerm(''); setCategoryFilter('all'); }}>
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Campaigns;
