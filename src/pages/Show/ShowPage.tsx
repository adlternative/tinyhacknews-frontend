import React from "react";
import NewsList from "components/NewsList";
import { useLocation } from "react-router-dom";
import { useFetchNews } from "hooks/useFetchNews";
import PageLayout from "components/PageLayout";

const Show: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const pParam = searchParams.get("p");
  const pageNum =
    pParam && !isNaN(Number(pParam)) && Number(pParam) > 0 ? Number(pParam) : 1;
  const [loading, news, error] = useFetchNews({ pageNum, newsType: "SHOW" });

  return (
    <PageLayout>
      {!loading && !error && <NewsList news={news} currentPage={pageNum} />}
    </PageLayout>
  );
};

export default Show;
