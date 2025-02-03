// src/pages/RegisterPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "utils/AxiosInstance";
import { toast } from "react-toastify";
import axios from "axios";
import { RegisterUserInfoResponse } from "types/types";

import PageLayout from "components/PageLayout";
import AuthForm from "components/AuthForm";

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
    const userData = {
      name: formData.username,
      password: formData.password,
      email: formData.email,
    };

    try {
      const response = await axiosInstance.post("/api/v1/users", userData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: false,
      });

      const userInfo: RegisterUserInfoResponse = response.data;
      toast.success(`Register Successful, ${userInfo.name}`);
      navigate("/login");
    } catch (err: any) {
      // 根据不同的错误类型设置错误信息
      if (axios.isAxiosError(err)) {
        setError(err.response?.data || err.message);
      } else {
        setError("An unexpected error occurred");
      }
      toast.error(`Register failed: ${error}`);
    }
  };

  const formFields = [
    {
      label: "Username",
      name: "username",
      type: "text",
      value: formData.username,
      onChange: handleChange,
    },
    {
      label: "Email",
      name: "email",
      type: "email",
      value: formData.email,
      onChange: handleChange,
    },
    {
      label: "Password",
      name: "password",
      type: "password",
      value: formData.password,
      onChange: handleChange,
    },
  ];

  return (
    <PageLayout>
      <AuthForm
        title="Register"
        fields={formFields}
        onSubmit={handleSubmit}
        buttonLabel="Register"
      />
    </PageLayout>
  );
};

export default Register;
