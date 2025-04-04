import React, { createContext, useContext, useState, useEffect } from 'react';
import { Campaign, Donation, BlogPost, SuccessStory, FAQItem, CampaignUpdate, CampaignComment, CampaignCategory } from '../types';

// Sample data for demo purposes
import { campaigns, donations } from '../data/sampleData';
import { blogPosts } from '../data/blogData';
import { successStories } from '../data/successStoriesData';
import { faqItems } from '../data/faqData';
import { campaignUpdates } from '../data/campaignUpdatesData';
import { campaignComments } from '../data/campaignCommentsData';
import { campaignCategories } from '../data/campaignCategoriesData';

interface DataContextType {
  campaigns: Campaign[];
  donations: Donation[];
  featuredCampaigns: Campaign[];
  getCampaign: (id: string) => Campaign | undefined;
  getCampaignDonations: (campaignId: string) => Donation[];
  addDonation: (donation: Omit<Donation, 'id' | 'createdAt'>) => Promise<Donation>;
  updateDonationStatus: (id: string, status: Donation['status'], transactionId?: string) => Promise<void>;
  verifyTransaction: (transactionId: string) => Promise<boolean>;
  addCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt' | 'raised'>) => Promise<Campaign>;
  updateCampaign: (id: string, updates: Partial<Omit<Campaign, 'id' | 'createdAt' | 'raised'>>) => Promise<Campaign>;
  deleteCampaign: (id: string) => Promise<void>;
  getUserCampaigns: (organizerId: string) => Campaign[];

  blogPosts: BlogPost[];
  featuredBlogPosts: BlogPost[];
  getBlogPost: (slug: string) => BlogPost | undefined;
  getBlogPostsByCategory: (category: string) => BlogPost[];
  getBlogPostsByTag: (tag: string) => BlogPost[];
  addBlogPost: (post: Omit<BlogPost, 'id' | 'createdAt'>) => Promise<BlogPost>;
  updateBlogPost: (id: string, updates: Partial<Omit<BlogPost, 'id' | 'createdAt'>>) => Promise<BlogPost>;
  deleteBlogPost: (id: string) => Promise<void>;

  successStories: SuccessStory[];
  featuredSuccessStories: SuccessStory[];
  getSuccessStory: (id: string) => SuccessStory | undefined;
  addSuccessStory: (story: Omit<SuccessStory, 'id' | 'createdAt'>) => Promise<SuccessStory>;
  updateSuccessStory: (id: string, updates: Partial<Omit<SuccessStory, 'id' | 'createdAt'>>) => Promise<SuccessStory>;
  deleteSuccessStory: (id: string) => Promise<void>;

  faqItems: FAQItem[];
  getFaqByCategory: (category: string) => FAQItem[];
  addFaqItem: (item: Omit<FAQItem, 'id'>) => Promise<FAQItem>;
  updateFaqItem: (id: string, updates: Partial<Omit<FAQItem, 'id'>>) => Promise<FAQItem>;
  deleteFaqItem: (id: string) => Promise<void>;

  campaignUpdates: CampaignUpdate[];
  getCampaignUpdates: (campaignId: string) => CampaignUpdate[];
  getCampaignMilestones: (campaignId: string) => CampaignUpdate[];
  addCampaignUpdate: (update: Omit<CampaignUpdate, 'id' | 'createdAt'>) => Promise<CampaignUpdate>;
  updateCampaignUpdate: (id: string, updates: Partial<Omit<CampaignUpdate, 'id' | 'createdAt'>>) => Promise<CampaignUpdate>;
  deleteCampaignUpdate: (id: string) => Promise<void>;

  campaignComments: CampaignComment[];
  getCampaignComments: (campaignId: string) => CampaignComment[];
  addCampaignComment: (comment: Omit<CampaignComment, 'id' | 'createdAt'>) => Promise<CampaignComment>;
  updateCampaignComment: (id: string, content: string) => Promise<CampaignComment>;
  deleteCampaignComment: (id: string) => Promise<void>;

  campaignCategories: CampaignCategory[];
  getCampaignsByCategory: (categorySlug: string) => Campaign[];
  addCampaignCategory: (category: Omit<CampaignCategory, 'id' | 'count'>) => Promise<CampaignCategory>;
  updateCampaignCategory: (id: string, updates: Partial<Omit<CampaignCategory, 'id' | 'count'>>) => Promise<CampaignCategory>;
  deleteCampaignCategory: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [campaignData, setCampaignData] = useState<Campaign[]>(campaigns);
  const [donationData, setDonationData] = useState<Donation[]>(donations);
  const [blogPostData, setBlogPostData] = useState<BlogPost[]>(blogPosts);
  const [successStoryData, setSuccessStoryData] = useState<SuccessStory[]>(successStories);
  const [faqData, setFaqData] = useState<FAQItem[]>(faqItems);
  const [campaignUpdateData, setCampaignUpdateData] = useState<CampaignUpdate[]>(campaignUpdates);
  const [campaignCommentData, setCampaignCommentData] = useState<CampaignComment[]>(campaignComments);
  const [campaignCategoryData, setCampaignCategoryData] = useState<CampaignCategory[]>(campaignCategories);

  const featuredCampaigns = campaignData.filter(campaign => campaign.featured);
  
  const featuredBlogPosts = blogPostData.filter(post => post.featured);
  
  const featuredSuccessStories = successStoryData.filter(story => story.featured);

  const getCampaign = (id: string) => {
    return campaignData.find(campaign => campaign.id === id);
  };

  const getCampaignDonations = (campaignId: string) => {
    return donationData.filter(donation => donation.campaignId === campaignId);
  };

  const getUserCampaigns = (organizerId: string) => {
    return campaignData.filter(campaign => campaign.organizer === organizerId);
  };

  const getBlogPost = (slug: string) => {
    return blogPostData.find(post => post.slug === slug);
  };

  const getBlogPostsByCategory = (category: string) => {
    return blogPostData.filter(post => post.category.toLowerCase() === category.toLowerCase());
  };

  const getBlogPostsByTag = (tag: string) => {
    return blogPostData.filter(post => post.tags.includes(tag.toLowerCase()));
  };

  const addBlogPost = async (postInput: Omit<BlogPost, 'id' | 'createdAt'>) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newPost: BlogPost = {
      ...postInput,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
    };
    
    setBlogPostData(prev => [...prev, newPost]);
    return newPost;
  };

  const updateBlogPost = async (id: string, updates: Partial<Omit<BlogPost, 'id' | 'createdAt'>>) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let updatedPost: BlogPost | undefined;
    
    setBlogPostData(prev => {
      const updated = prev.map(post => {
        if (post.id === id) {
          updatedPost = { ...post, ...updates };
          return updatedPost;
        }
        return post;
      });
      return updated;
    });
    
    if (!updatedPost) {
      throw new Error('Blog post not found');
    }
    
    return updatedPost;
  };

  const deleteBlogPost = async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setBlogPostData(prev => prev.filter(post => post.id !== id));
  };

  const getSuccessStory = (id: string) => {
    return successStoryData.find(story => story.id === id);
  };

  const addSuccessStory = async (storyInput: Omit<SuccessStory, 'id' | 'createdAt'>) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newStory: SuccessStory = {
      ...storyInput,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
    };
    
    setSuccessStoryData(prev => [...prev, newStory]);
    return newStory;
  };

  const updateSuccessStory = async (id: string, updates: Partial<Omit<SuccessStory, 'id' | 'createdAt'>>) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let updatedStory: SuccessStory | undefined;
    
    setSuccessStoryData(prev => {
      const updated = prev.map(story => {
        if (story.id === id) {
          updatedStory = { ...story, ...updates };
          return updatedStory;
        }
        return story;
      });
      return updated;
    });
    
    if (!updatedStory) {
      throw new Error('Success story not found');
    }
    
    return updatedStory;
  };

  const deleteSuccessStory = async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSuccessStoryData(prev => prev.filter(story => story.id !== id));
  };

  const getFaqByCategory = (category: string) => {
    return faqData.filter(item => item.category.toLowerCase() === category.toLowerCase());
  };

  const addFaqItem = async (itemInput: Omit<FAQItem, 'id'>) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newItem: FAQItem = {
      ...itemInput,
      id: Math.random().toString(36).substring(2, 9),
    };
    
    setFaqData(prev => [...prev, newItem]);
    return newItem;
  };

  const updateFaqItem = async (id: string, updates: Partial<Omit<FAQItem, 'id'>>) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let updatedItem: FAQItem | undefined;
    
    setFaqData(prev => {
      const updated = prev.map(item => {
        if (item.id === id) {
          updatedItem = { ...item, ...updates };
          return updatedItem;
        }
        return item;
      });
      return updated;
    });
    
    if (!updatedItem) {
      throw new Error('FAQ item not found');
    }
    
    return updatedItem;
  };

  const deleteFaqItem = async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setFaqData(prev => prev.filter(item => item.id !== id));
  };

  const getCampaignUpdates = (campaignId: string) => {
    return campaignUpdateData.filter(update => update.campaignId === campaignId);
  };

  const getCampaignMilestones = (campaignId: string) => {
    return campaignUpdateData.filter(update => update.campaignId === campaignId && update.isMilestone);
  };

  const addCampaignUpdate = async (updateInput: Omit<CampaignUpdate, 'id' | 'createdAt'>) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUpdate: CampaignUpdate = {
      ...updateInput,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
    };
    
    setCampaignUpdateData(prev => [...prev, newUpdate]);
    return newUpdate;
  };

  const updateCampaignUpdate = async (id: string, updates: Partial<Omit<CampaignUpdate, 'id' | 'createdAt'>>) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let updatedUpdate: CampaignUpdate | undefined;
    
    setCampaignUpdateData(prev => {
      const updated = prev.map(update => {
        if (update.id === id) {
          updatedUpdate = { ...update, ...updates };
          return updatedUpdate;
        }
        return update;
      });
      return updated;
    });
    
    if (!updatedUpdate) {
      throw new Error('Campaign update not found');
    }
    
    return updatedUpdate;
  };

  const deleteCampaignUpdate = async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCampaignUpdateData(prev => prev.filter(update => update.id !== id));
  };

  const getCampaignComments = (campaignId: string) => {
    return campaignCommentData.filter(comment => comment.campaignId === campaignId);
  };

  const addCampaignComment = async (commentInput: Omit<CampaignComment, 'id' | 'createdAt'>) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newComment: CampaignComment = {
      ...commentInput,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
    };
    
    setCampaignCommentData(prev => [...prev, newComment]);
    return newComment;
  };

  const updateCampaignComment = async (id: string, content: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let updatedComment: CampaignComment | undefined;
    
    setCampaignCommentData(prev => {
      const updated = prev.map(comment => {
        if (comment.id === id) {
          updatedComment = { ...comment, content };
          return updatedComment;
        }
        return comment;
      });
      return updated;
    });
    
    if (!updatedComment) {
      throw new Error('Comment not found');
    }
    
    return updatedComment;
  };

  const deleteCampaignComment = async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCampaignCommentData(prev => prev.filter(comment => comment.id !== id));
  };

  const getCampaignsByCategory = (categorySlug: string) => {
    const category = campaignCategoryData.find(cat => cat.slug === categorySlug);
    if (!category) return [];
    
    return campaignData.filter(campaign => campaign.category === category.name);
  };

  const addCampaignCategory = async (categoryInput: Omit<CampaignCategory, 'id' | 'count'>) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newCategory: CampaignCategory = {
      ...categoryInput,
      id: Math.random().toString(36).substring(2, 9),
      count: 0,
    };
    
    setCampaignCategoryData(prev => [...prev, newCategory]);
    return newCategory;
  };

  const updateCampaignCategory = async (id: string, updates: Partial<Omit<CampaignCategory, 'id' | 'count'>>) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let updatedCategory: CampaignCategory | undefined;
    
    setCampaignCategoryData(prev => {
      const updated = prev.map(category => {
        if (category.id === id) {
          updatedCategory = { ...category, ...updates };
          return updatedCategory;
        }
        return category;
      });
      return updated;
    });
    
    if (!updatedCategory) {
      throw new Error('Category not found');
    }
    
    return updatedCategory;
  };

  const deleteCampaignCategory = async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCampaignCategoryData(prev => prev.filter(category => category.id !== id));
  };

  const verifyTransaction = async (transactionId: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const existingDonation = donationData.find(
      donation => donation.transactionId === transactionId
    );
    
    return !existingDonation;
  };

  const addDonation = async (donationInput: Omit<Donation, 'id' | 'createdAt'>) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newDonation: Donation = {
      ...donationInput,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
    };
    
    setDonationData(prev => [...prev, newDonation]);
    
    if (donationInput.status === 'confirmed') {
      setCampaignData(prev => 
        prev.map(campaign => 
          campaign.id === donationInput.campaignId 
            ? { ...campaign, raised: campaign.raised + donationInput.amount } 
            : campaign
        )
      );
    }
    
    return newDonation;
  };

  const addCampaign = async (campaignInput: Omit<Campaign, 'id' | 'createdAt' | 'raised'>) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newCampaign: Campaign = {
      ...campaignInput,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      raised: 0,
    };
    
    setCampaignData(prev => [...prev, newCampaign]);
    return newCampaign;
  };

  const updateCampaign = async (id: string, updates: Partial<Omit<Campaign, 'id' | 'createdAt' | 'raised'>>) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let updatedCampaign: Campaign | undefined;
    
    setCampaignData(prev => {
      const updated = prev.map(campaign => {
        if (campaign.id === id) {
          updatedCampaign = { ...campaign, ...updates };
          return updatedCampaign;
        }
        return campaign;
      });
      return updated;
    });
    
    if (!updatedCampaign) {
      throw new Error('Campaign not found');
    }
    
    return updatedCampaign;
  };

  const deleteCampaign = async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCampaignData(prev => prev.filter(campaign => campaign.id !== id));
  };

  const updateDonationStatus = async (id: string, status: Donation['status'], transactionId?: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let donation = donationData.find(d => d.id === id);
    
    if (!donation) return;
    
    setDonationData(prev => 
      prev.map(donation => 
        donation.id === id 
          ? { ...donation, status, ...(transactionId ? { transactionId } : {}) } 
          : donation
      )
    );
    
    if (status === 'confirmed' && donation.status !== 'confirmed') {
      setCampaignData(prev => 
        prev.map(campaign => 
          campaign.id === donation.campaignId 
            ? { ...campaign, raised: campaign.raised + donation.amount } 
            : campaign
        )
      );
    }
    else if (status !== 'confirmed' && donation.status === 'confirmed') {
      setCampaignData(prev => 
        prev.map(campaign => 
          campaign.id === donation.campaignId 
            ? { ...campaign, raised: campaign.raised - donation.amount } 
            : campaign
        )
      );
    }
  };

  return (
    <DataContext.Provider
      value={{
        campaigns: campaignData,
        donations: donationData,
        featuredCampaigns,
        getCampaign,
        getCampaignDonations,
        addDonation,
        updateDonationStatus,
        verifyTransaction,
        addCampaign,
        updateCampaign,
        deleteCampaign,
        getUserCampaigns,
        
        blogPosts: blogPostData,
        featuredBlogPosts,
        getBlogPost,
        getBlogPostsByCategory,
        getBlogPostsByTag,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        
        successStories: successStoryData,
        featuredSuccessStories,
        getSuccessStory,
        addSuccessStory,
        updateSuccessStory,
        deleteSuccessStory,
        
        faqItems: faqData,
        getFaqByCategory,
        addFaqItem,
        updateFaqItem,
        deleteFaqItem,
        
        campaignUpdates: campaignUpdateData,
        getCampaignUpdates,
        getCampaignMilestones,
        addCampaignUpdate,
        updateCampaignUpdate,
        deleteCampaignUpdate,
        
        campaignComments: campaignCommentData,
        getCampaignComments,
        addCampaignComment,
        updateCampaignComment,
        deleteCampaignComment,
        
        campaignCategories: campaignCategoryData,
        getCampaignsByCategory,
        addCampaignCategory,
        updateCampaignCategory,
        deleteCampaignCategory
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
