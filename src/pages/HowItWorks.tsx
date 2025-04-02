
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';

const HowItWorks: React.FC = () => {
  return (
    <Layout>
      <div className="bg-gradient-to-r from-brand-50 to-donation-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6">How GivingForward Works</h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            GivingForward makes it easy to donate to causes you care about using your favorite UPI apps.
            Learn how the platform works and how your donations make a difference.
          </p>
        </div>
      </div>
      
      {/* Process Steps */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">The Donation Process</h2>
            
            <div className="space-y-16">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/3">
                  <div className="bg-brand-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto">
                    <span className="text-5xl font-bold text-brand-600">1</span>
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-2xl font-bold mb-3">Choose a Campaign</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Browse through our curated collection of verified campaigns across various categories 
                    like education, healthcare, environment, and more. Read the campaign details to 
                    understand the cause and the impact your donation will make.
                  </p>
                  <Link to="/campaigns" className="text-brand-600 hover:text-brand-700 font-medium">
                    Browse Campaigns →
                  </Link>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/3 md:order-last">
                  <div className="bg-donation-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto">
                    <span className="text-5xl font-bold text-donation-600">2</span>
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-2xl font-bold mb-3">Make a Donation</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Select your donation amount or enter a custom amount. All donations are processed 
                    securely through UPI, which means you can use Google Pay, PhonePe, Paytm, or any other 
                    UPI-enabled app to complete your payment. There are no transaction fees, so 100% of your 
                    donation goes to the cause.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/3">
                  <div className="bg-green-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto">
                    <span className="text-5xl font-bold text-green-600">3</span>
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-2xl font-bold mb-3">Confirm Your Payment</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    After completing the payment in your UPI app, return to GivingForward and enter the 
                    UPI transaction reference ID. This helps us confirm your donation and update the campaign's 
                    progress. You'll receive a confirmation email with details of your contribution.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/3 md:order-last">
                  <div className="bg-purple-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto">
                    <span className="text-5xl font-bold text-purple-600">4</span>
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-2xl font-bold mb-3">Track Your Impact</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Create an account to keep track of all your donations and receive updates on the campaigns 
                    you've supported. You'll be notified when the campaign reaches its goal and how your 
                    contribution has made a difference. Share the campaign with your friends and family to 
                    amplify your impact.
                  </p>
                  {/* Demo donation button */}
                  <Button asChild className="bg-brand-500 hover:bg-brand-600 mt-2">
                    <Link to="/campaigns">Make Your First Donation</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* UPI Payment Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">UPI Payment: Simple & Secure</h2>
            
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">How UPI Works with GivingForward</h3>
                  <ol className="list-decimal pl-5 space-y-3 text-gray-700">
                    <li>When you click "Donate Now", we generate a UPI payment link</li>
                    <li>The link opens your preferred UPI app (Google Pay, PhonePe, etc.)</li>
                    <li>Confirm the payment in your UPI app</li>
                    <li>Return to GivingForward and enter the transaction reference ID</li>
                    <li>Your donation is confirmed and the campaign progress is updated</li>
                  </ol>
                  
                  <div className="mt-6">
                    <h4 className="font-bold">Accepted UPI Apps:</h4>
                    <div className="flex flex-wrap gap-4 mt-3">
                      <div className="bg-gray-100 px-3 py-2 rounded-md text-sm">Google Pay</div>
                      <div className="bg-gray-100 px-3 py-2 rounded-md text-sm">PhonePe</div>
                      <div className="bg-gray-100 px-3 py-2 rounded-md text-sm">Paytm</div>
                      <div className="bg-gray-100 px-3 py-2 rounded-md text-sm">Amazon Pay</div>
                      <div className="bg-gray-100 px-3 py-2 rounded-md text-sm">BHIM</div>
                      <div className="bg-gray-100 px-3 py-2 rounded-md text-sm">Any UPI App</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-4">Benefits of UPI Donations</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-brand-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span><strong>Zero Transaction Fees:</strong> 100% of your donation goes to the cause</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-brand-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span><strong>Secure:</strong> UPI transactions are protected by multiple layers of security</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-brand-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span><strong>Instant:</strong> Donations are processed immediately</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-brand-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span><strong>Convenient:</strong> Use any UPI app you already have installed</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-brand-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span><strong>Transparent:</strong> Transaction IDs help maintain transparency</span>
                    </li>
                  </ul>
                  
                  <div className="bg-brand-50 p-4 rounded-md mt-6">
                    <p className="text-brand-800 text-sm">
                      <strong>Note:</strong> For security reasons, we verify all UPI payments manually by checking 
                      the transaction reference ID provided by you. This ensures the integrity of all donations 
                      on our platform.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold mb-2">Is my donation secure?</h3>
                <p className="text-gray-700">
                  Yes, all donations are processed securely through UPI, which uses multiple layers of 
                  security including encryption and two-factor authentication. Your payment information 
                  is never stored on our servers.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold mb-2">How do I know my donation reached the right place?</h3>
                <p className="text-gray-700">
                  When you donate, you'll receive a confirmation email with details of your contribution. 
                  You can also track the progress of the campaign on its page. We maintain complete 
                  transparency about how funds are being utilized by providing regular updates.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold mb-2">Are there any transaction fees?</h3>
                <p className="text-gray-700">
                  No, GivingForward doesn't charge any transaction fees. 100% of your donation goes to 
                  the cause you're supporting. We're able to do this by using UPI, which has minimal 
                  transaction costs compared to traditional payment gateways.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold mb-2">Can I donate anonymously?</h3>
                <p className="text-gray-700">
                  Yes, you have the option to make your donation anonymous during the donation process. 
                  Your name won't be displayed publicly, but we'll still need your email for sending the 
                  confirmation and updates.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold mb-2">How are campaigns verified?</h3>
                <p className="text-gray-700">
                  All campaigns on GivingForward go through a thorough verification process. We check 
                  the authenticity of the campaign creator, the legitimacy of the cause, and ensure 
                  that the funds will be used as stated. Only verified campaigns are listed on our platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-brand-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Start your giving journey today. Browse our campaigns and support causes that resonate with you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-brand-500 hover:bg-brand-600">
              <Link to="/campaigns">Browse Campaigns</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/register">Create an Account</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HowItWorks;
