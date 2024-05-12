import React, { useState, createContext, useEffect } from "react";
import { AuthenticationContentProps, UserProps } from "@/constants/Types";

export const AuthenticationContext = createContext<AuthenticationContentProps>({
  isLoading: false,
  user: null as UserProps | null,
  error: "",
});

export const AuthenticationContextProvider = (props: {
  children: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<UserProps | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const mock_user = {
      id: "admin",
      name: "admin",
    };
    setUser(mock_user);
  }, []);

  return (
    <AuthenticationContext.Provider value={{ isLoading, user, error }}>
      {props.children}
    </AuthenticationContext.Provider>
  );
};
