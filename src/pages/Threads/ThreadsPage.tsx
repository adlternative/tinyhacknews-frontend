import React, { useEffect, useState } from "react";
import CommentList from "components/CommentList";
import { CommentWithNewsMeta, CommentListResponse } from "types/types";
import { useLocation } from "react-router-dom";
import axiosInstance from "utils/AxiosInstance";
import { toast } from "react-toastify";
import sharedStyles from "styles/shared.module.css";
import PageLayout from "components/PageLayout";
// import styles from "./ThreadsPage.module.css";

const ThreadsPage: React.FC = () => {
  const [comments, setComments] = useState<CommentWithNewsMeta[]>([]);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const username = searchParams.get("id");

  // 提取分页参数
  const pParam = searchParams.get("p");
  const pageNum =
    pParam && !isNaN(Number(pParam)) && Number(pParam) > 0 ? Number(pParam) : 1;

  const pageSize = 30;

  useEffect(() => {
    if (!username) {
      setError("Username must be specified.");
      return;
    }

    const fetchComments = async () => {
      try {
        const response = await axiosInstance.get<CommentListResponse>(
          `/api/v1/comments/all`,
          {
            params: {
              page_num: pageNum,
              page_size: pageSize,
              user_name: username,
            },
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        setComments(response.data.records);
        setError(null);
      } catch (err: any) {
        toast.error("Error:" + err);
        setError(err.message || "Something went wrong");
      }
    };

    fetchComments();
  }, [username]);

  return (
    <PageLayout>
      {error && <p className={sharedStyles.errorMessage}>Error: {error}</p>}
      {!error && <CommentList comments={comments} currentPage={pageNum} />}
    </PageLayout>
  );
};

export default ThreadsPage;
