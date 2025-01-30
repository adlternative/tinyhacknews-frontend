import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 确保你已经安装并设置了 react-router-dom
import shardStyles from "styles/shared.module.css";
import styles from "./Footer.module.css";
// Guidelines | FAQ | Lists | API | Security | Legal | Apply to YC | Contact
//                              Search:[      ]
const Footer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const email = "adlterantive@gmail.com";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(""); // 可选：清空搜索框
    }
  };
  return (
    <footer className={styles.footer}>
      <div className={shardStyles.dividerLine} style={{ height: "2px" }}></div>
      <div className={styles.footerLinks}>
        <a href="/guidelines">Guidelines</a>
        <a href="/faq">FAQ</a>
        <a href="/api/v1/swagger/swagger-ui/index.html">API</a>
        <a href={`mailto:${email}`}>Contact</a>
      </div>
      <div className={styles.footerSearch}>
        <span>Search:</span>
        <form onSubmit={handleSubmit}>
          <input
            className={styles.searchInput}
            type="text"
            value={searchQuery}
            disabled={true}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>
    </footer>
  );
};
export default Footer;
