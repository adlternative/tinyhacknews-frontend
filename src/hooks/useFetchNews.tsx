import { useState, useEffect } from "react";
import axiosInstance from "utils/AxiosInstance";
import { NewsListResponse, NewsListItem } from "types/types";
import { toast } from "react-toastify";

interface FetchNewsProps {
  pageNum?: number;
  pageSize?: number;
  newsType?: string;
  order?: string;
}

export const useFetchNews = ({
  pageNum = 1,
  pageSize = 30,
  newsType,
  order = "POINT",
}: FetchNewsProps): [boolean, NewsListItem[], string | null] => {
  const [news, setNews] = useState<NewsListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get<NewsListResponse>(
          "/api/v1/news/all",
          {
            params: {
              page_num: pageNum,
              page_size: pageSize,
              order: order,
              ...(newsType ? { type: newsType } : {}),
            },
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        setNews(response.data.list);
        setError(null);
      } catch (err) {
        toast.error(`fetch news failed, Error: ${err}`);
        setError("fetch news failed");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [pageNum, pageSize, newsType]);

  return [loading, news, error];
};
