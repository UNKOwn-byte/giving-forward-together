
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { DonationFormData } from '@/types';
import UpiPayment from '../payment/UpiPayment';

interface DonationFormProps {
  campaignId: string;
  campaignTitle: string;
  onDonationComplete?: () => void;
}

const DonationForm: React.FC<DonationFormProps> = ({ 
  campaignId, 
  campaignTitle,
  onDonationComplete
}) => {
  const { user, isAuthenticated } = useAuth();
  const { addDonation } = useData();
  const { toast } = useToast();
  
  const [amount, setAmount] = useState<number>(500);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  
  const [showPayment, setShowPayment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const suggestedAmounts = [100, 500, 1000, 5000];
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setAmount(value);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid donation amount.",
        variant: "destructive"
      });
      return;
    }
    
    if (!name.trim() || !email.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide your name and email.",
        variant: "destructive"
      });
      return;
    }
    
    // Show payment component
    setShowPayment(true);
  };
  
  const handlePaymentComplete = async (transactionId: string) => {
    setIsSubmitting(true);
    
    try {
      const donationData: Omit<DonationFormData, 'id'> = {
        amount,
        name,
        email,
        message,
        anonymous
      };
      
      await addDonation({
        campaignId,
        userId: user?.id,
        amount,
        name,
        email,
        message,
        anonymous,
        paymentMethod: 'upi',
        status: 'confirmed',
        transactionId
      });
      
      toast({
        title: "Donation Successful",
        description: "Thank you for your generous contribution!",
      });
      
      // Reset form
      setAmount(500);
      setMessage('');
      setAnonymous(false);
      setShowPayment(false);
      
      // Call the completion callback if provided
      if (onDonationComplete) {
        onDonationComplete();
      }
    } catch (error) {
      toast({
        title: "Donation Failed",
        description: "There was an error processing your donation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (showPayment) {
    return (
      <UpiPayment 
        amount={amount}
        campaignId={campaignId}
        campaignTitle={campaignTitle}
        onPaymentComplete={handlePaymentComplete}
      />
    );
  }
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Make a Donation</CardTitle>
        <CardDescription>
          Your contribution supports {campaignTitle}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium">
              Donation Amount (₹)
            </label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={handleAmountChange}
              min="1"
              required
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {suggestedAmounts.map((suggestedAmount) => (
                <Button
                  key={suggestedAmount}
                  type="button"
                  variant={amount === suggestedAmount ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAmount(suggestedAmount)}
                >
                  ₹{suggestedAmount}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Your Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              disabled={isAuthenticated}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              required
              disabled={isAuthenticated}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message (Optional)
            </label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share why you're donating..."
              rows={3}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="anonymous" 
              checked={anonymous}
              onCheckedChange={(checked) => setAnonymous(checked === true)}
            />
            <label
              htmlFor="anonymous"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Make my donation anonymous
            </label>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-brand-500 hover:bg-brand-600 mt-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DonationForm;
