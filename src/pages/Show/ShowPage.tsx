import React from "react";
import "pages/Home/HomePage.css";
import NavBar from "components/NavBar";
import NewsList from "components/NewsList";
import Footer from "components/Footer";
import { useLocation } from "react-router-dom";
import { useFetchNews } from "hooks/useFetchNews";

const Show: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const pParam = searchParams.get("p");
  const pageNum =
    pParam && !isNaN(Number(pParam)) && Number(pParam) > 0 ? Number(pParam) : 1;
  const [loading, news, error] = useFetchNews({ pageNum, newsType: "SHOW" });

  return (
    <div className="home-container">
      <NavBar />
      {!loading && !error && <NewsList news={news} currentPage={pageNum} />}
      <Footer />
    </div>
  );
};

export default Show;
