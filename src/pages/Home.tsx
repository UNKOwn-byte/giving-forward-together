
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useData } from '../context/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import CampaignCategories from '../components/campaigns/CampaignCategories';
import { formatCurrency, formatDate, calculateProgress } from '../utils/donationUtils';

const Home = () => {
  const { 
    featuredCampaigns, 
    featuredBlogPosts, 
    featuredSuccessStories,
    campaignCategories 
  } = useData();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-brand-50 to-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Make a Difference Today
              </h1>
              <p className="text-xl mb-6 text-gray-600">
                Join our community of changemakers and support causes that matter. Every donation counts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link to="/campaigns">Donate Now</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/create-campaign">Start Fundraising</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433"
                alt="Fundraising"
                className="rounded-lg shadow-lg w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Campaigns Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Campaigns</h2>
            <Button variant="outline" asChild>
              <Link to="/campaigns">View All</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCampaigns.slice(0, 3).map((campaign) => (
              <Card key={campaign.id} className="flex flex-col h-full">
                <div className="h-48 relative">
                  <img
                    src={campaign.image}
                    alt={campaign.title}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                  {campaign.featured && (
                    <span className="absolute top-2 right-2 bg-brand-500 text-white text-xs py-1 px-2 rounded">
                      Featured
                    </span>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">
                    <Link to={`/campaign/${campaign.id}`} className="hover:text-brand-600">
                      {campaign.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {campaign.shortDescription}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{Math.round(calculateProgress(campaign.raised, campaign.goal))}% Complete</span>
                        <span>{formatCurrency(campaign.raised)} raised</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-brand-500 h-2 rounded-full"
                          style={{ width: `${Math.min(calculateProgress(campaign.raised, campaign.goal), 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {campaign.endDate
                        ? `Ends on ${formatDate(campaign.endDate)}`
                        : 'Ongoing campaign'}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link to={`/campaign/${campaign.id}`}>
                      View Campaign
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Browse by Category</h2>
          <CampaignCategories />
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Success Stories</h2>
            <Button variant="outline" asChild>
              <Link to="/success-stories">View All</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredSuccessStories.slice(0, 2).map((story) => (
              <Card key={story.id} className="overflow-hidden">
                <div className="md:flex h-full">
                  <div className="md:w-2/5">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="h-48 md:h-full w-full object-cover"
                    />
                  </div>
                  <div className="md:w-3/5 p-6 flex flex-col">
                    <CardTitle className="mb-2">{story.title}</CardTitle>
                    <CardDescription className="mb-4 line-clamp-3">
                      {story.content.split('\n\n')[0]}
                    </CardDescription>
                    <div className="mt-auto">
                      <Button variant="outline" asChild>
                        <Link to={`/success-stories/${story.id}`}>
                          Read Full Story
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Latest from Our Blog</h2>
            <Button variant="outline" asChild>
              <Link to="/blog">View All</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredBlogPosts.slice(0, 3).map((post) => (
              <Card key={post.id} className="overflow-hidden flex flex-col h-full">
                <div className="h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <div className="text-sm text-gray-500 mb-1">{formatDate(post.createdAt)}</div>
                  <CardTitle className="line-clamp-2">
                    <Link to={`/blog/${post.slug}`} className="hover:text-brand-600">
                      {post.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription className="line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" asChild className="text-brand-600 hover:text-brand-800 p-0">
                    <Link to={`/blog/${post.slug}`}>
                      Read More
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-brand-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Making a Difference Today</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Whether you want to donate to an existing cause or start your own fundraising campaign,
            you can make a positive impact right now.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/campaigns">Donate Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent text-white hover:bg-white hover:text-brand-600" asChild>
              <Link to="/create-campaign">Start a Campaign</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
