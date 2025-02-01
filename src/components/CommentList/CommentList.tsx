import React from "react";
import RelativeTimeFromISOString from "utils/RelativeTimeFromISOString";
import { CommentWithNewsMeta } from "types/types";
import styles from "./CommentList.module.css";

interface Props {
  comments: CommentWithNewsMeta[];
  currentPage: number;
}

const CommentList: React.FC<Props> = ({ comments, currentPage }) => {
  const handleVote = (id: number) => {
    console.log(`Voted for ${id}`);
  };

  return (
    <div className={styles.commentListContainer}>
      <ul className={styles.commentList}>
        {comments.map((comment) => (
          <li key={comment.id} className={styles.commentListItem}>
            <button
              className={styles.voteButton}
              onClick={() => handleVote(comment.id)}
              aria-label={`Vote for ${comment.text}`}
              hidden={true}
            >
              <img
                src="triangle.svg"
                alt="Vote"
                className={styles.voteTriangle}
              />
            </button>
            <div className={styles.commentContentWithMeta}>
              <div className={styles.commentMeta}>
                <span>{comment.author.name}</span>{" "}
                <span>{RelativeTimeFromISOString(comment.createdAt)}</span> |{" "}
                <span>on: </span>
                <a
                  href={`/item?id=${comment.newsId}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {comment.newsMeta.title}
                </a>
              </div>
              <div className={styles.commentContent}>
                <p>{comment.text}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <a
        className={styles.commentListMore}
        href={`/comments?p=${currentPage + 1}`}
      >
        More
      </a>
    </div>
  );
};

export default CommentList;
