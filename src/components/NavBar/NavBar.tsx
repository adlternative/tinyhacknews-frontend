import React, { useContext } from "react";
import "./NavBar.css";
import { UserContext } from "contexts/UserContext";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axiosInstance from "utils/AxiosInstance";
import { toast } from "react-toastify";

const NavBar: React.FC = () => {
  const { username, setUsername } = useContext(UserContext);
  const navigate = useNavigate();

  const links = [
    { label: "new", href: "/news" },
    { label: "threads", href: `/threads?id=${username}` },
    { label: "past", href: "/front" },
    { label: "comments", href: "/comments" },
    { label: "ask", href: "/ask" },
    { label: "show", href: "/show" },
    { label: "jobs", href: "/jobs" },
    { label: "submit", href: "/submit" },
  ];

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post(
        "/api/v1/users/logout",
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("Logout success:", response.data);
      // 清理 jwt cookie
      Cookies.remove("jwt");

      setUsername(null); // 清除 UserContext 中的用户名
      navigate("/login");
    } catch (error) {
      toast.error(`error: ${error}`);
      // 处理错误
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {/* 包装图标和标题，使其都可点击跳转到首页 */}
        <a href="/" className="navbar-home-link">
          <img src="/y18.svg" alt="Y18N Icon" className="navbar-icon" />
          <span className="navbar-title">Tiny Hacker News</span>
        </a>
        {links.map((link, index) => (
          <React.Fragment key={index}>
            <a href={link.href} className="navbar-link">
              {link.label}
            </a>
            {index !== links.length - 1 && (
              <span className="navbar-separator">|</span>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="navbar-right">
        {username ? (
          <>
            <a
              href={`/users?name=${encodeURIComponent(username)}`}
              className="navbar-username"
            >
              {username}
            </a>
            <span className="navbar-separator">|</span>
            <button className="navbar-logout" onClick={handleLogout}>
              logout
            </button>
          </>
        ) : (
          <a href="/login" className="navbar-link">
            login
          </a>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
