import React from "react";
import "./News.css";

interface NewsItem {
  id: number;
  title: string;
  text: string;
  url: string;
  // 根据你实际的 API 数据格式定义其他字段
}

interface Props {
  news: NewsItem[];
}

const News: React.FC<Props> = ({ news }) => {
  return (
    <div className="news-container">
      <ul className="news-list">
        {news.map((item) => (
          <li key={item.id} className="news-item">
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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default News;
