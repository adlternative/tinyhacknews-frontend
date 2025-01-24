import axios, { AxiosResponse, AxiosError } from "axios";

// 创建 Axios 实例
const axiosInstance = axios.create();

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized, please login");
      // 这里可以添加跳转到登录页的逻辑，例如：
      window.location.href = '/login';
    } else {
      console.error("Request failed:", error);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
