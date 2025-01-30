import React from "react";
import styles from "./NotFoundPage.module.css";
import NavBar from "components/NavBar";
import Footer from "components/Footer";
import sharedStyles from "styles/shared.module.css";

const NotFound: React.FC = () => {
  return (
    <div className={sharedStyles.homeContainer}>
      <NavBar />
      <div className={styles.notFoundContainer}>
        <div className={styles.notFoundText}>
          <span className={styles.largeText}>404</span>
          <span className={styles.smallText}>Not Found</span>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
