import React, { useState } from "react";
import NavBar from "components/NavBar";
import axiosInstance from "utils/AxiosInstance";
import { useNavigate } from "react-router-dom"; // 确保你已经安装并设置了 react-router-dom
import { toast } from "react-toastify";
import shardStyles from "styles/shared.module.css";
import styles from "./SubmitPage.module.css";
import { News } from "types/types";
import axios from "axios";

const Submit: React.FC = () => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const data = { title, url, text };

    axiosInstance
      .post<News>("/api/v1/news", data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        toast.success("Submit News success");
        navigate(`/item?id=${response.data.id}`);
      })
      .catch((err) => {
        // 根据不同的错误类型设置错误信息
        if (axios.isAxiosError(err)) {
          setError(err.response?.data || err.message);
          toast.error(`Submit failed: ${error}`);
        } else {
          setError("An unexpected error occurred");
          toast.error("Submit failed");
        }
      })
      .finally(() => {
        setTitle("");
        setUrl("");
        setText("");
        setLoading(false);
      });
  };
  return (
    <div className={shardStyles.homeContainer}>
      <NavBar />
      <form className={styles.submitNewsForm} onSubmit={handleSubmit}>
        <label className={styles.submitNewsLabel} htmlFor="title">
          title
        </label>
        <input
          className={styles.submitNewsInput}
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label className={styles.submitNewsLabel} htmlFor="url">
          url
        </label>
        <input
          className={styles.submitNewsInput}
          type="url"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <label className={styles.submitNewsLabel} htmlFor="text">
          text
        </label>
        <textarea
          id="text"
          className={styles.submitNewsInputTextArea}
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>

        <button
          className={styles.submitNewsButton}
          type="submit"
          disabled={loading}
        >
          {loading ? "Submiting..." : "Submit"}
        </button>

        <p className={styles.submitNewsHint}>
          {" "}
          Leave url blank to submit a question for discussion. If there is no
          url, text will appear at the top of the thread. If there is a url,
          text is optional.{" "}
        </p>
      </form>
    </div>
  );
};

export default Submit;
