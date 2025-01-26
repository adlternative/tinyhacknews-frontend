import React from "react";
import "./CommentList.css";
import RelativeTimeFromISOString from "utils/RelativeTimeFromISOString";
import { CommentWithNewsMeta } from "types/types";

interface Props {
  comments: CommentWithNewsMeta[];
  currentPage: number;
}

const CommentList: React.FC<Props> = ({ comments, currentPage }) => {
  const handleVote = (id: number) => {
    console.log(`Voted for ${id}`);
  };

  return (
    <div className="comment-list-container">
      <ul className="comment-list">
        {comments.map((comment) => (
          <li key={comment.id} className="comment-list-item">
            <button
              className="vote-button"
              onClick={() => handleVote(comment.id)}
              aria-label={`Vote for ${comment.text}`}
            >
              <img
                src="triangle.svg"
                alt="Vote"
                className="vote-triangle"
              />
            </button>
            <div className="comment-content-with-meta">
              <div className="comment-meta">
                <span>{comment.author.name}</span>{" "}
                <span>{RelativeTimeFromISOString(comment.createdAt)}</span> |{" "}
                <span>on: </span>
                <a
                  href={`/news/${comment.newsId}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {comment.newsMeta.title}
                </a>
              </div>
              <div className="comment-content">
                <p>{comment.text}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <a className="comment-list-more" href={`/comments?p=${currentPage + 1}`}>
        More
      </a>
    </div>
  );
};

export default CommentList;
