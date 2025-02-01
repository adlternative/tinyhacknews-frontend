import React, { useContext } from "react";
import { UserContext } from "contexts/UserContext";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axiosInstance from "utils/AxiosInstance";
import { toast } from "react-toastify";
import styles from "./NavBar.module.css";

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

  // 定义右侧导航链接
  const rightLinks = username
    ? [
        {
          type: "link",
          label: username,
          href: `/users?name=${encodeURIComponent(username)}`,
        },
        { type: "button", label: "logout", onClick: handleLogout },
      ]
    : [
        { type: "link", label: "login", href: "/login" },
        { type: "link", label: "register", href: "/register" },
      ];

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLeft}>
        <a href="/" className={styles.navbarHomeLink}>
          <img src="/y18.svg" alt="Y18N Icon" className={styles.navbarIcon} />
          <span className={styles.navbarTitle}>Tiny Hacker News</span>
        </a>
        {links.map((link, index) => (
          <React.Fragment key={index}>
            <a href={link.href} className={styles.navbarLink}>
              {link.label}
            </a>
            {index !== links.length - 1 && (
              <span className={styles.navbarSeparator}>|</span>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className={styles.navbarRight}>
        {rightLinks.map((link, index) => (
          <React.Fragment key={index}>
            {link.type === "link" ? (
              <a href={link.href} className={styles.navbarLink}>
                {link.label}
              </a>
            ) : (
              <button className={styles.navbarButton} onClick={link.onClick}>
                {link.label}
              </button>
            )}
            {index !== rightLinks.length - 1 && (
              <span className={styles.navbarSeparator}>|</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};

export default NavBar;
