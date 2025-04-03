
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatDate, calculateProgress } from '../utils/donationUtils';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const MyCampaigns: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { getUserCampaigns, deleteCampaign } = useData();
  const { toast } = useToast();
  
  // Redirect if not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  const userCampaigns = getUserCampaigns(user!.id);
  
  const handleDeleteCampaign = async (id: string) => {
    try {
      await deleteCampaign(id);
      toast({
        title: "Campaign deleted",
        description: "Your campaign has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete campaign. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Campaigns</h1>
          <Button asChild>
            <Link to="/create-campaign" className="flex items-center gap-2">
              <Plus size={16} />
              Create New Campaign
            </Link>
          </Button>
        </div>
        
        {userCampaigns.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-lg text-gray-600 mb-4">You haven't created any campaigns yet.</p>
              <Button asChild>
                <Link to="/create-campaign">Create Your First Campaign</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {userCampaigns.map(campaign => {
              const progress = calculateProgress(campaign.raised, campaign.goal);
              
              return (
                <Card key={campaign.id} className="overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-5">
                    <div className="md:col-span-1">
                      <img 
                        src={campaign.image} 
                        alt={campaign.title}
                        className="h-full w-full object-cover md:h-44"
                      />
                    </div>
                    <div className="p-6 md:col-span-4">
                      <div className="flex justify-between items-start mb-2">
                        <h2 className="text-xl font-bold">{campaign.title}</h2>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/edit-campaign/${campaign.id}`} className="flex items-center gap-1">
                              <Edit size={14} />
                              Edit
                            </Link>
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-red-500 border-red-500 hover:bg-red-50">
                                <Trash2 size={14} className="mr-1" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the campaign
                                  and all associated data.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteCampaign(campaign.id)}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{campaign.shortDescription}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-gray-500">Raised</span>
                          <p className="font-semibold">{formatCurrency(campaign.raised)}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Goal</span>
                          <p className="font-semibold">{formatCurrency(campaign.goal)}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">End Date</span>
                          <p className="font-semibold">
                            {campaign.endDate ? formatDate(campaign.endDate) : 'Ongoing'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">{Math.round(progress)}% Complete</span>
                          <span className="text-gray-600">
                            {formatCurrency(campaign.raised)} of {formatCurrency(campaign.goal)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-brand-500 h-2 rounded-full" 
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-end">
                        <Button variant="link" asChild>
                          <Link to={`/campaign/${campaign.id}`}>View Campaign Page</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyCampaigns;
