
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Smartphone, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

const TwoFactorAuth = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [setupStep, setSetupStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState('');
  const { toast } = useToast();
  
  // Mock QR code URL - in a real app this would come from the backend
  const qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/GivingForward:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=GivingForward';
  
  const handleStartSetup = () => {
    setIsSetupMode(true);
    setSetupStep(1);
  };
  
  const handleVerifyCode = () => {
    if (verificationCode.length === 6) {
      // In a real app, this would validate with the server
      toast({
        title: "Two-factor authentication enabled",
        description: "Your account is now more secure with 2FA.",
      });
      setIsEnabled(true);
      setIsSetupMode(false);
    } else {
      toast({
        title: "Invalid code",
        description: "Please enter a valid 6-digit code.",
        variant: "destructive",
      });
    }
  };
  
  const handleDisable2FA = () => {
    // In a real app, this would require password confirmation
    toast({
      title: "Two-factor authentication disabled",
      description: "2FA has been turned off for your account.",
    });
    setIsEnabled(false);
  };
  
  if (isEnabled && !isSetupMode) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
        
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle>Enabled</AlertTitle>
          <AlertDescription>
            Your account is protected with two-factor authentication.
          </AlertDescription>
        </Alert>
        
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h4 className="font-medium">Disable 2FA</h4>
            <p className="text-sm text-muted-foreground">
              Remove the extra security layer from your account
            </p>
          </div>
          <Button variant="outline" onClick={handleDisable2FA}>Disable</Button>
        </div>
        
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h4 className="font-medium">Recovery Codes</h4>
            <p className="text-sm text-muted-foreground">
              View or generate new backup codes
            </p>
          </div>
          <Button variant="outline">View Codes</Button>
        </div>
      </div>
    );
  }
  
  if (isSetupMode) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Set Up Two-Factor Authentication</h3>
        
        {setupStep === 1 && (
          <>
            <Alert>
              <Smartphone className="h-4 w-4" />
              <AlertTitle>Step 1: Download an authenticator app</AlertTitle>
              <AlertDescription>
                Download and install an authenticator app like Google Authenticator, 
                Microsoft Authenticator, or Authy on your mobile device.
              </AlertDescription>
            </Alert>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setIsSetupMode(false)}>
                Cancel
              </Button>
              <Button onClick={() => setSetupStep(2)}>
                Continue
              </Button>
            </div>
          </>
        )}
        
        {setupStep === 2 && (
          <>
            <Alert>
              <Smartphone className="h-4 w-4" />
              <AlertTitle>Step 2: Scan QR code</AlertTitle>
              <AlertDescription>
                Open your authenticator app and scan the QR code below.
              </AlertDescription>
            </Alert>
            
            <div className="flex justify-center py-4">
              <img
                src={qrCodeUrl}
                alt="Two-factor authentication QR code"
                className="w-48 h-48 border p-2 rounded-md"
              />
            </div>
            
            <p className="text-sm text-center text-muted-foreground">
              Can't scan the QR code? Use this code instead:
              <br />
              <span className="font-mono font-medium">JBSWY3DPEHPK3PXP</span>
            </p>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setSetupStep(1)}>
                Back
              </Button>
              <Button onClick={() => setSetupStep(3)}>
                Continue
              </Button>
            </div>
          </>
        )}
        
        {setupStep === 3 && (
          <>
            <Alert>
              <Smartphone className="h-4 w-4" />
              <AlertTitle>Step 3: Verify code</AlertTitle>
              <AlertDescription>
                Enter the 6-digit verification code shown in your authenticator app.
              </AlertDescription>
            </Alert>
            
            <div className="flex flex-col items-center space-y-4 py-4">
              <InputOTP maxLength={6} value={verificationCode} onChange={setVerificationCode}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setSetupStep(2)}>
                Back
              </Button>
              <Button onClick={handleVerifyCode}>
                Verify & Enable
              </Button>
            </div>
          </>
        )}
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Secure Your Account</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Add an extra layer of security by enabling two-factor authentication.
                This requires a verification code from your phone whenever you sign in.
              </p>
            </div>
            <Button onClick={handleStartSetup}>Enable 2FA</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TwoFactorAuth;
