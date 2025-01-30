// srcomponents/NewsItem.tsx
import React, { useEffect, useState, useCallback, useContext } from "react";
import axios, { AxiosError } from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "components/NavBar";
import Footer from "components/Footer";
import RelativeTimeFromISOString from "utils/RelativeTimeFromISOString";
import CommentItem from "components/CommentItem";
import { Comment, News, NewsCommentsResponse } from "types/types";
import GetPureURI from "utils/URI";
import axiosInstance from "utils/AxiosInstance";
import { UserContext } from "contexts/UserContext"; // Import UserContext
import { toast } from "react-toastify";
import sharedStyles from "styles/shared.module.css";
import styles from "./NewsItemPage.module.css";

const NewsItem: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  const { username, loading: userLoading } = useContext(UserContext);

  const [news, setNews] = useState<News | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingNews, setLoadingNews] = useState<boolean>(true);
  const [loadingComments, setLoadingComments] = useState<boolean>(true);
  const [errorNews, setErrorNews] = useState<string | null>(null);
  const [errorComments, setErrorComments] = useState<string | null>(null);
  const [newComment, setNewComment] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();

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
      const response = await axiosInstance.get<News>(`/api/v1/news/${id}`);
      setNews(response.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.status === 404) {
          // 跳转到 404 页面
          navigate("/404");
          return;
        }

        setErrorNews(err.message);
      } else {
        setErrorNews("An unexpected error occurred");
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
      const response = await axiosInstance.get<NewsCommentsResponse>(
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
      toast.error(`error: ${err}`);
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

        const response = await axiosInstance.post<Comment>(
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
                return comment; // 保持不变避免引用变化
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
        toast.error(`error: ${err}`);
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

  // Voting functions
  const handleVote = async () => {
    if (!id) return;
    try {
      await axiosInstance.post(`/api/v1/news/${id}/vote`);
      setNews((prevNews) =>
        prevNews
          ? {
              ...prevNews,
              pointsCount: prevNews.pointsCount + 1,
              hasVote: true,
            }
          : prevNews
      );
      console.log(`Successfully voted for news: ${id}`);
    } catch (error) {
      toast.error(`Vote failed for news ${id}:` + error);
    }
  };

  const handleUnvote = async () => {
    if (!id) return;
    try {
      await axiosInstance.post(`/api/v1/news/${id}/unvote`);
      setNews((prevNews) =>
        prevNews
          ? {
              ...prevNews,
              pointsCount: prevNews.pointsCount - 1,
              hasVote: false,
            }
          : prevNews
      );
      console.log(`Successfully unvoted for news: ${id}`);
    } catch (error) {
      toast.error(`Unvote failed for news ${id}:` + error);
    }
  };

  // Determineif the current user is the author

  return (
    <div className={sharedStyles.homeContainer}>
      {/* NavBar */}
      <NavBar />

      {/* Main content area */}
      <div className={styles.newsItemContainer}>
        {userLoading || loadingNews ? (
          <div className={styles.loading}>Loading news content...</div>
        ) : errorNews ? (
          <div className={styles.error}>{errorNews}</div>
        ) : news ? (
          <>
            {/* News Title and URL */}
            <div className={styles.newsTitleContainer}>
              {/* Voting Section on the Left */}
              {username === news.author.name ? (
                <span className={sharedStyles.selfTag}>*</span>
              ) : (
                <button
                  className={`${styles.voteButton} ${
                    news.hasVote ? sharedStyles.hidden : ""
                  }`}
                  onClick={handleVote}
                  aria-label={`Vote for ${news.title}`}
                >
                  <img
                    src="triangle.svg"
                    alt="Vote"
                    className={styles.voteTriangle}
                  />
                </button>
              )}

              {/* Title and URL */}
              <h2 className={styles.newsTitle}>
                <a href={news.url} target="_blank" rel="noopener noreferrer">
                  {news.title}
                </a>
              </h2>
              <a
                href={news.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.newsUrlSmall}
              >
                ({GetPureURI(news.url)})
              </a>
            </div>

            {/* Metadata Bar */}
            <div className={styles.newsMeta}>
              <span className={styles.newsPoints}>
                {news.pointsCount ? news.pointsCount : 0} points
              </span>{" "}
              by
              <a
                href={`/user?id=${news.author.name}`}
                className={styles.newsAuthor}
              >
                {news.author.name}
              </a>
              <span className={styles.newsTime}>
                {RelativeTimeFromISOString(news.createdAt)}
              </span>{" "}
              <a href="#">past</a> | <a href="#">favorite</a> |
              <a href="#">
                {news.commentsCount === 0
                  ? "discuss"
                  : news.commentsCount + " comments"}
              </a>
              {/* Unvote Button for Author's Own News */}
              {news.hasVote && (
                <button
                  className={`${styles.withVerticalBar} ${styles.unvoteButton}`}
                  onClick={handleUnvote}
                  aria-label={`Unvote for ${news.title}`}
                >
                  unvote
                </button>
              )}
            </div>

            {/* News Content */}
            {news.text && <p className={styles.newsText}>{news.text}</p>}

            {/* Comment Input and Button */}
            <div className={styles.addComment}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add your comment..."
                rows={4}
              ></textarea>
              {submitError && <div className={styles.error}>{submitError}</div>}
              <button onClick={handleAddComment} disabled={submitting}>
                Add Comment
              </button>
            </div>

            {/* Comments Section */}
            <div className={styles.commentsSection}>
              {loadingComments ? (
                <div className={styles.loading}>Loading comments...</div>
              ) : errorComments ? (
                <div className={styles.error}>{errorComments}</div>
              ) : comments.length === 0 ? (
                <p>No comments yet.</p>
              ) : (
                <div className={styles.commentsList}>
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
