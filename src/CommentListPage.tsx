import React, { useEffect, useState } from "react";
import "./CommentListPage.css";
import CommentList from "./CommentList";
import NavBar from './components/NavBar';
import Footer from "./Footer";
import { CommentWithNewsMeta, CommentListResponse } from "./types";
import { useLocation } from "react-router-dom";
import axiosInstance from "./AxiosInstance";
import { toast } from "react-toastify";

const CommentListPage: React.FC = () => {
  const [comments, setComments] = useState<CommentWithNewsMeta[]>([]);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const pParam = searchParams.get("p");
  const pageNum =
    pParam && !isNaN(Number(pParam)) && Number(pParam) > 0 ? Number(pParam) : 1;
  const pageSize = 30;

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axiosInstance.get<CommentListResponse>(
          `/api/v1/comments/all`,
          {
            params: {
              page_num: pageNum,
              page_size: pageSize,
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
        toast.error("Error:", err);
        setError(err.message || "Something went wrong");
      }
    };

    fetchComments();
  }, []);

  return (
    <div className="comment-list-page-container">
      <NavBar />
      {error && <p className="error-message">Error: {error}</p>}
      <CommentList comments={comments} currentPage={pageNum} />
      <Footer />
    </div>
  );
};

export default CommentListPage;
