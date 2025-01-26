// srcomponents/CommentItem.tsx
import React, { useState } from "react";
import RelativeTimeFromISOString from "utils/RelativeTimeFromISOString";
import { Comment } from "types/types"; // Import the Comment interface
import "./CommentItem.css"; // Optional: Separate CSS for CommentItem

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
    <div className="comment-item">
      <div className="comment-header">
        <a
          href={`/users?name=${comment.author.name}`}
          className="comment-author"
        >
          {comment.author.name}
        </a>
        <span className="comment-date">
          {RelativeTimeFromISOString(comment.createdAt)}
        </span>
      </div>
      <div className="comment-text">{comment.text}</div>
      {/* Reply Button */}
      <button
        className="add-child-comment-button"
        onClick={() => setShowReply(true)}
      >
        Reply
      </button>
      {/* Reply Box */}
      {showReply && (
        <div className="reply-box">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Add your reply..."
          ></textarea>
          {error && <div className="error">{error}</div>}
          <div className="reply-buttons">
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
        <div className="comment-children">
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
