import React, { useState, createContext, useEffect } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { AuthenticationContentProps, UserProps } from "@/constants/Types";
import {
  fetchAuthInfo,
  pushAuthInfo,
  clearAuthInfo,
  createAuthTableIfNotExists,
} from "./authentication.storage";
import { userLogin } from "./authentication.api";

export const AuthenticationContext = createContext<AuthenticationContentProps>({
  isLoading: false,
  user: null as UserProps | null,
  error: "",
  logIn: (id: string, pw: string) => false,
  logOut: () => {},
});

export const AuthenticationContextProvider = (props: {
  children: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<UserProps | null>(null);
  const [error, setError] = useState<string>("");

  const db = useSQLiteContext();

  const logIn = (id: string, pw: string) => {
    const user = userLogin(id, pw);
    if (user) {
      console.info("User " + user.account_id + " loging in...");
      pushAuthInfo(user, db);
      setUser(user);
      return true;
    }
    return false;
  };

  const logOut = () => {
    console.info("User loging out...");
    clearAuthInfo(db);
    setUser(null);
  };

  useEffect(() => {
    console.info("Start to initialize authentication context");
    createAuthTableIfNotExists(db);
    const user = fetchAuthInfo(db);
    console.info(
      "Initialize authentication context successfully: " + user?.account_id
    );
    setUser(user);
  }, []);

  return (
    <AuthenticationContext.Provider
      value={{ isLoading, user, error, logIn, logOut }}
    >
      {props.children}
    </AuthenticationContext.Provider>
  );
};
