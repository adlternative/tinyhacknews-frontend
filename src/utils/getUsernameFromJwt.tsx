import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

// 定义 JWT 有效载荷的接口，根据你的 JWT 结构进行调整
interface JwtPayload {
  user_name: string;
  // 其他可能的字段
  [key: string]: any;
}

/**
 * 从指定名称的 Cookie 中提取用户名。
 * @returns 返回一个 Promise，解析为用户名字符串或 null
 */
const getUsernameFromJwt = async (): Promise<string | null> => {
  // 替换为你的 JWT Cookie 名称，例如 'jwt' 或 'authToken'
  const token = Cookies.get("jwt");

  if (!token) {
    console.warn("在 cookies 中未找到 JWT token。");
    return null;
  }

  try {
    const decoded: JwtPayload = jwtDecode(token);
    return decoded.user_name || null;
  } catch (error) {
    toast.error("解码 JWT 时出错:" + error);
    return null;
  }
};

export default getUsernameFromJwt;
