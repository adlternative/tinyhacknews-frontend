import React, { useEffect, useState } from "react";
import "./Home.css";
import NavBar from "./NavBar";
import News from "./News";
import Footer from "./Footer";

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

  return (
    <div className="home-container">
      <NavBar />
      {error && <p className="error-message">Error: {error}</p>}
      <News news={news} />
      <Footer />
    </div>
  );
};

export default Home;
