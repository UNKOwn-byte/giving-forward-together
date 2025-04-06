
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { formatDate } from '@/utils/donationUtils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Table, 
  TableBody,  
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  MessageSquare, 
  FileText,
  Tag,
  ShieldAlert,
  ShieldCheck,
  Shield
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { FlaggedContent } from '@/types';

// Sample flagged content data
const sampleFlaggedContent: FlaggedContent[] = [
  {
    id: '1',
    type: 'campaign',
    contentId: '3',
    reason: 'Contains misleading or false information about the cause',
    reportedBy: 'user@example.com',
    createdAt: new Date().toISOString(),
    status: 'pending'
  },
  {
    id: '2',
    type: 'donation',
    contentId: '5',
    reason: 'Potentially fraudulent donation with suspiciously large amount',
    reportedBy: 'admin@example.com',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    status: 'pending'
  },
  {
    id: '3',
    type: 'comment',
    contentId: '2',
    reason: 'Contains offensive language and personal attacks',
    reportedBy: 'john@example.com',
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    status: 'reviewed'
  },
  {
    id: '4',
    type: 'campaign',
    contentId: '7',
    reason: 'Possible scam or fake campaign',
    reportedBy: 'jane@example.com',
    createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    status: 'dismissed'
  },
];

// Sample content keywords to moderate
const sampleKeywords = [
  { id: '1', word: 'scam', category: 'fraud', severity: 'high', action: 'flag' },
  { id: '2', word: 'fake', category: 'fraud', severity: 'high', action: 'flag' },
  { id: '3', word: 'gambling', category: 'inappropriate', severity: 'medium', action: 'flag' },
  { id: '4', word: 'lottery', category: 'inappropriate', severity: 'medium', action: 'flag' },
  { id: '5', word: 'invest', category: 'financial', severity: 'low', action: 'review' },
  { id: '6', word: 'bitcoin', category: 'financial', severity: 'medium', action: 'review' },
];

const ContentModeration: React.FC = () => {
  const { campaigns, donations } = useData();
  const { toast } = useToast();
  const [flaggedContent, setFlaggedContent] = useState<FlaggedContent[]>(sampleFlaggedContent);
  const [keywords, setKeywords] = useState(sampleKeywords);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContent, setSelectedContent] = useState<FlaggedContent | null>(null);
  const [reviewNote, setReviewNote] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [newKeywordCategory, setNewKeywordCategory] = useState('fraud');
  const [newKeywordSeverity, setNewKeywordSeverity] = useState('medium');
  const [newKeywordAction, setNewKeywordAction] = useState('flag');
  const [isAddingKeyword, setIsAddingKeyword] = useState(false);
  
  // Filter flagged content based on search term
  const filteredContent = flaggedContent.filter(content => 
    content.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
    content.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (content.reportedBy && content.reportedBy.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Filtered content by status
  const pendingContent = filteredContent.filter(c => c.status === 'pending');
  const reviewedContent = filteredContent.filter(c => c.status === 'reviewed');
  const dismissedContent = filteredContent.filter(c => c.status === 'dismissed');

  // Get content details based on type and ID
  const getContentDetails = (type: string, id: string) => {
    if (type === 'campaign') {
      const campaign = campaigns.find(c => c.id === id);
      return campaign ? {
        title: campaign.title,
        description: campaign.shortDescription,
        image: campaign.image
      } : null;
    } else if (type === 'donation') {
      const donation = donations.find(d => d.id === id);
      return donation ? {
        title: `${donation.name}'s donation`,
        description: donation.message || `Donation to campaign`,
        amount: donation.amount
      } : null;
    } else if (type === 'comment') {
      // This would fetch comment data in a real app
      return {
        title: 'Comment',
        description: 'Comment content would appear here',
        author: 'User name'
      };
    }
    return null;
  };

  // Handle viewing content details
  const handleViewContent = (content: FlaggedContent) => {
    setSelectedContent(content);
  };

  // Handle approving content (mark as reviewed)
  const handleApproveContent = (id: string) => {
    setFlaggedContent(prev => 
      prev.map(item => 
        item.id === id ? { ...item, status: 'reviewed' } : item
      )
    );
    toast({
      title: "Content approved",
      description: "The flagged content has been marked as reviewed.",
    });
  };

  // Handle rejecting content (mark as dismissed)
  const handleDismissContent = (id: string) => {
    setFlaggedContent(prev => 
      prev.map(item => 
        item.id === id ? { ...item, status: 'dismissed' } : item
      )
    );
    toast({
      title: "Content dismissed",
      description: "The flagged content has been dismissed.",
    });
  };

  // Add new keyword
  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      const newItem = {
        id: Math.random().toString(36).substring(2, 9),
        word: newKeyword.trim().toLowerCase(),
        category: newKeywordCategory,
        severity: newKeywordSeverity,
        action: newKeywordAction
      };
      
      setKeywords(prev => [...prev, newItem]);
      setNewKeyword('');
      setIsAddingKeyword(false);
      
      toast({
        title: "Keyword added",
        description: `"${newKeyword.trim()}" has been added to moderation list.`,
      });
    }
  };

  // Delete keyword
  const handleDeleteKeyword = (id: string) => {
    setKeywords(prev => prev.filter(kw => kw.id !== id));
    toast({
      title: "Keyword deleted",
      description: "The keyword has been removed from moderation list.",
    });
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Content Moderation</CardTitle>
          <CardDescription>
            Review and moderate flagged content from campaigns, donations, and comments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
              <TabsTrigger value="pending" className="flex items-center gap-2">
                Pending
                {pendingContent.length > 0 && (
                  <Badge variant="destructive">{pendingContent.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
              <TabsTrigger value="dismissed">Dismissed</TabsTrigger>
            </TabsList>
            
            <div className="mb-4">
              <Input
                placeholder="Search by reason or reporter..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>
            
            <TabsContent value="pending">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Reported By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingContent.length > 0 ? (
                    pendingContent.map(content => (
                      <TableRow key={content.id}>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {content.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {content.reason}
                        </TableCell>
                        <TableCell>{content.reportedBy || 'System'}</TableCell>
                        <TableCell>{formatDate(content.createdAt)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewContent(content)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 border-green-600 hover:bg-green-50"
                              onClick={() => handleApproveContent(content.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-600 hover:bg-red-50"
                              onClick={() => handleDismissContent(content.id)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Dismiss
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No pending content flags found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="reviewed">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Reported By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviewedContent.length > 0 ? (
                    reviewedContent.map(content => (
                      <TableRow key={content.id}>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {content.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {content.reason}
                        </TableCell>
                        <TableCell>{content.reportedBy || 'System'}</TableCell>
                        <TableCell>{formatDate(content.createdAt)}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewContent(content)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No reviewed content flags found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="dismissed">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Reported By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dismissedContent.length > 0 ? (
                    dismissedContent.map(content => (
                      <TableRow key={content.id}>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {content.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {content.reason}
                        </TableCell>
                        <TableCell>{content.reportedBy || 'System'}</TableCell>
                        <TableCell>{formatDate(content.createdAt)}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewContent(content)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No dismissed content flags found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Automoderation Keywords */}
      <Card>
        <CardHeader>
          <CardTitle>Automoderation Rules</CardTitle>
          <CardDescription>
            Define keywords and rules for automatic content moderation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Keywords List</h3>
            <Button 
              onClick={() => setIsAddingKeyword(true)}
              size="sm"
            >
              Add Keyword
            </Button>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Keyword</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Action</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keywords.map(keyword => (
                <TableRow key={keyword.id}>
                  <TableCell><Badge variant="outline">{keyword.word}</Badge></TableCell>
                  <TableCell>
                    <Badge variant={
                      keyword.category === 'fraud' ? 'destructive' :
                      keyword.category === 'inappropriate' ? 'secondary' : 
                      'default'
                    }>
                      {keyword.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      keyword.severity === 'high' ? 'destructive' :
                      keyword.severity === 'medium' ? 'secondary' : 
                      'outline'
                    }>
                      {keyword.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>{keyword.action}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => handleDeleteKeyword(keyword.id)}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Content View Dialog */}
      <Dialog open={!!selectedContent} onOpenChange={(open) => !open && setSelectedContent(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedContent?.type === 'campaign' && <FileText className="h-5 w-5" />}
              {selectedContent?.type === 'donation' && <Tag className="h-5 w-5" />}
              {selectedContent?.type === 'comment' && <MessageSquare className="h-5 w-5" />}
              <span>Review Flagged {selectedContent?.type}</span>
            </DialogTitle>
            <DialogDescription>
              This content was flagged on {selectedContent && formatDate(selectedContent.createdAt)}
            </DialogDescription>
          </DialogHeader>

          {selectedContent && (
            <div className="space-y-4 py-2">
              <div className="border rounded-md p-3 bg-muted/30">
                <h4 className="font-medium mb-1">Flag Reason:</h4>
                <p className="text-sm">{selectedContent.reason}</p>
              </div>

              {(() => {
                const details = getContentDetails(selectedContent.type, selectedContent.contentId);
                if (details) {
                  return (
                    <div className="border rounded-md p-3">
                      <h4 className="font-medium mb-2">Content Details:</h4>
                      {details.title && <p className="text-sm font-medium">{details.title}</p>}
                      {details.description && <p className="text-sm mt-1">{details.description}</p>}
                      {details.image && (
                        <div className="mt-2">
                          <img 
                            src={details.image} 
                            alt="Content" 
                            className="h-32 w-auto object-cover rounded" 
                          />
                        </div>
                      )}
                      {details.amount && <p className="text-sm mt-1">Amount: {details.amount}</p>}
                      {details.author && <p className="text-sm mt-1">By: {details.author}</p>}
                    </div>
                  );
                } else {
                  return (
                    <div className="border rounded-md p-3 text-center">
                      <p className="text-sm text-muted-foreground">Content details not available</p>
                    </div>
                  );
                }
              })()}

              <div>
                <label htmlFor="review-notes" className="block text-sm font-medium mb-1">
                  Review Notes
                </label>
                <Textarea
                  id="review-notes"
                  placeholder="Add notes about your moderation decision..."
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSelectedContent(null)}
            >
              Close
            </Button>
            {selectedContent?.status === 'pending' && (
              <>
                <Button
                  variant="outline"
                  className="text-green-600 border-green-600 hover:bg-green-50"
                  onClick={() => {
                    handleApproveContent(selectedContent.id);
                    setSelectedContent(null);
                  }}
                >
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Approve Content
                </Button>
                <Button
                  variant="outline"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                  onClick={() => {
                    handleDismissContent(selectedContent.id);
                    setSelectedContent(null);
                  }}
                >
                  <ShieldAlert className="h-4 w-4 mr-2" />
                  Flag as Inappropriate
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Keyword Dialog */}
      <Dialog open={isAddingKeyword} onOpenChange={setIsAddingKeyword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Moderation Keyword</DialogTitle>
            <DialogDescription>
              Add a new keyword for automatic content moderation.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label htmlFor="keyword" className="text-sm font-medium">
                Keyword
              </label>
              <Input
                id="keyword"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="Enter keyword..."
              />
            </div>

            <div>
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <select
                id="category"
                value={newKeywordCategory}
                onChange={(e) => setNewKeywordCategory(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="fraud">Fraud</option>
                <option value="inappropriate">Inappropriate</option>
                <option value="financial">Financial</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="severity" className="text-sm font-medium">
                Severity
              </label>
              <select
                id="severity"
                value={newKeywordSeverity}
                onChange={(e) => setNewKeywordSeverity(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label htmlFor="action" className="text-sm font-medium">
                Action
              </label>
              <select
                id="action"
                value={newKeywordAction}
                onChange={(e) => setNewKeywordAction(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="flag">Flag for review</option>
                <option value="block">Block automatically</option>
                <option value="warning">Show warning</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddingKeyword(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleAddKeyword}
              disabled={!newKeyword.trim()}
            >
              Add Keyword
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentModeration;
