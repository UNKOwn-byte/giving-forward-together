
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { generateUPIPaymentURL } from '@/utils/donationUtils';
import { useAuth } from '@/context/AuthContext';
import { Separator } from '@/components/ui/separator';
import { QrCode } from 'lucide-react';

interface UpiPaymentProps {
  amount: number;
  campaignId: string;
  campaignTitle: string;
  onPaymentComplete: (transactionId: string) => void;
}

const UpiPayment: React.FC<UpiPaymentProps> = ({ 
  amount, 
  campaignId, 
  campaignTitle,
  onPaymentComplete
}) => {
  const [transactionId, setTransactionId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const payeeName = "GivingForward";
  const payeeVPA = "givingforward@upi"; // This would be your actual UPI ID in production
  const transactionNote = `Donation for ${campaignTitle}`;
  
  // Generate UPI URL for QR code and payment apps
  const upiUrl = generateUPIPaymentURL(payeeVPA, payeeName, amount, transactionNote);
  
  const handleUpiPayment = () => {
    // Open UPI URL - this will open the UPI app on mobile
    window.open(upiUrl, '_blank');
    
    // Set hasPaid to true to show the transaction ID input
    setHasPaid(true);
    
    toast({
      title: "UPI Payment Started",
      description: "After completing payment in your UPI app, please enter the transaction ID to confirm your donation.",
    });
  };
  
  const handleVerifyPayment = () => {
    if (!transactionId.trim()) {
      toast({
        title: "Transaction ID Required",
        description: "Please enter the transaction ID from your UPI payment.",
        variant: "destructive"
      });
      return;
    }
    
    setIsVerifying(true);
    
    // In a real implementation, this would call an API to verify the transaction
    // For now, we'll simulate a successful verification after a delay
    setTimeout(() => {
      onPaymentComplete(transactionId);
      setIsVerifying(false);
      
      toast({
        title: "Payment Verified",
        description: "Thank you for your donation! Your contribution will make a difference.",
      });
    }, 1500);
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Complete Your Donation</CardTitle>
        <CardDescription>
          Donate using any UPI app like Google Pay, PhonePe, or Paytm
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-4 bg-gray-50 rounded-md">
          <p className="text-gray-500 mb-2">Donation Amount</p>
          <p className="text-3xl font-bold">₹{amount}</p>
        </div>
        
        {!hasPaid ? (
          <div className="space-y-6">
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <div className="text-center mb-4">
                <h3 className="font-medium">Scan QR Code to Pay</h3>
                <p className="text-sm text-gray-500">Use any UPI app to scan</p>
              </div>
              
              <div className="bg-white p-2 rounded-lg shadow-sm mb-4">
                <img 
                  src="/lovable-uploads/0e866b3b-7842-4608-8637-076db158af57.png" 
                  alt="UPI QR Code" 
                  className="w-64 h-64 object-contain"
                />
              </div>
              
              <p className="text-xs text-center text-gray-500 mb-2">or</p>
              
              <Button 
                onClick={handleUpiPayment} 
                className="w-full bg-brand-500 hover:bg-brand-600"
                size="lg"
                type="button"
              >
                Open UPI App
              </Button>
            </div>
            
            <div className="flex items-center gap-4">
              <Separator className="flex-1" />
              <span className="text-sm text-gray-500">After Payment</span>
              <Separator className="flex-1" />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="transactionId" className="text-sm font-medium">
                UPI Transaction ID
              </label>
              <Input
                id="transactionId"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter transaction ID from your UPI app"
                required
              />
              <p className="text-xs text-gray-500">
                You can find this in your UPI app's transaction history
              </p>
            </div>
            
            <Button 
              onClick={handleVerifyPayment} 
              disabled={isVerifying || !transactionId.trim()}
              className="w-full"
              type="button"
            >
              {isVerifying ? 'Verifying...' : 'Verify Payment'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="transactionId" className="text-sm font-medium">
                UPI Transaction ID
              </label>
              <Input
                id="transactionId"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter transaction ID from your UPI app"
                required
              />
              <p className="text-xs text-gray-500">
                You can find this in your UPI app's transaction history
              </p>
            </div>
            
            <Button 
              onClick={handleVerifyPayment} 
              disabled={isVerifying}
              className="w-full"
              type="button"
            >
              {isVerifying ? 'Verifying...' : 'Verify Payment'}
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col text-center">
        <p className="text-xs text-gray-500">
          Your donation is secure and will directly support {campaignTitle}
        </p>
      </CardFooter>
    </Card>
  );
};

export default UpiPayment;
