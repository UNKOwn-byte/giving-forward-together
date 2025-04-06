
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface SubscriptionCategory {
  id: string;
  title: string;
  description: string;
  subscribed: boolean;
  frequency: 'daily' | 'weekly' | 'monthly' | 'immediately';
  options: {
    id: string;
    title: string;
    description: string;
    subscribed: boolean;
  }[];
}

const EmailSubscriptions = () => {
  const { toast } = useToast();
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  
  const [subscriptions, setSubscriptions] = useState<SubscriptionCategory[]>([
    {
      id: 'campaigns',
      title: 'Campaign Updates',
      description: 'Updates about campaigns you support',
      subscribed: true,
      frequency: 'weekly',
      options: [
        {
          id: 'campaign-milestones',
          title: 'Campaign Milestones',
          description: 'Get notified when campaigns reach funding milestones',
          subscribed: true
        },
        {
          id: 'campaign-updates',
          title: 'Campaign Progress Updates',
          description: 'Weekly progress updates on campaigns you have donated to',
          subscribed: true
        },
        {
          id: 'campaign-completion',
          title: 'Campaign Completion',
          description: 'Notifications when campaigns you supported reach their goals',
          subscribed: true
        }
      ]
    },
    {
      id: 'community',
      title: 'Community Activity',
      description: 'Stay informed about community events and activities',
      subscribed: true,
      frequency: 'weekly',
      options: [
        {
          id: 'new-campaigns',
          title: 'New Campaigns',
          description: 'Get notified about new campaigns that match your interests',
          subscribed: true
        },
        {
          id: 'donation-opportunities',
          title: 'Featured Donation Opportunities',
          description: 'Curated donation opportunities you might be interested in',
          subscribed: false
        },
        {
          id: 'community-events',
          title: 'Community Events',
          description: 'Virtual and in-person events related to causes you support',
          subscribed: true
        }
      ]
    },
    {
      id: 'marketing',
      title: 'Marketing Communications',
      description: 'Promotional content and platform updates',
      subscribed: false,
      frequency: 'monthly',
      options: [
        {
          id: 'platform-news',
          title: 'Platform News & Features',
          description: 'Updates about new features and improvements',
          subscribed: false
        },
        {
          id: 'special-promotions',
          title: 'Special Promotions',
          description: 'Limited time offers and donation matching opportunities',
          subscribed: false
        },
        {
          id: 'partner-offers',
          title: 'Partner Offers',
          description: 'Special offers from our partners related to causes you care about',
          subscribed: false
        }
      ]
    }
  ]);
  
  const toggleCategory = (categoryId: string, value: boolean) => {
    setSubscriptions(subscriptions.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          subscribed: value,
          options: category.options.map(option => ({ ...option, subscribed: value }))
        };
      }
      return category;
    }));
  };
  
  const toggleOption = (categoryId: string, optionId: string, value: boolean) => {
    setSubscriptions(subscriptions.map(category => {
      if (category.id === categoryId) {
        const updatedOptions = category.options.map(option => 
          option.id === optionId ? { ...option, subscribed: value } : option
        );
        
        // If all options are subscribed, the category is considered subscribed
        const allSubscribed = updatedOptions.every(option => option.subscribed);
        
        return {
          ...category,
          subscribed: allSubscribed,
          options: updatedOptions
        };
      }
      return category;
    }));
  };
  
  const toggleCollapsible = (categoryId: string) => {
    setOpenCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };
  
  const handleSave = () => {
    toast({
      title: "Subscription preferences saved",
      description: "Your email subscription preferences have been updated.",
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Subscriptions</CardTitle>
        <CardDescription>
          Manage the types of emails you receive from us
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {subscriptions.map((category) => (
          <Collapsible 
            key={category.id} 
            open={openCategories.includes(category.id)}
            onOpenChange={() => toggleCollapsible(category.id)}
            className="border rounded-lg overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{category.title}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Switch 
                    checked={category.subscribed}
                    onCheckedChange={(value) => toggleCategory(category.id, value)}
                    className="data-[state=checked]:bg-primary"
                  />
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                      {openCategories.includes(category.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </div>
            </div>
            
            <CollapsibleContent>
              <Separator />
              <div className="p-4 space-y-4">
                {category.options.map((option) => (
                  <div key={option.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{option.title}</p>
                      <p className="text-xs text-muted-foreground">{option.description}</p>
                    </div>
                    <Switch 
                      checked={option.subscribed}
                      onCheckedChange={(value) => toggleOption(category.id, option.id, value)}
                      disabled={!category.subscribed}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
        
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Email Frequency Preferences</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Choose how often you'd like to receive our emails
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
            {['daily', 'weekly', 'monthly', 'only important'].map((frequency) => (
              <Button 
                key={frequency}
                variant={frequency === 'weekly' ? 'default' : 'outline'}
                className="text-sm"
              >
                {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave}>Save Preferences</Button>
      </CardFooter>
    </Card>
  );
};

export default EmailSubscriptions;
