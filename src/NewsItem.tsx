// src/components/NewsItem.tsx
import React, { useEffect, useState, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { useLocation } from "react-router-dom";
import "./NewsItem.css";
import NavBar from "./NavBar";
import Footer from "./Footer";
import relativeTimeFromISOString from "./utils/relativeTimeFromISOString";
import CommentItem from "./CommentItem";
import { Comment, News, NewsCommentsResponse } from "./types";
import getPureURI from "./utils/uri";

const NewsItem: React.FC = () => {
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

  // Function to build comments tree from flat list
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

  // Fetch news content
  const fetchNews = useCallback(async () => {
    if (!id) {
      setErrorNews("News ID not provided.");
      setLoadingNews(false);
      return;
    }

    setLoadingNews(true);
    setErrorNews(null);
    try {
      const response = await axios.get<News>(`/api/v1/news/${id}`);
      setNews(response.data);
    } catch (error) {
      const err = error as AxiosError;
      console.error(err);
      if (err.response) {
        // Server responded with a status other than 2xx
        setErrorNews(
          `Failed to fetch news content: ${err.response.status} ${err.response.statusText}`
        );
      } else if (err.request) {
        // Request was made but no response received
        setErrorNews("Failed to fetch news content: No response from server.");
      } else {
        // Something else happened
        setErrorNews(`Failed to fetch news content: ${err.message}`);
      }
    } finally {
      setLoadingNews(false);
    }
  }, [id]);

  // Fetch comments
  const fetchComments = useCallback(async () => {
    if (!id) {
      setErrorComments("News ID not provided.");
      setLoadingComments(false);
      return;
    }

    setLoadingComments(true);
    setErrorComments(null);
    try {
      const response = await axios.get<NewsCommentsResponse>(
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
    } catch (error) {
      const err = error as AxiosError;
      console.error(err);
      if (err.response) {
        setErrorComments(
          `Failed to fetch comments: ${err.response.status} ${err.response.statusText}`
        );
      } else if (err.request) {
        setErrorComments("Failed to fetch comments: No response from server.");
      } else {
        setErrorComments(`Failed to fetch comments: ${err.message}`);
      }
    } finally {
      setLoadingComments(false);
    }
  }, [id]);

  // Fetch news and comments on component mount or when id changes
  useEffect(() => {
    fetchNews();
    fetchComments();
  }, [fetchNews, fetchComments]);

  /**
   * 通用的添加评论函数
   * @param text 评论文本
   * @param parentCommentId 可选的父评论ID
   */
  const addComment = useCallback(
    async (text: string, parentCommentId?: number) => {
      if (!text.trim()) {
        throw new Error("Comment cannot be empty.");
      }

      setSubmitting(true);
      setSubmitError(null);

      try {
        // 构建请求体
        const requestBody: any = { text };
        if (parentCommentId !== undefined) {
          requestBody.parentCommentId = parentCommentId;
        }

        const response = await axios.post<Comment>(
          `/api/v1/news/${id}/comments`,
          requestBody
        );

        const addedComment = { ...response.data, children: [] };

        // 更新本地评论树
        setComments((prevComments) => {
          if (
            addedComment.parentCommentId === null ||
            addedComment.parentCommentId === undefined
          ) {
            // 根评论直接添加
            return [...prevComments, addedComment];
          } else {
            let didChange = false;

            const addChild = (commentsList: Comment[]): Comment[] => {
              return commentsList.map((comment) => {
                if (comment.id === addedComment.parentCommentId) {
                  didChange = true;
                  return {
                    ...comment,
                    children: comment.children
                      ? [...comment.children, addedComment]
                      : [addedComment],
                  };
                } else if (comment.children && comment.children.length > 0) {
                  const newChildren = addChild(comment.children);
                  if (newChildren !== comment.children) {
                    didChange = true;
                    return {
                      ...comment,
                      children: newChildren,
                    };
                  }
                }
                return comment; // 保持不变，避免引用变化
              });
            };

            const newComments = addChild(prevComments);
            return didChange ? newComments : prevComments;
          }
        });

        // 如果是根评论，清空 newComment
        if (!parentCommentId) {
          setNewComment("");
        }
      } catch (error) {
        const err = error as AxiosError;
        console.error(err);
        if (err.response) {
          throw new Error(
            `Failed to add comment: ${err.response.status} ${err.response.statusText}`
          );
        } else if (err.request) {
          throw new Error("Failed to add comment: No response from server.");
        } else {
          throw new Error(`Failed to add comment: ${err.message}`);
        }
      } finally {
        setSubmitting(false);
      }
    },
    [id]
  );

  // Handle adding a root comment
  const handleAddComment = async () => {
    try {
      await addComment(newComment);
    } catch (error: any) {
      setSubmitError(error.message);
    }
  };

  return (
    <div className="page-container">
      {/* NavBar */}
      <NavBar />

      {/* Main content area */}
      <div className="news-item-container">
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
                ({getPureURI(news.url)})
              </a>
            </div>

            {/* Metadata Bar */}
            <div className="news-meta">
              <span className="news-points">
                {news.points ? news.points : 0} points
              </span>{" "}
              by
              <a href={`/user?id=${news.author.name}`} className="news-author">
                {news.author.name}
              </a>
              <span className="news-time">
                {relativeTimeFromISOString(news.createdAt)}
              </span>{" "}
              | <a href="#">hide</a> | <a href="#">past</a> |{" "}
              <a href="#">favorite</a> |
              <a href="#">{news.commentsCount} comments</a>
            </div>

            {/* News Content */}
            {news.text && <p className="news-text">{news.text}</p>}

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
                Add Comment
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
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      addComment={addComment}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default NewsItem;
