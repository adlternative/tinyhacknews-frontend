import React, { useState } from "react";
import "./Submit.css"; // 假设这是样式文件路径
import NavBar from "./NavBar";
import axios from "axios";
import { toast } from "react-toastify";

const Submit: React.FC = () => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const data = { title, url, text };

    axios
      .post("/api/v1/news", data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        setTitle("");
        setUrl("");
        setText("");
        setSuccess(true);
        console.log("Submit success:", response.data);
      })
      .catch((error) => {
        toast.error("Submit failed:" + error);
        // 根据不同的错误类型设置错误信息
        if (error.response) {
          // 服务器返回了状态码
          setError(error.response.data.message || "Submit failed");
        } else if (error.request) {
          // 请求已发出但未收到响应
          setError("Network error, please try again later");
        } else {
          // 其他错误
          setError(error.message || "提交失败");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div className="submit-container">
      <NavBar />
      {error && <p className="submit-news-error">{error}</p>}
      {success && <p className="submit-news-success">Submit Success!</p>}

      <form className="submit-news-form" onSubmit={handleSubmit}>
        <label className="submit-news-label" htmlFor="title">
          title
        </label>
        <input
          className="submit-news-input"
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label className="submit-news-label" htmlFor="url">
          url
        </label>
        <input
          className="submit-news-input"
          type="url"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <label className="submit-news-label" htmlFor="text">
          text
        </label>
        <textarea
          id="text"
          className="submit-news-input-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>

        <button className="submit-news-button" type="submit" disabled={loading}>
          {loading ? "Submiting..." : "Submit"}
        </button>

        <p className="submit-news-hit">
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
