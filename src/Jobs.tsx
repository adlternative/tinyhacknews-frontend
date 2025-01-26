import React, { useEffect, useState } from "react";
import "./Home.css";
import NavBar from "./NavBar";
import NewsList from "./NewsList";
import Footer from "./Footer";
import { NewsListItem, NewsListResponse } from "./types";
import { useLocation } from "react-router-dom";
import axiosInstance from "./AxiosInstance";
import { toast } from "react-toastify";

const Jobs: React.FC = () => {
  const [news, setNews] = useState<NewsListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const pParam = searchParams.get("p");
  const pageNum =
    pParam && !isNaN(Number(pParam)) && Number(pParam) > 0 ? Number(pParam) : 1;
  const defaultPageSize = 30;
  const newsType = "JOBS";

  useEffect(() => {
    // 定义一个异步函数来获取数据
    const fetchNews = async () => {
      try {
        const response = await axiosInstance.get<NewsListResponse>(
          `/api/v1/news/all`,
          {
            params: {
              page_num: pageNum,
              page_size: defaultPageSize,
              type: newsType,
            },
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        setNews(response.data.records); // 假设返回数据结构中包含一个 news 数组
        setError(null); // 清除之前的错误
      } catch (err: any) {
        toast.error("Error:", err);
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
      <NewsList news={news} currentPage={pageNum} />
      <Footer />
    </div>
  );
};

export default Jobs;
