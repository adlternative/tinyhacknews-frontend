import React, { createContext, useState, useEffect, ReactNode } from "react";
import getUsernameFromJwt from "../utils/getUsernameFromJwt";

interface UserContextProps {
  username: string | null;
  setUsername: React.Dispatch<React.SetStateAction<string | null>>;
}

export const UserContext = createContext<UserContextProps>({
  username: null,
  setUsername: () => {},
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchedUsername = getUsernameFromJwt();
    setUsername(fetchedUsername);
  }, []);

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};
