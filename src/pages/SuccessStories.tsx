
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useData } from '../context/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '../utils/donationUtils';

const SuccessStories: React.FC = () => {
  const { successStories, featuredSuccessStories } = useData();
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold">Success Stories</h1>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Discover how our fundraising platform has helped transform ideas into reality
            and made a positive impact on communities and individuals worldwide.
          </p>
        </div>
        
        {/* Featured Success Stories */}
        {featuredSuccessStories.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-6">Featured Stories</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredSuccessStories.map((story) => (
                <Card key={story.id} className="overflow-hidden flex flex-col h-full">
                  <div className="h-64 overflow-hidden">
                    <img 
                      src={story.image} 
                      alt={story.title} 
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <div className="text-sm text-gray-500 mb-2">{formatDate(story.createdAt)}</div>
                    <CardTitle className="text-2xl">{story.title}</CardTitle>
                    <CardDescription className="line-clamp-3 text-base mt-2">
                      {story.content.split('\n\n')[0]}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow"></CardContent>
                  <CardFooter>
                    <Button asChild>
                      <Link to={`/success-stories/${story.id}`}>
                        Read Full Story
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {/* All Success Stories */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">All Success Stories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {successStories
              .filter(story => !featuredSuccessStories.some(featured => featured.id === story.id))
              .map((story) => (
                <Card key={story.id} className="overflow-hidden flex flex-col h-full">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={story.image} 
                      alt={story.title} 
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <div className="text-sm text-gray-500 mb-1">{formatDate(story.createdAt)}</div>
                    <CardTitle>{story.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription className="line-clamp-3">
                      {story.content.split('\n\n')[0]}
                    </CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" asChild className="w-full">
                      <Link to={`/success-stories/${story.id}`}>
                        Read More
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
          
          {successStories.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold">No Success Stories Yet</h3>
              <p className="text-gray-500 mt-2">
                Check back soon for inspiring stories from our community.
              </p>
            </div>
          )}
        </div>
        
        {/* Call to Action */}
        <div className="mt-16 bg-gray-50 p-8 md:p-12 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Have a Success Story to Share?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            If you've successfully completed a fundraising campaign on our platform and want to
            share your journey with our community, we'd love to hear from you!
          </p>
          <Button size="lg" asChild>
            <Link to="/share-your-story">Share Your Story</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default SuccessStories;
