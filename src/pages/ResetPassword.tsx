
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const resetPasswordSchema = z.object({
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const ResetPassword: React.FC = () => {
  const [isResetting, setIsResetting] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);
  const { confirmResetPassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  
  const handleSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    
    if (!token) {
      toast({
        title: "Error",
        description: "Reset token is missing. Please request a new password reset link.",
        variant: "destructive"
      });
      return;
    }
    
    setIsResetting(true);
    try {
      await confirmResetPassword(token, values.password);
      setResetComplete(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset password. The token may be invalid or expired.",
        variant: "destructive"
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
              <CardDescription className="text-center">
                {resetComplete ? 'Your password has been reset' : 'Create a new password for your account'}
              </CardDescription>
            </CardHeader>
            {resetComplete ? (
              <CardContent className="flex flex-col items-center justify-center space-y-4 pt-6">
                <div className="rounded-full bg-green-100 p-3">
                  <Lock className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-medium">Password Reset Complete</h3>
                  <p className="text-muted-foreground">
                    Your password has been reset successfully. You can now log in with your new password.
                  </p>
                </div>
                <Button 
                  className="w-full mt-4" 
                  onClick={() => navigate('/login')}
                >
                  Back to Login
                </Button>
              </CardContent>
            ) : (
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                              <Input 
                                type="password" 
                                placeholder="••••••••" 
                                className="pl-10"
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                              <Input 
                                type="password" 
                                placeholder="••••••••" 
                                className="pl-10"
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      disabled={isResetting}
                      className="w-full"
                    >
                      {isResetting ? 'Resetting...' : 'Reset Password'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            )}
            {!resetComplete && (
              <CardFooter>
                <div className="text-center w-full text-sm">
                  Remember your password?{' '}
                  <Link to="/login" className="text-brand-600 hover:text-brand-700 font-medium">
                    Login
                  </Link>
                </div>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ResetPassword;
