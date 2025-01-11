import React from "react";
import "./News.css";
import { NewsItem } from "./type";
import relativeTimeFromISOString  from "./utils/relativeTimeFromISOString";

interface Props {
  news: NewsItem[];
}

const News: React.FC<Props> = ({ news }) => {
  return (
    <div className="news-container">
      <ul className="news-list">
        {news.map((item) => (
          <li key={item.id} className="news-item">
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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default News;
