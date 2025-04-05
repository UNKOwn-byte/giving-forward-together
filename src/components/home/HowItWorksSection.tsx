
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HowItWorksSection: React.FC = () => {
  return (
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
  );
};

export default HowItWorksSection;
