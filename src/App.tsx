import "./App.css";

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Home from "./Home";
import Submit from "./Submit";
import { UserProvider } from "./context/UserContext";
import NotFound from "./NotFound";
import User from "./User";
import NewsItem from "./NewsItem";
import Ask from "./Ask";
import Show from "./Show";
import Jobs from "./Jobs";

const App: React.FC = () => {
  return (
    <UserProvider>
      <Router>
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
