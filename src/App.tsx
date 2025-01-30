import "./App.css";

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "pages/Register";
import Login from "pages/Login";
import Home from "pages/Home";
import Submit from "pages/Submit";
import { UserProvider } from "contexts/UserContext";
import NotFound from "pages/NotFound";
import User from "pages/User";
import NewsItem from "pages/NewsItem";
import New from "pages/New";
import Ask from "./pages/Ask";
import Show from "pages/Show";
import Jobs from "pages/Jobs";
import CommentListPage from "pages/CommentList";
import ThreadsPage from "pages/Threads";
import FrontPage from "pages/Front";
import FaqPage from "pages/Faq";
import GuideLinesPage from "pages/GuideLines";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App: React.FC = () => {
  return (
    <UserProvider>
      <Router>
        {/* 将 ToastContainer 放在 Router 内部，确保它可以覆盖所有路由 */}
        <ToastContainer
          position="top-center"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/news" element={<New />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/users" element={<User />} />
          <Route path="/item" element={<NewsItem />} />
          <Route path="/ask" element={<Ask />} />
          <Route path="/show" element={<Show />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/comments" element={<CommentListPage />} />
          <Route path="/threads" element={<ThreadsPage />} />
          <Route path="/front" element={<FrontPage />} />
          <Route path="/front" element={<FrontPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/guidelines" element={<GuideLinesPage />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
