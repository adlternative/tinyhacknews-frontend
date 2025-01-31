// 新闻列表项
export interface NewsListItem {
  id: number;
  author: AuthorMeta;
  createdAt: string;
  updatedAt: string;
  title: string;
  url: string;
  commentsCount: number;
  pointsCount: number;
  hasVote: boolean;
}

// 用户信息
export interface UserInfo {
  id: number;
  name: string;
  email: string;
  about: string;
  createdAt: string;
  karma: number;
}

export interface RegisterUserInfoResponse {
  id: number;
  name: string;
  email: string;
  about: string;
  createdAt: string;
}

// 简化的用户信息
export interface AuthorMeta {
  id: number;
  name: string;
}

// 评论
export interface Comment {
  id: number;
  author: AuthorMeta;
  text: string;
  newsId: number;
  parentCommentId: number | null;
  createdAt: string;
  updatedAt: string;
  children?: Comment[]; // For nested comments
}

export interface NewsMeta {
  id: number;
  title: string;
  url: string;
  author: AuthorMeta;
  createdAt: string;
  updatedAt: string;
}

// 继承 Comment + NewMeta
export interface CommentWithNewsMeta extends Comment {
  newsMeta: NewsMeta;
}

// 新闻内容
export interface News {
  id: number;
  author: AuthorMeta;
  createdAt: string;
  updatedAt: string;
  title: string;
  url: string;
  text: string;
  pointsCount: number;
  commentsCount: number;
  hasVote: boolean;
}

// 分页接口返回值
export interface NewsCommentsResponse {
  records: Comment[];
  total: number;
  size: number;
  current: number;
  pages: number;
  // Add other fields if needed
}

export interface CommentListResponse {
  records: CommentWithNewsMeta[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

export interface Page {
  currentPageNum: number;
  pageSize: number;
  totalCount: number;
  pagesCount: number;
}

export interface NewsListResponse {
  list: NewsListItem[];
  page: Page;
}