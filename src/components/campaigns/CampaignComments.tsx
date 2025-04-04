
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '../../utils/donationUtils';
import { Campaign } from '../../types';
import { MessageSquare } from 'lucide-react';

interface CampaignCommentsProps {
  campaign: Campaign;
}

const CampaignComments: React.FC<CampaignCommentsProps> = ({ campaign }) => {
  const { user, isAuthenticated } = useAuth();
  const { getCampaignComments, addCampaignComment } = useData();
  const { toast } = useToast();
  const [comment, setComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const comments = getCampaignComments(campaign.id);
  
  // Parent comments (no parentId)
  const parentComments = comments.filter(c => !c.parentId).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  // Get replies for a comment
  const getReplies = (commentId: string) => {
    return comments
      .filter(c => c.parentId === commentId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to leave a comment.",
        variant: "destructive",
      });
      return;
    }
    
    if (!comment.trim()) {
      toast({
        title: "Empty Comment",
        description: "Please enter a comment before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await addCampaignComment({
        campaignId: campaign.id,
        userId: user!.id,
        userName: user!.name || user!.email.split('@')[0],
        userImage: user!.avatar || undefined,
        content: comment,
        parentId: replyTo || undefined,
      });
      
      setComment('');
      setReplyTo(null);
      toast({
        title: "Comment Added",
        description: "Your comment has been posted successfully.",
      });
    } catch (error) {
      console.error("Error posting comment:", error);
      toast({
        title: "Error",
        description: "Failed to post your comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Comments</h2>
      
      {/* Comment Form */}
      <div className="mb-8">
        <form onSubmit={handleSubmit}>
          <div className="flex items-start gap-4">
            <Avatar>
              <AvatarImage src={user?.avatar || undefined} />
              <AvatarFallback>
                {user ? getInitials(user.name || user.email) : 'GU'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder={isAuthenticated ? "Leave a comment..." : "Sign in to leave a comment"}
                className="mb-2"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={!isAuthenticated || isSubmitting}
              />
              {replyTo && (
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <span>Replying to comment</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 px-1 text-sm"
                    onClick={() => setReplyTo(null)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
              <div className="flex justify-end">
                <Button type="submit" disabled={!isAuthenticated || isSubmitting}>
                  Post Comment
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
      
      {/* Comments List */}
      {parentComments.length > 0 ? (
        <div className="space-y-8">
          {parentComments.map((comment) => (
            <div key={comment.id} className="space-y-4">
              {/* Main Comment */}
              <div className="flex gap-4">
                <Avatar>
                  <AvatarImage src={comment.userImage} />
                  <AvatarFallback>{getInitials(comment.userName)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{comment.userName}</span>
                      <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="text-gray-800 whitespace-pre-wrap">{comment.content}</p>
                  </div>
                  {isAuthenticated && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-1 text-gray-500"
                      onClick={() => setReplyTo(comment.id)}
                    >
                      Reply
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Replies */}
              {getReplies(comment.id).length > 0 && (
                <div className="ml-12 space-y-4">
                  {getReplies(comment.id).map((reply) => (
                    <div key={reply.id} className="flex gap-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={reply.userImage} />
                        <AvatarFallback>{getInitials(reply.userName)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">{reply.userName}</span>
                            <span className="text-xs text-gray-500">{formatDate(reply.createdAt)}</span>
                          </div>
                          <p className="text-gray-800 text-sm whitespace-pre-wrap">{reply.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="text-lg font-medium mt-4">No Comments Yet</h3>
          <p className="text-gray-500 mt-1">
            Be the first to share your thoughts on this campaign.
          </p>
        </div>
      )}
    </div>
  );
};

export default CampaignComments;
