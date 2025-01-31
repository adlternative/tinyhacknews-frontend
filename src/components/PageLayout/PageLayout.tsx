// src/components/PageLayout.tsx
import React from "react";
import NavBar from "../NavBar";
import Footer from "../Footer";
import shardStyles from "styles/shared.module.css"; // 假设 shared.module.css 中有 homeContainer 样式
import styles from "./PageLayout.module.css";

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <div className={shardStyles.homeContainer}>
      <NavBar />
      <div className={shardStyles.mainContent}>
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default PageLayout;