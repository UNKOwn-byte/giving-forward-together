
import { CampaignComment } from '../types';

export const campaignComments: CampaignComment[] = [
  {
    id: "comment-1",
    campaignId: "campaign-1",
    userId: "user-1",
    userName: "Emily Rodriguez",
    userImage: "https://randomuser.me/api/portraits/women/22.jpg",
    content: "This community center is exactly what our town needs! I grew up here and we've never had a proper place for events or gatherings. So excited to see this happening!",
    createdAt: "2023-06-14T09:15:00Z"
  },
  {
    id: "comment-2",
    campaignId: "campaign-1",
    userId: "user-2",
    userName: "James Wilson",
    userImage: "https://randomuser.me/api/portraits/men/33.jpg",
    content: "I'm curious about the accessibility features. Will the building have ramps and accessible restrooms for people with mobility issues?",
    createdAt: "2023-06-14T11:30:00Z"
  },
  {
    id: "comment-3",
    campaignId: "campaign-1",
    userId: "user-3",
    userName: "Robert Chen",
    userImage: "https://randomuser.me/api/portraits/men/42.jpg",
    content: "Great question, James. As one of the project coordinators, I can confirm that the center is designed to be fully ADA compliant with ramps, accessible restrooms, and wide doorways throughout.",
    createdAt: "2023-06-14T12:15:00Z",
    parentId: "comment-2"
  },
  {
    id: "comment-4",
    campaignId: "campaign-2",
    userId: "user-4",
    userName: "Sarah Johnson",
    userImage: "https://randomuser.me/api/portraits/women/45.jpg",
    content: "As a pediatric nurse, stories like Maya's touch my heart deeply. I'm donating and sharing this campaign with my colleagues. Wishing your family strength during this challenging time.",
    createdAt: "2023-03-05T15:40:00Z"
  },
  {
    id: "comment-5",
    campaignId: "campaign-2",
    userId: "user-5",
    userName: "Michael Brown",
    userImage: "https://randomuser.me/api/portraits/men/52.jpg",
    content: "My daughter had a similar procedure last year, and she's doing wonderfully now. If you need any advice or just someone to talk to who's been through this, please feel free to reach out to me.",
    createdAt: "2023-03-06T10:22:00Z"
  },
  {
    id: "comment-6",
    campaignId: "campaign-3",
    userId: "user-6",
    userName: "Lisa Nakamura",
    userImage: "https://randomuser.me/api/portraits/women/67.jpg",
    content: "As a marine biologist, I can't wait to see this documentary. We need more awareness about ocean conservation. Have you connected with any research institutions for your project?",
    createdAt: "2023-08-15T16:50:00Z"
  },
  {
    id: "comment-7",
    campaignId: "campaign-3",
    userId: "user-7",
    userName: "David Miller",
    userImage: "https://randomuser.me/api/portraits/men/75.jpg",
    content: "Just increased my donation after seeing your update on the filming locations. The preview footage looks amazing! When do you expect the documentary to be released?",
    createdAt: "2023-09-07T14:05:00Z"
  }
];
