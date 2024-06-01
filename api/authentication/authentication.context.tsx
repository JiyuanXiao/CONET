import React, { useState, createContext, useEffect } from "react";
import { AuthenticationContentProps } from "@/constants/ContextTypes";
import {
  storeAuthenticatedUser,
  fetchAuthenticatedUser,
  removeAuthenticatedUser,
} from "./authentication.storage";
import { GetMyAccount } from "./authentication.api";
import { CE_UserProps } from "@/constants/ChatEngineObjectTypes";

export const AuthenticationContext = createContext<AuthenticationContentProps>({
  isLoading: false,
  user: null as CE_UserProps | null,
  error: "",
  is_authentication_initialized: false,
  logIn: async (id: string, pw: string) => false,
  logOut: async () => {},
});

export const AuthenticationContextProvider = (props: {
  children: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<CE_UserProps | null>(null);
  const [error, setError] = useState<string>("");
  const [is_authentication_initialized, setIsAuthenticationInitialized] =
    useState<boolean>(false);

  const logIn = async (username: string, pw: string) => {
    const curr_user = await GetMyAccount(username, pw);
    if (curr_user) {
      console.info("User " + curr_user.username + " loging in...");
      curr_user.secret = pw;
      await storeAuthenticatedUser(curr_user);
      setUser(curr_user);
      setIsAuthenticationInitialized(true);
      return true;
    }
    console.warn("Username or password incorrect");
    setIsAuthenticationInitialized(false);
    return false;
  };

  const logOut = async () => {
    console.info("User loging out...");
    setIsAuthenticationInitialized(false);
    await removeAuthenticatedUser();
    setUser(null);
  };

  const initializeUserData = async () => {
    console.info("Start to initialize authentication context");
    const curr_user = await fetchAuthenticatedUser();
    if (curr_user) {
      const updated_user = await GetMyAccount(
        curr_user.username,
        curr_user.secret
      );
      if (updated_user) {
        updated_user.secret = curr_user.secret;
        setUser(updated_user);
      }
      setIsAuthenticationInitialized(true);
      console.info(
        "Initialize authentication context successfully: " + curr_user?.username
      );
    } else {
      console.log("No user info in storage. Waiting for login...");
      setIsAuthenticationInitialized(false);
    }
  };

  useEffect(() => {
    initializeUserData();
  }, []);

  return (
    <AuthenticationContext.Provider
      value={{
        isLoading,
        user,
        error,
        is_authentication_initialized,
        logIn,
        logOut,
      }}
    >
      {props.children}
    </AuthenticationContext.Provider>
  );
};
