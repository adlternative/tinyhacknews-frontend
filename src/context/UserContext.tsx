// src/context/UserContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";
import getUsernameFromJwt from "../utils/getUsernameFromJwt";

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
        const fetchedUsername = await getUsernameFromJwt();
        setUsername(fetchedUsername);
      } catch (error) {
        console.error("获取用户名失败:", error);
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