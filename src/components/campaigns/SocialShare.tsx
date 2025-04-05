
import React, { useState } from 'react';
import { Share, Check, Copy, Facebook, Twitter, Linkedin, Mail, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from '@/hooks/use-toast';

interface SocialShareProps {
  url: string;
  title: string;
  description: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ url, title, description }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  // Ensure URL is properly formatted (add http if missing)
  const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
  
  // Encode parameters for sharing URLs
  const encodedUrl = encodeURIComponent(formattedUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  
  // Social media share URLs
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`;
  const emailShareUrl = `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(formattedUrl)
      .then(() => {
        setCopied(true);
        toast({
          title: "Link copied!",
          description: "Campaign link has been copied to clipboard.",
        });
        
        // Reset copied state after 2 seconds
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error("Copy failed:", err);
        toast({
          title: "Failed to copy",
          description: "Could not copy the link. Please try again.",
          variant: "destructive",
        });
      });
  };
  
  const openShareWindow = (shareUrl: string) => {
    try {
      // Open a popup window centered on the screen
      const width = 600;
      const height = 400;
      const left = window.innerWidth / 2 - width / 2;
      const top = window.innerHeight / 2 - height / 2;
      
      const popup = window.open(
        shareUrl, 
        '_blank', 
        `width=${width},height=${height},left=${left},top=${top},toolbar=0,location=0,menubar=0`
      );
      
      // Focus the popup if available
      if (popup) popup.focus();
      
    } catch (error) {
      console.error("Share window error:", error);
      // Fallback to regular window.open if popup fails
      window.open(shareUrl, '_blank');
    }
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Share2 size={16} />
          Share
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56" align="end">
        <div className="space-y-2">
          <p className="text-sm font-medium mb-2">Share this campaign</p>
          
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 text-blue-600"
              onClick={() => openShareWindow(facebookShareUrl)}
              title="Share on Facebook"
            >
              <Facebook size={16} />
              <span className="sr-only">Facebook</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 text-sky-500"
              onClick={() => openShareWindow(twitterShareUrl)}
              title="Share on Twitter"
            >
              <Twitter size={16} />
              <span className="sr-only">Twitter</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 text-blue-700"
              onClick={() => openShareWindow(linkedinShareUrl)}
              title="Share on LinkedIn"
            >
              <Linkedin size={16} />
              <span className="sr-only">LinkedIn</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 text-red-500"
              onClick={() => {
                try {
                  window.location.href = emailShareUrl;
                } catch (error) {
                  console.error("Email share error:", error);
                  // Fallback to opening a new window if redirect fails
                  window.open(emailShareUrl, '_blank');
                }
              }}
              title="Share via Email"
            >
              <Mail size={16} />
              <span className="sr-only">Email</span>
            </Button>
          </div>
          
          <div className="pt-2 mt-2 border-t">
            <Button 
              variant="outline" 
              className="w-full text-sm justify-between"
              onClick={handleCopyLink}
            >
              <span>Copy link</span>
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SocialShare;
