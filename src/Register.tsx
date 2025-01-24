import React, { useState } from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./AxiosInstance";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

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

    try {
      const response = await axiosInstance.post("/api/v1/users", userData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: false,
      });

      console.log("Success:", response.data);
      // 处理成功响应
      // 注册成功后跳转到登录页面
      navigate("/login");
    } catch (error) {
      console.error("Error:", error);
      // 处理错误
    }
    // You can add your form submission logic here
  };

  return (
    <div className="register-wrapper">
      <div className="register-container">
        <h1>Register</h1>
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
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
          <div className="form-group">
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
          <div className="form-group">
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
          <button className="register-button" type="submit">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
