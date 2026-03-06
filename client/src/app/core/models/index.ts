export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  gender: string | null;
  avatar: string;
  role: 'USER' | 'ADMIN';
  bio: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  _id: string;
  username: string;
  name: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  posts: number;
}

export interface UserProfile extends User {
  followers: number;
  following: number;
  isFollowing: boolean;
  posts: number;
}

export interface Tag {
  _id: string;
  name: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  featureImage: string;
  createdBy?: Partial<User>;
  createdAt?: string;
  updatedAt?: string;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  featureImage: string;
  content: string;
  visits: number;
  category: Category | null;
  tags: Tag[];
  isPublic: boolean;
  isDraft: boolean;
  author: Partial<User>;
  createdAt: string;
  updatedAt: string;
}

export interface BlogDetail extends Blog {
  isLiked: boolean;
  isBookmarked: boolean;
  likes: number;
  comments: number;
}

export interface Comment {
  _id: string;
  blogId: string;
  content: string;
  parentComment: string | null;
  author: Partial<User>;
  replyCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Bookmark {
  _id: string;
  userId: string;
  blogId: string;
  blog: Blog;
  createdAt: string;
}

export interface Report {
  _id: string;
  reportedBy: Partial<User>;
  blog: Partial<Blog>;
  reason: string;
  description: string;
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED';
  reviewedBy: Partial<User> | null;
  createdAt: string;
}

export interface Follow {
  _id: string;
  follower: string;
  following: string;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface PostViewStat {
  title: string;
  slug: string;
  views: number;
}

export interface PostLikeStat {
  title: string;
  slug: string;
  likes: number;
}

export interface MonthStat {
  year: number;
  month: number;
  count: number;
}

export interface UserDetailedStats {
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  followers: number;
  following: number;
  topPostsByViews: PostViewStat[];
  topPostsByLikes: PostLikeStat[];
  postsPerMonth: MonthStat[];
}

export interface DashboardStats {
  totalUsers: number;
  totalBlogs: number;
  publishedBlogs: number;
  draftBlogs: number;
  totalComments: number;
  totalLikes: number;
  totalReports: number;
  pendingReports: number;
}
