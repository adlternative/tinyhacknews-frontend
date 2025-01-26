import "./App.css";

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./RegisterPage";
import Login from "./LoginPage";
import Home from "./HomePage";
import Submit from "./SubmitPage";
import { UserProvider } from "./context/UserContext";
import NotFound from "./NotFoundPage";
import User from "./UserPage";
import NewsItem from "./NewsItemPage";
import Ask from "./AskPage";
import Show from "./ShowPage";
import Jobs from "./JobsPage";
import CommentListPage from "./CommentListPage";
import ThreadsPage from "./ThreadsPage";
import FrontPage from "./FrontPage";
import FaqPage from "./FaqPage";
import GuideLinesPage from "./GuideLinesPage";
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
          <Route path="/news" element={<Home />} />
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
