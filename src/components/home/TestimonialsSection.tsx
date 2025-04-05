
import React from 'react';

const TestimonialsSection: React.FC = () => {
  return (
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
  );
};

export default TestimonialsSection;
