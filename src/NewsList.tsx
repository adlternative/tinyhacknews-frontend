import React, { useContext, useState, useEffect } from "react";
import "./NewsList.css";
import { NewsListItem } from "./types";
import relativeTimeFromISOString from "./utils/relativeTimeFromISOString";
import getPureURI from "./utils/uri";
import { UserContext } from "./context/UserContext";
import axiosInstance from "./AxiosInstance";

interface Props {
  news: NewsListItem[];
  currentPage: number;
}

const NewsList: React.FC<Props> = ({ news, currentPage }) => {
  const [newsList, setNewsList] = useState<NewsListItem[]>(news);
  const { username } = useContext(UserContext);

  // 监听 props.news 的变化并更新 newsList 状态
  useEffect(() => {
    setNewsList(news);
  }, [news]);

  const handleVote = async (id: number) => {
    try {
      await axiosInstance.post(`/api/v1/news/${id}/vote`);
      setNewsList((prevNews) =>
        prevNews.map((item) =>
          item.id === id
            ? { ...item, pointsCount: item.pointsCount + 1, hasVote: true }
            : item
        )
      );
      console.log(`success vote for news: ${id}`);
    } catch (error) {
      console.error(`unvote for news failed: ${error}`);
    }
  };

  const handleUnvote = async (id: number) => {
    try {
      await axiosInstance.post(`/api/v1/news/${id}/unvote`);
      setNewsList((prevNews) =>
        prevNews.map((item) =>
          item.id === id
            ? { ...item, pointsCount: item.pointsCount - 1, hasVote: false }
            : item
        )
      );
      console.log(`success unvote for news: ${id}`);
    } catch (error) {
      console.error(`vote for news failed: ${error}`);
    }
  };

  const getNextPageUrl = () => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search.slice(1));
    params.set("p", String(currentPage + 1));
    url.search = params.toString();
    return url.toString();
  };

  return (
    <div className="news-list-container">
      <ul className="news-list">
        {newsList.map((item, index) => (
          <li key={item.id} className="news-list-item">
            <div className="news-list-item-left-part">
              <span className="news-list-number">
                {(currentPage - 1) * 30 + index + 1}.
              </span>
              <div className="voting-section">
                {/* 始终渲染投票按钮或自我标签，占据相同空间 */}
                {item.author.name === username ? (
                  <span className="self-post-tag">*</span>
                ) : (
                  <button
                    className={`vote-button ${item.hasVote ? "hidden" : ""}`}
                    onClick={() => handleVote(item.id)}
                    aria-label={`Vote for ${item.title}`}
                  >
                    <img
                      src="triangle.svg"
                      alt="Vote"
                      className="vote-triangle"
                    />
                  </button>
                )}
              </div>
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
                {`(` + getPureURI(item.url) + `)`}
              </a>
            </div>
            <div className="news-list-item-meta">
              <span> {item.pointsCount} points </span>
              <a href={`/users?name=${item.author.name}`}>{item.author.name}</a>
              <span> {relativeTimeFromISOString(item.updatedAt)} </span>
              {item.hasVote && (
                <button
                  className="unvote-button with-vertical-bar"
                  onClick={() => handleUnvote(item.id)}
                  aria-label={`unvote for ${item.title}`}
                >
                  unvote
                </button>
              )}
              <a href="#" className="with-vertical-bar">
                hide
              </a>
              <a href={`/item?id=${item.id}`} className="with-vertical-bar">
                {item.commentsCount === 0
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
