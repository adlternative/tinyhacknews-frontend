// src/components/Item.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./Item.css";
import NavBar from "./NavBar"; // Import NavBar component
import Footer from "./Footer"; // Import Footer component
import relativeTimeFromISOString from "./utils/relativeTimeFromISOString";

// Define TypeScript interfaces
interface Author {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  about: string | null;
}

interface Comment {
  id: number;
  author: Author;
  text: string;
  newsId: number;
  parentCommentId: number | null;
  createdAt: string;
  updatedAt: string;
  children?: Comment[]; // For nested comments
}

interface News {
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

interface ApiResponse {
  records: Comment[];
  total: number;
  size: number;
  current: number;
  pages: number;
  // Add other fields if needed
}

// Recursive component to display each comment and its child comments
const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => {
  return (
    <div className="comment-item">
      <div className="comment-header">
        <span className="comment-author">{comment.author.name}</span> on{" "}
        <span className="comment-date">
          {relativeTimeFromISOString(comment.createdAt)}
        </span>
      </div>
      <div className="comment-text">{comment.text}</div>
      {comment.children && comment.children.length > 0 && (
        <div className="comment-children">
          {comment.children.map((child) => (
            <CommentItem key={child.id} comment={child} />
          ))}
        </div>
      )}
    </div>
  );
};

// Main component
const Item: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  const [news, setNews] = useState<News | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingNews, setLoadingNews] = useState<boolean>(true);
  const [loadingComments, setLoadingComments] = useState<boolean>(true);
  const [errorNews, setErrorNews] = useState<string | null>(null);
  const [errorComments, setErrorComments] = useState<string | null>(null);
  const [newComment, setNewComment] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Fetch news content
  useEffect(() => {
    const fetchNews = async () => {
      setLoadingNews(true);
      setErrorNews(null);
      try {
        const response = await axios.get<News>(`/api/v1/news/${id}`);
        setNews(response.data);
      } catch (err) {
        console.error(err);
        setErrorNews("Failed to fetch news content.");
      } finally {
        setLoadingNews(false);
      }
    };

    if (id) {
      fetchNews();
    } else {
      setErrorNews("News ID not provided.");
      setLoadingNews(false);
    }
  }, [id]);

  // Fetch comments data
  useEffect(() => {
    const fetchComments = async () => {
      setLoadingComments(true);
      setErrorComments(null);
      try {
        const response = await axios.get<ApiResponse>(
          `/api/v1/news/${id}/comments`,
          {
            params: {
              page_num: 1,
              page_size: 200,
            },
          }
        );
        const fetchedComments = response.data.records;
        const tree = buildTree(fetchedComments);
        setComments(tree);
      } catch (err) {
        console.error(err);
        setErrorComments("Failed to fetch comments.");
      } finally {
        setLoadingComments(false);
      }
    };

    if (id) {
      fetchComments();
    } else {
      setErrorComments("News ID not provided.");
      setLoadingComments(false);
    }
  }, [id]);

  // Convert flat list of comments to tree structure
  const buildTree = (comments: Comment[]): Comment[] => {
    const commentMap: { [key: number]: Comment } = {};
    const tree: Comment[] = [];

    // Initialize mapping
    comments.forEach((comment) => {
      comment.children = [];
      commentMap[comment.id] = comment;
    });

    // Build tree structure
    comments.forEach((comment) => {
      if (comment.parentCommentId === null) {
        tree.push(comment);
      } else {
        const parent = commentMap[comment.parentCommentId];
        if (parent) {
          parent.children!.push(comment);
        } else {
          // If parent not found, treat as root comment
          tree.push(comment);
        }
      }
    });

    return tree;
  };

  // Handle adding a comment
  const handleAddComment = async () => {
    if (!newComment.trim()) {
      setSubmitError("Comment cannot be empty.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      // Assuming the API to add a comment is POST /api/v1/news/{newsId}/comments
      const response = await axios.post<Comment>(
        `/api/v1/news/${id}/comments`,
        {
          text: newComment,
        }
      );

      // Update the comments list
      const updatedComments = [...comments, { ...response.data, children: [] }];
      setComments(buildTree(updatedComments));
      setNewComment("");
      // Optionally, you can refetch comments instead
    } catch (err) {
      console.error(err);
      setSubmitError("Failed to add comment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      {/* Import NavBar */}
      <NavBar />

      {/* Main content area */}
      <div className="item-container">
        {loadingNews ? (
          <div className="loading">Loading news content...</div>
        ) : errorNews ? (
          <div className="error">{errorNews}</div>
        ) : news ? (
          <>
            {/* News Title and URL */}
            <div className="news-title-container">
              <h2 className="news-title">
                <a href={news.url} target="_blank" rel="noopener noreferrer">
                  {news.title}
                </a>
              </h2>
              <a
                href={news.url}
                target="_blank"
                rel="noopener noreferrer"
                className="news-url-small"
              >
                ({news.url})
              </a>
            </div>

            {/* Metadata Bar */}
            <div className="news-meta">
              <span className="news-points">{news.points? news.points : 0} points</span> by{" "}
              <span className="news-author">{news.author.name}</span>{" "}
              <span className="news-time">
                {relativeTimeFromISOString(news.createdAt)}
              </span>{" "}
              | <a href="#">hide</a> | <a href="#">past</a> |{" "}
              <a href="#">favorite</a> | {news.commentsCount} comments
            </div>

            {/* News Content */}
            {news.text && <p className="news-text">{news.text}</p>}
            {/* Remove the following block since the URL is already displayed next to the title */}

            {/* Comment Input and Button */}
            <div className="add-comment">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add your comment..."
                rows={4}
              ></textarea>
              {submitError && <div className="error">{submitError}</div>}
              <button onClick={handleAddComment} disabled={submitting}>
                {submitting ? "Submitting..." : "Add Comment"}
              </button>
            </div>

            {/* Comments Section */}
            <div className="comments-section">
              {loadingComments ? (
                <div className="loading">Loading comments...</div>
              ) : errorComments ? (
                <div className="error">{errorComments}</div>
              ) : comments.length === 0 ? (
                <p>No comments yet.</p>
              ) : (
                <div className="comments-list">
                  {comments.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} />
                  ))}
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>

      {/* Import Footer */}
      <Footer />
    </div>
  );
};

export default Item;
