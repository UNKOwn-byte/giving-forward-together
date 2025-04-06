
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { formatCurrency, formatDate } from '@/utils/donationUtils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, XCircle, AlertCircle, Eye, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CampaignModeration: React.FC = () => {
  const { campaigns, getCampaignsByStatus, updateCampaignStatus } = useData();
  const { toast } = useToast();
  const [rejectionReason, setRejectionReason] = useState('');
  const [campaignToReject, setCampaignToReject] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const pendingCampaigns = getCampaignsByStatus('pending');
  const approvedCampaigns = getCampaignsByStatus('approved');
  const rejectedCampaigns = getCampaignsByStatus('rejected');

  const filteredPendingCampaigns = pendingCampaigns.filter(campaign =>
    campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApproveCampaign = async (id: string) => {
    try {
      await updateCampaignStatus(id, 'approved');
      toast({
        title: 'Campaign approved',
        description: 'The campaign has been approved and is now public.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve campaign. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const openRejectDialog = (id: string) => {
    setCampaignToReject(id);
    setRejectionReason('');
  };

  const handleRejectCampaign = async () => {
    if (!campaignToReject) return;

    try {
      await updateCampaignStatus(campaignToReject, 'rejected');
      toast({
        title: 'Campaign rejected',
        description: 'The campaign has been rejected and is not visible to the public.',
      });
      setCampaignToReject(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject campaign. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Approval Workflow</CardTitle>
        <CardDescription>
          Review and moderate campaigns before they appear publicly on the platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pending">
          <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              Pending
              {pendingCampaigns.length > 0 && (
                <Badge variant="outline">{pendingCampaigns.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <div className="mb-4">
              <Input
                placeholder="Search pending campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>

            {filteredPendingCampaigns.length > 0 ? (
              <div className="space-y-8">
                {filteredPendingCampaigns.map(campaign => (
                  <div key={campaign.id} className="border rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between flex-col sm:flex-row gap-4">
                      <div className="flex gap-4 items-start">
                        <div className="h-24 w-24 rounded overflow-hidden">
                          <img 
                            src={campaign.image} 
                            alt={campaign.title} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">{campaign.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{campaign.shortDescription}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Badge variant="outline">{campaign.category}</Badge>
                            <Badge variant="outline">{formatCurrency(campaign.goal)} goal</Badge>
                            <Badge variant="outline">Created: {formatDate(campaign.createdAt)}</Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button 
                          asChild
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Link to={`/campaign/${campaign.id}`}>
                            <Eye className="h-4 w-4" />
                            Preview
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 text-green-600 border-green-600 hover:bg-green-50"
                          onClick={() => handleApproveCampaign(campaign.id)}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => openRejectDialog(campaign.id)}
                        >
                          <XCircle className="h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-md">
                <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">No pending campaigns</h3>
                <p className="mt-2 text-muted-foreground">
                  There are no campaigns awaiting approval at this time.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="approved">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Goal</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvedCampaigns.length > 0 ? (
                  approvedCampaigns.map(campaign => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.title}</TableCell>
                      <TableCell>{campaign.category}</TableCell>
                      <TableCell>{formatDate(campaign.createdAt)}</TableCell>
                      <TableCell>{formatCurrency(campaign.goal)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            asChild
                            variant="outline"
                            size="sm"
                          >
                            <Link to={`/campaign/${campaign.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2 text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => openRejectDialog(campaign.id)}
                          >
                            <XCircle className="h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No approved campaigns found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="rejected">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rejectedCampaigns.length > 0 ? (
                  rejectedCampaigns.map(campaign => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.title}</TableCell>
                      <TableCell>{campaign.category}</TableCell>
                      <TableCell>{formatDate(campaign.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            asChild
                            variant="outline"
                            size="sm"
                          >
                            <Link to={`/campaign/${campaign.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2 text-green-600 border-green-600 hover:bg-green-50"
                            onClick={() => handleApproveCampaign(campaign.id)}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Approve
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No rejected campaigns found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Rejection Dialog */}
      <Dialog open={!!campaignToReject} onOpenChange={(open) => !open && setCampaignToReject(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Campaign</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this campaign.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reason">Rejection Reason</Label>
              <Textarea
                id="reason"
                placeholder="Please provide details about why this campaign is being rejected..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setCampaignToReject(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleRejectCampaign}
            >
              Reject Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CampaignModeration;
