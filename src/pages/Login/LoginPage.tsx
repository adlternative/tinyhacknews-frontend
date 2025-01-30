import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "contexts/UserContext"; // 导入 UserContext
import GetUsernameFromJwt from "utils/GetUsernameFromJwt"; // 导入解析用户名的工具
import axiosInstance from "utils/AxiosInstance";
import { toast } from "react-toastify";
import shardStyles from "styles/shared.module.css";
import styles from "./LoginPage.module.css";
import NavBar from "components/NavBar";
import Footer from "components/Footer";

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();
  const { setUsername } = useContext(UserContext); // 使用 UserContext
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axiosInstance.post("/api/v1/users/login", credentials, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: false,
      });

      toast.success("Login Successful!");
      // 登录成功后跳转到首页

      // 解析 JWT 获取用户名
      const fetchedUsername = await GetUsernameFromJwt();
      setUsername(fetchedUsername); // 更新 UserContext

      navigate("/");
    } catch (error) {
      toast.error("Login Failed!");
    }
  };

  return (
    <div className={shardStyles.homeContainer}>
      <NavBar />
      <div className={styles.loginContainer}>
        <h1>Login</h1>
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>
          <button className={styles.loginButton} type="submit">
            Login
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
