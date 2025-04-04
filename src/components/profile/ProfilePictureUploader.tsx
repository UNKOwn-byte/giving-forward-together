
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { CameraIcon, X, Trash2 } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface ProfilePictureUploaderProps {
  currentAvatar: string;
  name: string;
  onAvatarChange: (avatarDataUrl: string | null) => void;
}

const DEFAULT_AVATAR = '/placeholder.svg';

const ProfilePictureUploader: React.FC<ProfilePictureUploaderProps> = ({
  currentAvatar,
  name,
  onAvatarChange
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPEG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image less than 5MB in size",
        variant: "destructive",
      });
      return;
    }

    // Create FileReader to convert image to data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setPreviewUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = () => {
    if (!previewUrl) return;
    onAvatarChange(previewUrl);
    setPreviewUrl(null);
    toast({
      title: "Profile picture updated",
      description: "Your profile picture has been updated successfully",
      variant: "default",
    });
  };

  const handleCancelPreview = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveAvatar = () => {
    onAvatarChange(null);
    setConfirmRemoveOpen(false);
    toast({
      title: "Profile picture removed",
      description: "Your profile picture has been removed",
      variant: "default",
    });
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const isDefaultImage = !currentAvatar || currentAvatar === DEFAULT_AVATAR;

  return (
    <div className="flex flex-col items-center">
      <div className="relative group">
        <Avatar className="h-24 w-24 mb-2">
          <AvatarImage 
            src={previewUrl || currentAvatar || DEFAULT_AVATAR} 
            alt={name} 
          />
          <AvatarFallback className="text-xl">
            {name?.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div 
          className="absolute bottom-0 right-0 p-1 bg-primary rounded-full cursor-pointer"
          onClick={triggerFileSelect}
        >
          <CameraIcon className="h-4 w-4 text-white" />
        </div>
        
        {!isDefaultImage && !previewUrl && (
          <div 
            className="absolute top-0 right-0 p-1 bg-destructive rounded-full cursor-pointer"
            onClick={() => setConfirmRemoveOpen(true)}
          >
            <Trash2 className="h-4 w-4 text-white" />
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {previewUrl && (
        <div className="mt-4 flex space-x-2">
          <Button size="sm" onClick={handleUpload}>Save</Button>
          <Button size="sm" variant="outline" onClick={handleCancelPreview}>
            <X className="mr-1 h-4 w-4" />
            Cancel
          </Button>
        </div>
      )}

      <Dialog open={confirmRemoveOpen} onOpenChange={setConfirmRemoveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Profile Picture</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to remove your profile picture? This action cannot be undone.</p>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setConfirmRemoveOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleRemoveAvatar}>Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePictureUploader;
