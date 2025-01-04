import React, { useEffect, useState } from "react";
import "./Home.css";
import NavBar from "./NavBar"; // 导入 NavBar 组件

interface NewsItem {
  id: number;
  title: string;
  text: string;
  url: string;
  // 根据你实际的 API 数据格式定义其他字段
}

const Home: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // 定义一个异步函数来获取数据
    const fetchNews = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/v1/news/all?page=1&page_size=30",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              // 如果需要身份验证，确保请求头中包含任何必要的身份验证令牌
            },
            credentials: "include", // 确保发送和接收 Cookie
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch news: ${response.statusText}`);
        }

        const data = await response.json();
        setNews(data.records); // 假设返回数据结构中包含一个 news 数组
        setError(null); // 清除之前的错误
      } catch (err: any) {
        console.error("Error:", err);
        setError(err.message || "Something went wrong");
      }
    };

    // 调用获取数据函数
    fetchNews();
  }, []); // 空依赖数组确保此效果只在组件首次挂载时运行
  const handleLogout = async () => {};

  return (
    <div className="home-container">
      <NavBar username={username} onLogout={handleLogout} />
      {error && <p className="error-message">Error: {error}</p>}
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
              {"(" + item.url + ")"}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
