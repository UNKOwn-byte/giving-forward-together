
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User } from '@/types';

interface HeroSectionProps {
  isAuthenticated: boolean;
  user: User | null;
}

const HeroSection: React.FC<HeroSectionProps> = ({ isAuthenticated, user }) => {
  return (
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
  );
};

export default HeroSection;
