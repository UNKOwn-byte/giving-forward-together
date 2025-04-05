
import React from 'react';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { HeartHandshake, Users, Globe, Shield } from 'lucide-react';

const AboutUs = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About GivingForward</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're on a mission to connect compassionate donors with meaningful causes
            and help create positive change around the world.
          </p>
        </div>

        {/* Hero section */}
        <div className="bg-brand-50 rounded-lg p-8 mb-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Story</h2>
              <p className="mb-4">
                GivingForward was founded in 2023 with a simple yet powerful vision: to create a platform where anyone can make a difference, regardless of their resources.
              </p>
              <p className="mb-6">
                We believe in the collective power of community and that even small contributions can lead to significant impact when people come together for a common cause.
              </p>
              {!isAuthenticated && (
                <div className="flex flex-wrap gap-4">
                  <Button asChild size="lg">
                    <Link to="/register">Join Our Community</Link>
                  </Button>
                  <Button variant="outline" asChild size="lg">
                    <Link to="/campaigns">Browse Campaigns</Link>
                  </Button>
                </div>
              )}
            </div>
            <div className="order-first md:order-last">
              <img 
                src="https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80" 
                alt="GivingForward Team" 
                className="rounded-lg shadow-lg w-full h-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "https://images.unsplash.com/photo-1493962853295-0fd70327578a?auto=format&fit=crop&w=800&q=80";
                }}
              />
            </div>
          </div>
        </div>

        {/* Values section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 bg-brand-100 rounded-full">
                    <HeartHandshake className="h-8 w-8 text-brand-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center mb-2">Compassion</h3>
                <p className="text-center text-muted-foreground">
                  We lead with empathy and care in everything we do, putting people at the heart of our mission.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 bg-brand-100 rounded-full">
                    <Shield className="h-8 w-8 text-brand-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center mb-2">Integrity</h3>
                <p className="text-center text-muted-foreground">
                  We uphold the highest standards of honesty, transparency, and accountability.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 bg-brand-100 rounded-full">
                    <Users className="h-8 w-8 text-brand-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center mb-2">Community</h3>
                <p className="text-center text-muted-foreground">
                  We believe in the power of collective action and foster a sense of belonging.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 bg-brand-100 rounded-full">
                    <Globe className="h-8 w-8 text-brand-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center mb-2">Impact</h3>
                <p className="text-center text-muted-foreground">
                  We are dedicated to creating measurable, sustainable change in communities worldwide.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA section */}
        <div className="bg-brand-600 text-white rounded-lg p-8 text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-xl mb-6 max-w-2xl mx-auto">
            Whether you're looking to donate to a cause or start your own fundraising campaign, 
            GivingForward is here to help you create positive change.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/campaigns">Explore Campaigns</Link>
            </Button>
            {isAuthenticated ? (
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-brand-600" asChild>
                <Link to="/create-campaign">Start a Campaign</Link>
              </Button>
            ) : (
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-brand-600" asChild>
                <Link to="/register">Join Now</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Team section could be added here */}
        
        {/* Contact section or additional information */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center mb-8">Get in Touch</h2>
          <div className="max-w-2xl mx-auto text-center">
            <p className="mb-4">
              Have questions or want to learn more about how you can get involved? 
              We'd love to hear from you!
            </p>
            <p className="mb-6">
              Email us at <a href="mailto:contact@givingforward.org" className="text-brand-600 hover:underline">contact@givingforward.org</a> 
              or fill out our <a href="#" className="text-brand-600 hover:underline">contact form</a>.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutUs;
