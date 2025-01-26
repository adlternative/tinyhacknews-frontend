import React, { useEffect, useState } from "react";
import "./ThreadsPage.css";
import CommentList from "components/CommentList";
import NavBar from 'components/NavBar';
import Footer from "components/Footer";
import { CommentWithNewsMeta, CommentListResponse } from "types/types";
import { useLocation } from "react-router-dom";
import axiosInstance from "utils/AxiosInstance";
import { toast } from "react-toastify";

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
    <div className="threads-page-container">
      <NavBar />
      {error && <p className="error-message">Error: {error}</p>}
      {!error && <CommentList comments={comments} currentPage={pageNum} />}
      <Footer />
    </div>
  );
};

export default ThreadsPage;
