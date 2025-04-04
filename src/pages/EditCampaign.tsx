
import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import CampaignForm from '../components/campaigns/CampaignForm';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const EditCampaign: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const { getCampaign } = useData();
  const [isLoading, setIsLoading] = useState(true);
  const [campaign, setCampaign] = useState(undefined);
  
  // Redirect if not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  useEffect(() => {
    if (id) {
      const campaignData = getCampaign(id);
      setCampaign(campaignData);
      setIsLoading(false);
    }
  }, [id, getCampaign]);
  
  // If user is not the creator of this campaign and not an admin, redirect
  if (!isLoading && campaign && campaign.organizer !== user?.id && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>
              {isLoading ? (
                <Skeleton className="h-8 w-48" />
              ) : (
                `Edit Campaign: ${campaign?.title || 'Not Found'}`
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : campaign ? (
              <CampaignForm campaignToEdit={campaign} isAdmin={user?.role === 'admin'} />
            ) : (
              <p className="text-center py-8 text-lg text-gray-600">
                Campaign not found or you don't have permission to edit it.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EditCampaign;
