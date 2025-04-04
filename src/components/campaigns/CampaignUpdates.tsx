
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Switch } from '@/components/ui/switch';
import { Milestone } from 'lucide-react';
import { formatDate } from '../../utils/donationUtils';
import { Campaign } from '../../types';

interface CampaignUpdatesProps {
  campaign: Campaign;
}

const updateFormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  content: z.string().min(20, { message: "Content must be at least 20 characters" }),
  image: z.string().optional(),
  isMilestone: z.boolean().default(false),
  milestoneTarget: z.number().min(1).max(100).optional(),
});

type UpdateFormValues = z.infer<typeof updateFormSchema>;

const CampaignUpdates: React.FC<CampaignUpdatesProps> = ({ campaign }) => {
  const { user } = useAuth();
  const { getCampaignUpdates, addCampaignUpdate } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const isOwnerOrAdmin = user && (user.id === campaign.organizer || user.role === 'admin');
  const updates = getCampaignUpdates(campaign.id).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  const form = useForm<UpdateFormValues>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      title: "",
      content: "",
      image: "",
      isMilestone: false,
    },
  });
  
  const onSubmit = async (values: UpdateFormValues) => {
    try {
      await addCampaignUpdate({
        campaignId: campaign.id,
        title: values.title,
        content: values.content,
        image: values.image,
        isMilestone: values.isMilestone,
        milestoneTarget: values.milestoneTarget,
      });
      
      form.reset();
      setDialogOpen(false);
    } catch (error) {
      console.error("Error adding update:", error);
    }
  };
  
  const watchIsMilestone = form.watch("isMilestone");
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Campaign Updates</h2>
        
        {isOwnerOrAdmin && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Update</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Campaign Update</DialogTitle>
                <DialogDescription>
                  Share progress, milestones, or news about your campaign with supporters.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Update Title</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g., We've Reached 50% of Our Goal!" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Update Content</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Share the details of your update..." 
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/image.jpg" {...field} />
                        </FormControl>
                        <FormDescription>
                          Add an image to illustrate your update
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="isMilestone"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Mark as Milestone</FormLabel>
                          <FormDescription>
                            Highlight this as a significant achievement in your campaign
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  {watchIsMilestone && (
                    <FormField
                      control={form.control}
                      name="milestoneTarget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Milestone Percentage (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1" 
                              max="100"
                              placeholder="E.g., 50" 
                              {...field} 
                              onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormDescription>
                            What percentage of your goal does this milestone represent?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <DialogFooter>
                    <Button type="submit">Add Update</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      {updates.length > 0 ? (
        <div className="space-y-6">
          {updates.map((update) => (
            <Card key={update.id} className={update.isMilestone ? "border-brand-400" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">
                      {formatDate(update.createdAt)}
                    </div>
                    <CardTitle className="flex items-center">
                      {update.isMilestone && (
                        <Milestone className="h-5 w-5 text-brand-500 mr-2" />
                      )}
                      {update.title}
                    </CardTitle>
                  </div>
                  {update.isMilestone && update.milestoneTarget && (
                    <div className="bg-brand-100 text-brand-800 text-sm font-medium px-3 py-1 rounded-full">
                      {update.milestoneTarget}% Milestone
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base whitespace-pre-wrap">
                  {update.content}
                </CardDescription>
                {update.image && (
                  <div className="mt-4">
                    <img 
                      src={update.image} 
                      alt={update.title} 
                      className="rounded-md max-h-[300px] w-auto mx-auto"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Milestone className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="text-lg font-medium mt-4">No Updates Yet</h3>
          <p className="text-gray-500 mt-1 mb-4">
            {isOwnerOrAdmin 
              ? "Share updates about your campaign's progress with supporters."
              : "Check back later for updates on this campaign's progress."}
          </p>
          
          {isOwnerOrAdmin && (
            <Button variant="outline" onClick={() => setDialogOpen(true)}>
              Add First Update
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default CampaignUpdates;
