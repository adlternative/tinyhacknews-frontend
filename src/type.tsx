export interface NewsListItem {
  id: number;
  author: Author;
  createdAt: string;
  updatedAt: string;
  title: string;
  url: string;
  text: string;
}

export interface UserInfo {
  id: number;
  name: string;
  email: string;
  about: string;
  createdAt: string;
  karma: number;
}


export interface Author {
  id: number;
  name: string;
  createdAt: string;
  about: string | null;
}

export interface Comment {
  id: number;
  author: Author;
  text: string;
  newsId: number;
  parentCommentId: number | null;
  createdAt: string;
  updatedAt: string;
  children?: Comment[]; // For nested comments
}

export interface News {
  id: number;
  author: Author;
  createdAt: string;
  updatedAt: string;
  title: string;
  url: string;
  text: string;
  points: number;
  commentsCount: number;
}

export interface ApiResponse {
  records: Comment[];
  total: number;
  size: number;
  current: number;
  pages: number;
  // Add other fields if needed
}
