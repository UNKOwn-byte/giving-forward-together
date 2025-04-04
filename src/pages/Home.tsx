
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import CampaignCard from '../components/campaigns/CampaignCard';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';

const Home: React.FC = () => {
  const { featuredCampaigns, campaigns } = useData();
  const { user, isAuthenticated } = useAuth();
  
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-50 to-donation-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              {isAuthenticated && user ? (
                <h1 className="text-4xl md:text-5xl font-bold mb-6 hero-text-gradient">
                  Welcome back, {user.name}!
                </h1>
              ) : (
                <h1 className="text-4xl md:text-5xl font-bold mb-6 hero-text-gradient">
                  Make a Difference with Your Donation
                </h1>
              )}
              <p className="text-lg md:text-xl text-gray-700 mb-8">
                Support meaningful causes and help those in need. Your contribution, no matter how small, 
                can create a significant impact on someone's life.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-brand-500 hover:bg-brand-600">
                  <Link to="/campaigns">Explore Campaigns</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/how-it-works">How It Works</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-10">
              <img 
                src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070&auto=format&fit=crop" 
                alt="People donating" 
                className="rounded-lg shadow-xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Campaigns Section */}
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
      
      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Making a donation is simple, secure, and completely free using UPI payment.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mb-4 text-brand-600 font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-bold mb-3">Choose a Campaign</h3>
              <p className="text-gray-600">
                Browse through our campaigns and select the cause that resonates with you.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mb-4 text-brand-600 font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-bold mb-3">Make a Donation</h3>
              <p className="text-gray-600">
                Enter your donation amount and pay securely using any UPI app - Google Pay, PhonePe, or others.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mb-4 text-brand-600 font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-bold mb-3">Track Your Impact</h3>
              <p className="text-gray-600">
                Receive updates about how your donation is making a difference in the lives of others.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button variant="outline" asChild>
              <Link to="/how-it-works">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Impact Numbers Section */}
      <section className="py-16 bg-brand-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">₹{(campaigns.reduce((sum, campaign) => sum + campaign.raised, 0) / 100000).toFixed(1)}L+</div>
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
      
      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Donors Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our community of donors share their experiences and the impact of their contributions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-brand-600 font-bold">RS</span>
                </div>
                <div>
                  <h4 className="font-bold">Rahul Sharma</h4>
                  <p className="text-sm text-gray-500">Regular Donor</p>
                </div>
              </div>
              <p className="text-gray-600">
                "I've been donating to GivingForward for over a year now. The transparency and the impact updates really make me feel connected to the causes."
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-brand-600 font-bold">PP</span>
                </div>
                <div>
                  <h4 className="font-bold">Priya Patel</h4>
                  <p className="text-sm text-gray-500">First-time Donor</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The UPI payment option made donating so easy! I was able to contribute to a healthcare campaign within minutes. Will definitely donate again."
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-brand-600 font-bold">VK</span>
                </div>
                <div>
                  <h4 className="font-bold">Vivek Kumar</h4>
                  <p className="text-sm text-gray-500">Monthly Donor</p>
                </div>
              </div>
              <p className="text-gray-600">
                "I set up a monthly donation to an education campaign. It's rewarding to see regular updates about how my contributions are helping children access education."
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-donation-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Your contribution can change lives. Join our community of donors and be a part of something meaningful.
          </p>
          <Button asChild size="lg" className="bg-brand-500 hover:bg-brand-600">
            <Link to="/campaigns">Donate Now</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
