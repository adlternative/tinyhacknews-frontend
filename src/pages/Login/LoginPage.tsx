// src/pages/LoginPage.tsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "contexts/UserContext";
import GetUsernameFromJwt from "utils/GetUsernameFromJwt";
import axiosInstance from "utils/AxiosInstance";
import { toast } from "react-toastify";
import axios from "axios";

import PageLayout from "components/PageLayout";
import AuthForm from "components/AuthForm";

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();
  const { setUsername } = useContext(UserContext);
  const [error, setError] = useState<string | null>(null);

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
      await axiosInstance.post(
        "/api/v1/users/login",
        {
          username: credentials.username,
          password: credentials.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: false,
        }
      );

      toast.success("Login Successful!");

      // 解析 JWT 获取用户名
      const fetchedUsername = await GetUsernameFromJwt();
      setUsername(fetchedUsername); // 更新 UserContext

      // 登录成功后跳转到首页
      navigate("/");
    } catch (err: any) {
      // 根据不同的错误类型设置错误信息
      if (axios.isAxiosError(err)) {
        setError(err.response?.data || err.message);
        toast.error(`Login failed: ${err.response?.data || err.message}`);
      } else {
        setError("An unexpected error occurred");
        toast.error("Login failed: An unexpected error occurred");
      }
    }
  };

  const formFields = [
    {
      label: "Username",
      name: "username",
      type: "text",
      value: credentials.username,
      onChange: handleChange,
    },
    {
      label: "Password",
      name: "password",
      type: "password",
      value: credentials.password,
      onChange: handleChange,
    },
  ];

  return (
    <PageLayout>
      <AuthForm
        title="Login"
        fields={formFields}
        onSubmit={handleSubmit}
        buttonLabel="Login"
      />
    </PageLayout>
  );
};

export default Login;
