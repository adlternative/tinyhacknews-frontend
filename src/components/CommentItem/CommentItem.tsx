// srcomponents/CommentItem.tsx
import React, { useState } from "react";
import RelativeTimeFromISOString from "utils/RelativeTimeFromISOString";
import { Comment } from "types/types"; // Import the Comment interface
import styles from "./CommentItem.module.css";

interface CommentItemProps {
  comment: Comment;
  addComment: (text: string, parentCommentId?: number) => Promise<void>;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, addComment }) => {
  const [showReply, setShowReply] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleReply = async () => {
    if (!replyText.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await addComment(replyText, comment.id);
      setReplyText("");
      setShowReply(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setReplyText("");
    setError(null);
    setShowReply(false);
  };

  return (
    <div className={styles.commentItem}>
      <div className={styles.commentHeader}>
        <a
          href={`/users?name=${comment.author.name}`}
          className={styles.commentAuthor}
        >
          {comment.author.name}
        </a>
        <span className={styles.commentDate}>
          {RelativeTimeFromISOString(comment.createdAt)}
        </span>
      </div>
      <div className={styles.commentText}>{comment.text}</div>
      {/* Reply Button */}
      <button
        className={styles.addChildCommentButton}
        onClick={() => setShowReply(true)}
      >
        Reply
      </button>
      {/* Reply Box */}
      {showReply && (
        <div className={styles.replyBox}>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Add your reply..."
          ></textarea>
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.replyButtons}>
            <button onClick={handleReply} disabled={submitting}>
              Submit
            </button>
            <button onClick={handleCancel} disabled={submitting}>
              Cancel
            </button>
          </div>
        </div>
      )}
      {/* Render Children Comments */}
      {comment.children && comment.children.length > 0 && (
        <div className={styles.commentChildren}>
          {comment.children.map((child: Comment) => (
            <CommentItem
              key={child.id}
              comment={child}
              addComment={addComment}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
