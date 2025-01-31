import React from "react";
import NewsList from "components/NewsList";
import { useLocation } from "react-router-dom";
import { useFetchNews } from "hooks/useFetchNews";
// import styles from "./HomePage.module.css"; // 页面特定样式
import PageLayout from "components/PageLayout";

const Home: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const pParam = searchParams.get("p");
  const pageNum =
    pParam && !isNaN(Number(pParam)) && Number(pParam) > 0 ? Number(pParam) : 1;
  const [loading, news, error] = useFetchNews({ pageNum });

  return (
    <PageLayout>
      {!loading && !error && <NewsList news={news} currentPage={pageNum} />}
    </PageLayout>
  );
};

export default Home;
