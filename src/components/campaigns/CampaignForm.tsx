import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useToast } from '@/hooks/use-toast';
import { Campaign } from '@/types';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Define the campaign categories
const CAMPAIGN_CATEGORIES = [
  'Education',
  'Medical',
  'Disaster Relief',
  'Animal Welfare',
  'Environment',
  'Community',
  'Arts & Culture',
  'Sports',
  'Technology',
  'Other'
];

// Define the form schema
const campaignSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters long' }).max(100),
  shortDescription: z.string().min(10, { message: 'Short description must be at least 10 characters' }).max(200),
  description: z.string().min(50, { message: 'Description must be at least 50 characters' }),
  goal: z.coerce.number().positive({ message: 'Goal amount must be positive' }),
  category: z.string().min(1, { message: 'Please select a category' }),
  image: z.string().url({ message: 'Please enter a valid image URL' }),
  endDate: z.string().optional(),
});

type CampaignFormProps = {
  campaignToEdit?: Campaign;
  isAdmin?: boolean;
};

const CampaignForm: React.FC<CampaignFormProps> = ({ campaignToEdit, isAdmin = false }) => {
  const { user } = useAuth();
  const { addCampaign, updateCampaign } = useData();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof campaignSchema>>({
    resolver: zodResolver(campaignSchema),
    defaultValues: campaignToEdit ? {
      title: campaignToEdit.title,
      shortDescription: campaignToEdit.shortDescription,
      description: campaignToEdit.description,
      goal: campaignToEdit.goal,
      category: campaignToEdit.category,
      image: campaignToEdit.image,
      endDate: campaignToEdit.endDate || '',
    } : {
      title: '',
      shortDescription: '',
      description: '',
      goal: 1000,
      category: '',
      image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=2000',
      endDate: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof campaignSchema>) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You need to be logged in to create or edit a campaign',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (campaignToEdit) {
        // Update existing campaign
        await updateCampaign(campaignToEdit.id, {
          ...values,
          organizer: isAdmin ? campaignToEdit.organizer : user.id,
          featured: isAdmin ? campaignToEdit.featured : false,
        });

        toast({
          title: 'Campaign updated',
          description: 'Your campaign has been updated successfully',
        });
      } else {
        // Create new campaign
        const newCampaign = await addCampaign({
          title: values.title,
          shortDescription: values.shortDescription,
          description: values.description,
          goal: values.goal,
          category: values.category,
          image: values.image,
          endDate: values.endDate,
          organizer: user.id,
          featured: isAdmin ? true : false,
        });

        toast({
          title: 'Campaign created',
          description: 'Your campaign has been created successfully',
        });

        // Navigate to the new campaign
        navigate(`/campaign/${newCampaign.id}`);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campaign Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter campaign title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shortDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Brief description (shown in campaign cards)" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Detailed description of your campaign" 
                  className="min-h-32" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="goal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fundraising Goal</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1" 
                    placeholder="Amount to raise" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CAMPAIGN_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campaign Image URL</FormLabel>
              <FormControl>
                <Input placeholder="Enter image URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date (Optional)</FormLabel>
              <FormControl>
                <Input 
                  type="date" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-3">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {campaignToEdit ? 'Update Campaign' : 'Create Campaign'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CampaignForm;
