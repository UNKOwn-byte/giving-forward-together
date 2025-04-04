
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useData } from '../context/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '../utils/donationUtils';
import { ArrowLeft } from 'lucide-react';

const SuccessStoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getSuccessStory, getCampaign, successStories } = useData();
  
  const story = id ? getSuccessStory(id) : undefined;
  
  // Get related campaign
  const campaign = story ? getCampaign(story.campaignId) : undefined;
  
  // Get other stories
  const otherStories = story ? 
    successStories.filter(s => s.id !== story.id).slice(0, 3) : [];
  
  if (!story) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Story Not Found</h1>
          <p className="mb-8">The success story you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/success-stories">View All Success Stories</Link>
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Link to="/success-stories" className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to All Success Stories
        </Link>
        
        {/* Header */}
        <div className="mb-10">
          <div className="text-gray-500 mb-2">{formatDate(story.createdAt)}</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-6">{story.title}</h1>
          
          <div className="w-full h-[400px] overflow-hidden rounded-lg mb-8">
            <img 
              src={story.image} 
              alt={story.title} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="prose max-w-none">
              {story.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-6">{paragraph}</p>
              ))}
            </div>
            
            {campaign && (
              <div className="mt-12 p-6 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">About the Original Campaign</h3>
                <p className="mb-4">{campaign.shortDescription}</p>
                <Button asChild>
                  <Link to={`/campaign/${campaign.id}`}>
                    View Original Campaign
                  </Link>
                </Button>
              </div>
            )}
            
            {/* Share */}
            <div className="mt-8">
              <Button variant="outline">
                Share This Story
              </Button>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-1/3">
            <div className="sticky top-24">
              <h3 className="text-xl font-bold mb-4">More Success Stories</h3>
              
              {otherStories.length > 0 ? (
                <div className="space-y-4">
                  {otherStories.map((otherStory) => (
                    <Card key={otherStory.id}>
                      <CardHeader className="p-4">
                        <div className="flex gap-4">
                          <img 
                            src={otherStory.image} 
                            alt={otherStory.title} 
                            className="w-24 h-24 object-cover rounded"
                          />
                          <div>
                            <CardTitle className="text-base">
                              <Link to={`/success-stories/${otherStory.id}`} className="hover:underline">
                                {otherStory.title}
                              </Link>
                            </CardTitle>
                            <div className="text-sm text-gray-500 mt-1">
                              {formatDate(otherStory.createdAt)}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No other stories available.</p>
              )}
              
              {/* Call to Action */}
              <Card className="mt-8 bg-gray-50 border-none">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-2">Start Your Own Campaign</h3>
                  <p className="text-gray-600 mb-4">
                    Ready to create your own success story? Start a campaign today.
                  </p>
                  <Button asChild className="w-full">
                    <Link to="/create-campaign">
                      Create a Campaign
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SuccessStoryDetail;
