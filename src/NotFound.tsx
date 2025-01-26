import React, { useContext } from "react";
import "./NotFound.css";
import NavBar from './components/NavBar';
import Footer from "./components/Footer";

const NotFound: React.FC = () => {

  return (
    <div className="home-container">
      <NavBar />
      <div className="not-found-container">
        <div className="not-found-text">
          <span className="large-text">404</span>
          <span className="small-text">Not Found</span>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
