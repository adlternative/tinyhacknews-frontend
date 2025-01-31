import React from "react";
import styles from "./NotFoundPage.module.css";
import PageLayout from "components/PageLayout";

const NotFound: React.FC = () => {
  return (
    <PageLayout>
      <div className={styles.notFoundContainer}>
        <div className={styles.notFoundText}>
          <span className={styles.largeText}>404</span>
          <span className={styles.smallText}>Not Found</span>
        </div>
      </div>
    </PageLayout>
  );
};

export default NotFound;
