import React, { useContext, useState, useEffect } from "react";
import { NewsListItem } from "types/types";
import RelativeTimeFromISOString from "utils/RelativeTimeFromISOString";
import GetPureURI from "utils/URI";
import { UserContext } from "contexts/UserContext";
import axiosInstance from "utils/AxiosInstance";
import { toast } from "react-toastify";
import styles from "./NewsList.module.css";
import sharedStyles from "styles/shared.module.css";

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
      toast.error(`unvote for news failed: ${error}`);
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
      toast.error(`vote for news failed: ${error}`);
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
    <div className={styles.newsListContainer}>
      <ul className={styles.newsList}>
        {newsList.map((item, index) => (
          <li key={item.id} className={styles.newsListItem}>
            <div className={styles.newsListItemLeftPart}>
              <span className={styles.newsListNumber}>
                {(currentPage - 1) * 30 + index + 1}.
              </span>
              <div className={styles.votingSection}>
                {/* 始终渲染投票按钮或自我标签，占据相同空间 */}
                {item.author.name === username ? (
                  <span className={sharedStyles.selfTag}>*</span>
                ) : (
                  <button
                    className={`${styles.voteButton} ${
                      item.hasVote ? sharedStyles.hidden : ""
                    }`}
                    onClick={() => handleVote(item.id)}
                    aria-label={`Vote for ${item.title}`}
                  >
                    <img
                      src="triangle.svg"
                      alt="Vote"
                      className={styles.voteTriangle}
                    />
                  </button>
                )}
              </div>
            </div>
            <div className={styles.newsContent}>
              <a
                href={item.url.length > 0 ? item.url : `/item?id=${item.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.newsListTitleLink}
              >
                <h2 className={styles.newsListItemTitle}>{item.title}</h2>
              </a>
              {item.url.length > 0 && (
                <a
                  className={styles.newsListItemLink}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {`(` + GetPureURI(item.url) + `)`}
                </a>
              )}
            </div>
            <div className={styles.newsListItemMeta}>
              <span> {item.pointsCount} points </span>
              <a href={`/users?name=${item.author.name}`}>{item.author.name}</a>
              <span> {RelativeTimeFromISOString(item.updatedAt)} </span>
              {item.hasVote && (
                <button
                  className={`${styles.withVerticalBar} ${styles.unvoteButton}`}
                  onClick={() => handleUnvote(item.id)}
                  aria-label={`unvote for ${item.title}`}
                >
                  unvote
                </button>
              )}
              <a
                href={`/item?id=${item.id}`}
                className={styles.withVerticalBar}
              >
                {item.commentsCount === 0
                  ? "discuss"
                  : item.commentsCount + " comments"}
              </a>
            </div>
          </li>
        ))}
      </ul>

      {/* 灰色的 More 展示下一页的链接 */}
      <a className={styles.newsListMore} href={getNextPageUrl()}>
        More
      </a>
    </div>
  );
};

export default NewsList;
