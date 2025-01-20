import React from "react";
import "./NewsList.css";
import { NewsListItem } from "./types";
import relativeTimeFromISOString from "./utils/relativeTimeFromISOString";

interface Props {
  news: NewsListItem[];
  currentPage: number;
}

const NewsList: React.FC<Props> = ({ news, currentPage }) => {
  const handleVote = (id: number) => {
    console.log(`Voted for ${id}`);
  };

  return (
    <div className="news-list-container">
      <ul className="news-list">
        {news.map((item, index) => (
          <li key={item.id} className="news-list-item">
            <span className="news-list-number">
              {(currentPage - 1) * 30 + index + 1}.
            </span>
            <button
              className="vote-button"
              onClick={() => handleVote(item.id)}
              aria-label={`Vote for ${item.title}`}
            >
              <img
                src="public/triangle.svg"
                alt="Vote"
                className="vote-triangle"
              />
            </button>
            <div className="news-content-with-meta">
              <div className="news-content">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="news-list-title-link"
                >
                  <h2 className="news-list-item-title">{item.title}</h2>
                </a>
                <a
                  className="news-list-item-link"
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {`(${item.url})`}
                </a>
              </div>
              <div className="news-list-item-meta">
                <span> 0 points </span>
                <span> by {item.author.name} </span>
                <span> {relativeTimeFromISOString(item.updatedAt)} </span>
                <span> | hide | </span>
                <a href={`/item?id=${item.id}`}>0 comments</a>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* 灰色的 More 展示下一页的链接 */}
      <a className="news-list-more" href={`/news?p=${currentPage + 1}`}>
        More
      </a>
    </div>
  );
};

export default NewsList;
