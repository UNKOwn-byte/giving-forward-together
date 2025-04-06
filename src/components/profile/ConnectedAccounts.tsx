
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../../context/AuthContext';
import { Check, X } from 'lucide-react';

interface SocialAccount {
  provider: 'google' | 'facebook' | 'twitter' | 'apple';
  name: string;
  connected: boolean;
  email?: string;
  icon: string;
}

const ConnectedAccounts = () => {
  const { toast } = useToast();
  const { socialLogin } = useAuth();
  
  // This would come from user data in a real app
  const [accounts, setAccounts] = useState<SocialAccount[]>([
    {
      provider: 'google',
      name: 'Google',
      connected: false,
      icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWdvb2dsZSI+PHBhdGggZD0iTTEyIDIyYzUuNTIzIDAgMTAtNC40NzcgMTAtMTBTMTcuNTIzIDIgMTIgMiAyIDYuNDc3IDIgMTJzNC40NzcgMTAgMTAgMTB6Ij48L3BhdGg+PHBhdGggZD0iTTE5LjY3IDEzLjA3YTguNTMgOC41MyAwIDAgMC0uMjUtMi4wNEgxMnYzLjg1aDQuMjZhMy42NSAzLjY1IDAgMCAxLTEuNTggMi4zOWwyLjU3IDEuOThhOC4wOCA4LjA4IDAgMCAwIDIuNDUtNS44MloiPjwvcGF0aD48cGF0aCBkPSJNMTIgMTkuOGEyLjIxIDIuMjEgMCAwIDAgLjEyLS4xdi0uMDRsLjE2LS4xNi4yOS0uMjYuMjYtLjI3YTcuMDQgNy4wNCAwIDAgMCAxLjg2LTMuMDZINy41OXYtMi44NmgxMC4xM2M1LjYyIDcuOS01LjEgMTIuODItMTAuMTMgNi44NXoiPjwvcGF0aD48cGF0aCBkPSJNNy41OSAxMC4xMWgyLjkxdjIuODZINy41OXptNi40OCA1LjE0Yy0uNi41OS0xLjI5IDEuMDctMi4wNiAxLjQ0YTYuOTggNi45OCAwIDAgMS01Ljk5LS4wMSA2Ljg4IDYuODggMCAwIDEtNC4wNC00LjQ1IDYuOTEgNi45MSAwIDAgMSAwLTQuMjdBNi44OSA2Ljg5IDAgMCAxIDYuMDIgMy42YTYuOTggNi45OCAwIDAgMSA1Ljk3LS4wM2MuNzguMzcgMS40OS44OCAxLjEzIDEuNjNsLTMuMjEgMy4yMSAzLjczIDMuNzVjLjU4LjU5LjU1IDEuNjIuNDMgMy4wOXoiPjwvcGF0aD48L3N2Zz4='
    },
    {
      provider: 'facebook',
      name: 'Facebook',
      connected: false,
      icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWZhY2Vib29rIj48cGF0aCBkPSJNMTggMmgtM2E1IDUgMCAwIDAtNSA1djNIN3Y0aDN2OGg0di04aDNsMS00aC00VjdhMSAxIDAgMCAxIDEtMWgzeiI+PC9wYXRoPjwvc3ZnPg=='
    },
    {
      provider: 'twitter',
      name: 'Twitter',
      connected: false,
      icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXR3aXR0ZXIiPjxwYXRoIGQ9Ik0yMiA0cy0uNyAyLjEtMiAzLjRjMS42IDEwLTkuNCAxNy4zLTE4IDExLjYgMi4yLjEgNC40LS42IDYtMi0zLS4zLTUuMi0yLjEtNi01IDEgLjEgMiAwIDMtLjUtMy4yLTEtNS4zLTMuNi01LjMtNi45IDEgLjYgMiAuOSAzLjIgMUM0LjYgNC4zIDQuMiAyLjUgNC42LjggNi4yIDIuNyA4LjUgNCAxMS40IDQuMyAxMS4yIDMuMyAxMS41IDIgMTIuMiAxLjJjMi4zLTIuNiA2LjItLjUgNi41IDIuNyA1LjEgMCA2LjMgMy4zIDMuMyAweiI+PC9wYXRoPjwvc3ZnPg=='
    },
    {
      provider: 'apple',
      name: 'Apple',
      connected: false,
      icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWFwcGxlIj48cGF0aCBkPSJNMTIgMTkhMUMYyA2IDcgOC41IDcgOC41UzQgMTAuNSA0IDE0LjVTNiAxOSA4IDE5SDEyIj48L3BhdGg+PHBhdGggZD0iTTEyIDE5aDRjMiAwIDQtMi41IDQtNC41Uzk2IDE0LjUgOTYgMTguNVM5NCAxOSA5MiAxOUg4OCI+PC9wYXRoPjxwYXRoIGQ9Ik0xNiA5YzAtMS42NiAxLTMgMy00IDAtMi05LTQtOS0xIDAtMS42NiAxLTMgMy00IDAtMi05LTQtOS0xIDAgMi0zIDYtMyA4LjVsLjA4LjA5IiBmaWxsPSJ0cmFuc3BhcmVudCI+PC9wYXRoPjxwYXRoIGQ9Ik05IDcuNWMwLS45NyA0Ljc2LTMuNSA3Ljg5LTMuNUMxOS4yNiA0IDIxIDcgMjEgOWMwIDNcclrnYXRlIDAgMiAxICI+PC9wYXRoPjwvc3ZnPg=='
    }
  ]);
  
  const handleConnect = async (provider: 'google' | 'facebook' | 'twitter' | 'apple') => {
    try {
      // This would use the real OAuth flow in a production app
      if (provider === 'google' || provider === 'facebook') {
        await socialLogin(provider);
        
        setAccounts(accounts.map(account => 
          account.provider === provider 
            ? { 
                ...account, 
                connected: true,
                email: `user@${provider}.com` 
              } 
            : account
        ));
        
        toast({
          title: "Account connected",
          description: `Your ${provider} account has been connected successfully.`,
        });
      } else {
        toast({
          title: "Not implemented",
          description: `${provider} login is not available in this demo.`,
        });
      }
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "There was an error connecting your account.",
        variant: "destructive",
      });
    }
  };
  
  const handleDisconnect = (provider: string) => {
    setAccounts(accounts.map(account => 
      account.provider === provider 
        ? { ...account, connected: false, email: undefined } 
        : account
    ));
    
    toast({
      title: "Account disconnected",
      description: `Your ${provider} account has been disconnected.`,
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Accounts</CardTitle>
        <CardDescription>
          Connect your social media accounts for easier login
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {accounts.map((account) => (
          <div 
            key={account.provider}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 mr-4">
                <img 
                  src={account.icon} 
                  alt={account.name}
                  className="w-5 h-5"
                />
              </div>
              <div>
                <h4 className="font-medium">{account.name}</h4>
                {account.connected ? (
                  <div className="flex items-center text-sm text-green-600">
                    <Check className="mr-1 h-3 w-3" />
                    <span>Connected</span>
                    {account.email && (
                      <span className="text-muted-foreground ml-1">({account.email})</span>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Not connected</p>
                )}
              </div>
            </div>
            
            {account.connected ? (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDisconnect(account.provider)}
              >
                Disconnect
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleConnect(account.provider as 'google' | 'facebook')}
              >
                Connect
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ConnectedAccounts;
