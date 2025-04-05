
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CallToAction: React.FC = () => {
  return (
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
  );
};

export default CallToAction;
