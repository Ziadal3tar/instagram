export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  code?: string;
  data?: T;
}

export interface UserSummary {
  _id: string;
  userName: string;
  fullName: string;
  bio?: string;
  profilePic?: string;
  profilePicType?: string;
  active?: boolean;
}

export interface NotificationItem {
  _id?: string;
  text?: string;
  seen?: boolean;
  type?: string;
  redirect?: string;
  data?: UserSummary | null;
  actorId?: string;
  createdAt?: string;
}

export interface ChatMessage {
  _id?: string;
  message: string;
  sender: string;
  date?: string;
  time?: string;
  createdAt?: string;
}

export interface ChatSummary {
  _id: string;
  userIds: UserSummary[];
  type: 'chat' | 'group';
  updatedAt?: string;
  messages: ChatMessage[];
}

export interface Collection {
  _id: string;
  collectionName: string;
  saved: string[];
}

export interface CurrentUser extends UserSummary {
  email?: string;
  registerType?: string;
  visited?: UserSummary[];
  following?: UserSummary[];
  notifications?: NotificationItem[];
  unseenNotifications?: number;
  stories?: any[];
  chats?: ChatSummary[];
  collections?: Collection[];
}

export interface ContentItem {
  _id: string;
  type: 'post' | 'reel';
  caption?: string;
  createdAt: string;
  createdBy: UserSummary;
  postsImgAndVideos?: Array<{ url: string; public_id?: string; type: 'image' | 'video' }>;
  url?: string;
  public_id?: string;
  likesCount: number;
  commentsCount: number;
  viewerLiked?: boolean;
  comments?: any[];
  commentsPage?: number;
  commentsLimit?: number;
  commentsHasMore?: boolean;
  isSaved?: boolean;
}

export interface FeedPage {
  page: number;
  limit: number;
  items: ContentItem[];
  hasMore: boolean;
}

export interface ProfileData {
  _id: string;
  userName: string;
  fullName: string;
  bio?: string;
  profilePic?: string;
  profilePicType?: string;
  active?: boolean;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
}

export interface ProfileResponse {
  profile: ProfileData;
  allPosts: ContentItem[];
}

export interface SavedPage {
  page: number;
  limit: number;
  items: ContentItem[];
  hasMore: boolean;
}
