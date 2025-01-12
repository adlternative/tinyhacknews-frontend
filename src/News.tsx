import React from "react";
import "./News.css";
import { NewsItem } from "./type";
import relativeTimeFromISOString from "./utils/relativeTimeFromISOString";

interface Props {
  news: NewsItem[];
  currentPage: number;
}

const News: React.FC<Props> = ({ news, currentPage }) => {
  const handleVote = (id: number) => {
    console.log(`Voted for ${id}`);
  };

  return (
    <div className="news-container">
      <ul className="news-list">
        {news.map((item, index) => (
          <li key={item.id} className="news-item">
            <span className="news-number">
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
                  className="news-title-link"
                >
                  <h2 className="news-title">{item.title}</h2>
                </a>
                <a
                  className="news-link"
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {`(${item.url})`}
                </a>
              </div>
              <div className="news-meta">
                <span> 0 points </span>
                <span> by {item.author.name} </span>
                <span> {relativeTimeFromISOString(item.updatedAt)} </span>
                <span> | hide | </span>
                <span> 0 comments </span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* 灰色的 More 展示下一页的链接 */}
      <a className="news-more" href={`/news?p=${currentPage + 1}`}>
        More
      </a>
    </div>
  );
};

export default News;
