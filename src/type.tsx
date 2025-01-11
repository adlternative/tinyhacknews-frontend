export interface Author {
    id: number;
    name: string;
    email: string;
    createdAt: string;
}

export interface NewsItem {
    id: number;
    author: Author;
    createdAt: string;
    updatedAt: string;
    title: string;
    url: string;
    text: string;
}