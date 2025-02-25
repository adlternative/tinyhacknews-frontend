import React, { useEffect, useState } from "react";
import NewsList from "components/NewsList";
import { NewsListItem, NewsListResponse } from "types/types";
import { useLocation } from "react-router-dom";
import axiosInstance from "utils/AxiosInstance";
import { toast } from "react-toastify";
import sharedStyles from "styles/shared.module.css";
import PageLayout from "components/PageLayout";

const FrontPage: React.FC = () => {
  const [news, setNews] = useState<NewsListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // 获取当前日期格式化为 YYYY-MM-DD 格式
  const getCurrentDate = (): string => {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString().padStart(4, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // 注意月份是从 0 开始的，所以要加 1
    const day = currentDate.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const dayParam = searchParams.get("day") || getCurrentDate();
  const pParam = searchParams.get("p");

  const pageNum =
    pParam && !isNaN(Number(pParam)) && Number(pParam) > 0 ? Number(pParam) : 1;
  const defaultPageSize = 30;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axiosInstance.get<NewsListResponse>(
          `/api/v1/news/all`,
          {
            params: {
              page_num: pageNum,
              page_size: defaultPageSize,
              date: dayParam,
            },
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        setNews(response.data.list); // 假设返回数据结构中包含一个 news 数组
        setError(null); // 清除之前的错误
      } catch (err: any) {
        toast.error("Error:", err);
        setError(err.message || "Something went wrong");
      }
    };

    fetchNews();
  }, []);

  return (
    <PageLayout>
      {error && <p className={sharedStyles.errorMessage}>Error: {error}</p>}
      <NewsList news={news} currentPage={pageNum} />
    </PageLayout>
  );
};

export default FrontPage;
