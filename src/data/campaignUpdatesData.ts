
import { CampaignUpdate } from '../types';

export const campaignUpdates: CampaignUpdate[] = [
  {
    id: "update-1",
    campaignId: "campaign-1",
    title: "We've Reached 50% of Our Goal!",
    content: "Thank you to all our amazing supporters! We're now halfway to our fundraising target, which means construction can begin on the foundation of our community center next month. This progress has been faster than we expected, and we're so grateful for your generosity. We'll be holding a virtual town hall next week to share the architectural plans and gather feedback from the community.",
    createdAt: "2023-06-12T14:30:00Z",
    isMilestone: true,
    milestoneTarget: 50
  },
  {
    id: "update-2",
    campaignId: "campaign-1",
    title: "Construction Has Begun!",
    content: "Exciting news! Ground was broken yesterday for the community center, and construction is now officially underway. We've attached some photos of the site preparation and the team that will be working on this project over the next few months. The weather forecast looks good, so we're expecting to make rapid progress in the coming weeks.",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5",
    createdAt: "2023-07-20T10:15:00Z",
    isMilestone: false
  },
  {
    id: "update-3",
    campaignId: "campaign-2",
    title: "Maya's Surgery Date Confirmed",
    content: "We have wonderful news to share - Maya's surgery has been scheduled for April 15th at Children's Hospital. The surgical team has reviewed her case and is optimistic about the outcome. Maya has been amazing throughout all the pre-operative appointments, showing incredible bravery for an 8-year-old. We're now focusing on preparing her for the hospital stay and recovery period. Thank you for making this possible with your generous donations.",
    createdAt: "2023-03-22T16:45:00Z",
    isMilestone: false
  },
  {
    id: "update-4",
    campaignId: "campaign-2",
    title: "Surgery Successful - Thank You!",
    content: "With tears of joy and hearts full of gratitude, we can share that Maya's surgery was a complete success! The procedure took just over 6 hours, and the doctors are very pleased with the results. Maya is currently in recovery and doing remarkably well. The medical team expects her to be moved out of intensive care within 48 hours. This miracle was possible because of each and every one of you who contributed to our campaign. We're overwhelmed by your kindness and support during this challenging time.",
    image: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4",
    createdAt: "2023-04-16T19:20:00Z",
    isMilestone: true,
    milestoneTarget: 100
  },
  {
    id: "update-5",
    campaignId: "campaign-3",
    title: "Filming Complete - Entering Post-Production",
    content: "After three intense months of filming across five different marine locations, we've wrapped the principal photography for 'Beneath the Surface'! The footage we've captured is beyond our expectations - from breathtaking coral reefs to heartbreaking scenes of ocean pollution. Now we're moving into the post-production phase, where all this raw material will be shaped into the compelling documentary we've envisioned. Our editor has already started organizing the footage, and our composer is beginning work on the original score.",
    image: "https://images.unsplash.com/photo-1596186806048-e03fb29f4ce4",
    createdAt: "2023-09-05T11:10:00Z",
    isMilestone: true,
    milestoneTarget: 75
  }
];
