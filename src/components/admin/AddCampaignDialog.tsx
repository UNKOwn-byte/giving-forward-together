
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import CampaignForm from '../campaigns/CampaignForm';
import { Plus } from 'lucide-react';

const AddCampaignDialog: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          Add New Campaign
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
          <DialogDescription>
            Create a new fundraising campaign. All fields are required unless specified.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <CampaignForm isAdmin={true} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCampaignDialog;
