// src/contexts/UserContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";
import GetUsernameFromJwt from "utils/GetUsernameFromJwt";
import { toast } from "react-toastify";

interface UserContextProps {
  username: string | null;
  setUsername: React.Dispatch<React.SetStateAction<string | null>>;
  loading: boolean;
}

export const UserContext = createContext<UserContextProps>({
  username: null,
  setUsername: () => {},
  loading: true,
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const fetchedUsername = await GetUsernameFromJwt();
        setUsername(fetchedUsername);
      } catch (error) {
        toast.error("获取用户名失败:" + error);
        setUsername(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUsername();
  }, []);

  return (
    <UserContext.Provider value={{ username, setUsername, loading }}>
      {children}
    </UserContext.Provider>
  );
};