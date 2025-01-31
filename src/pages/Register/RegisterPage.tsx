import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "utils/AxiosInstance";
import { toast } from "react-toastify";
import shardStyles from "styles/shared.module.css";
import styles from "./RegisterPage.module.css";
import NavBar from "components/NavBar";
import Footer from "components/Footer";
import axios from "axios";
import { RegisterUserInfoResponse } from "types/types";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    const userData = {
      name: formData.username,
      password: formData.password,
      email: formData.email,
    };

    axiosInstance
      .post("/api/v1/users", userData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: false,
      })
      .then((response) => {
        const userInfo: RegisterUserInfoResponse = response.data;
        toast.success(`Register Successful, ${userInfo.name}`);
        navigate("/login");
      })
      .catch((err) => {
        // 根据不同的错误类型设置错误信息
        if (axios.isAxiosError(err)) {
          setError(err.response?.data || err.message);
          toast.error(`Login failed: ${error}`);
        } else {
          setError("An unexpected error occurred");
          toast.error("Login failed");
        }
      });
  };

  return (
    <div className={shardStyles.homeContainer}>
      <NavBar />
      <div className={styles.registerContainer}>
        <h1>Register</h1>
        <form className={styles.registerForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
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
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button className={styles.registerButton} type="submit">
            Register
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
