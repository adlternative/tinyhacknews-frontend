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

  const getNextPageUrl = () => {
    let url = new URL(window.location.href);
    let params = new URLSearchParams(url.search.slice(1));
    params.set("p", String(currentPage + 1));
    url.search = params.toString();
    return url.toString();
  };

  return (
    <div className="news-list-container">
      <ul className="news-list">
        {news.map((item, index) => (
          <li key={item.id} className="news-list-item">
            <div className="news-list-item-left-part">
              <span className="news-list-number">
                {(currentPage - 1) * 30 + index + 1}.
              </span>
              <button
                className="vote-button"
                onClick={() => handleVote(item.id)}
                aria-label={`Vote for ${item.title}`}
              >
                <img src="triangle.svg" alt="Vote" className="vote-triangle" />
              </button>
            </div>
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
              <span> {item.pointsCount} points </span>
              {/* <span> by {item.author.name} </span> */}
              <a href={`/users?name=${item.author.name}`}>{item.author.name}</a>
              <span> {relativeTimeFromISOString(item.updatedAt)} </span>
              <a href="#" className="with-vertical-bar">
                hide
              </a>
              <a href={`/item?id=${item.id}`}>
                {item.commentsCount == 0
                  ? "discuss"
                  : item.commentsCount + " comments"}
              </a>
            </div>
          </li>
        ))}
      </ul>

      {/* 灰色的 More 展示下一页的链接 */}
      <a className="news-list-more" href={getNextPageUrl()}>
        More
      </a>
    </div>
  );
};

export default NewsList;
