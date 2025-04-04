
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Check, AlertCircle } from 'lucide-react';

const VerifyEmail: React.FC = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { verifyEmail, sendVerificationEmail, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyEmailWithToken = async () => {
      const searchParams = new URLSearchParams(location.search);
      const token = searchParams.get('token');
      
      if (!token) return;
      
      setIsVerifying(true);
      try {
        await verifyEmail(token);
        setVerified(true);
        setError(null);
      } catch (error) {
        setError('Invalid or expired verification token. Please request a new verification link.');
      } finally {
        setIsVerifying(false);
      }
    };
    
    verifyEmailWithToken();
  }, [location.search, verifyEmail]);

  const handleResendVerification = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      await sendVerificationEmail(user.email);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend verification email. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Email Verification</CardTitle>
              <CardDescription className="text-center">
                {isVerifying ? 'Verifying your email...' : verified ? 'Your email has been verified' : 'Verify your email address'}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-4 pt-6">
              {isVerifying ? (
                <div className="flex flex-col items-center space-y-4">
                  <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
                  <p className="text-center text-muted-foreground">Please wait while we verify your email...</p>
                </div>
              ) : verified ? (
                <div className="flex flex-col items-center space-y-4">
                  <div className="rounded-full bg-green-100 p-3">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-medium">Email Successfully Verified</h3>
                    <p className="text-muted-foreground">
                      Thank you for verifying your email address. You now have full access to all features.
                    </p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center space-y-4">
                  <div className="rounded-full bg-red-100 p-3">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-medium">Verification Failed</h3>
                    <p className="text-muted-foreground">{error}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-4">
                  <div className="rounded-full bg-blue-100 p-3">
                    <Mail className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-medium">Check Your Email</h3>
                    <p className="text-muted-foreground">
                      We've sent a verification link to your email address. Click the link to verify your email.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-3">
              {verified ? (
                <Button 
                  className="w-full" 
                  onClick={() => navigate('/')}
                >
                  Continue to Homepage
                </Button>
              ) : error ? (
                <Button 
                  className="w-full" 
                  onClick={handleResendVerification}
                >
                  Resend Verification Email
                </Button>
              ) : (
                <Button 
                  className="w-full" 
                  onClick={handleResendVerification}
                >
                  Resend Verification Email
                </Button>
              )}
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate('/login')}
              >
                Back to Login
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default VerifyEmail;
