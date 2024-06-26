import React, { useState, createContext, useEffect } from "react";
import {
  AuthenticationContentProps,
  MyAccountResponseProps,
} from "@/constants/ContextTypes";
import * as AuthenStorage from "./authentication.storage";
import * as AuthenServer from "./authentication.api";
import { CE_UserProps } from "@/constants/ChatEngineObjectTypes";
import { Asset } from "expo-asset";

export const AuthenticationContext = createContext<AuthenticationContentProps>({
  isLoading: false,
  user: null as CE_UserProps | null,
  error: "",
  is_authentication_initialized: false,
  can_hide_splash: false,
  logIn: async (id: string, pw: string) => false,
  logOut: async () => {},
  chanegName: async () => -1,
  changePassword: async () => -1,
  chanegAvatar: async () => -1,
  reloadAccountInfo: async () => {},
});

export const AuthenticationContextProvider = (props: {
  children: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<CE_UserProps | null>(null);
  const [error, setError] = useState<string>("");
  const [is_authentication_initialized, setIsAuthenticationInitialized] =
    useState<boolean>(false);
  const [can_hide_splash, setCanHideSplash] = useState(false);

  const logIn = async (username: string, pw: string) => {
    const response = await AuthenServer.GetMyAccount(username, pw);
    if (!response.success) {
      if (Number(response.status) === 429) {
        console.warn(
          `[Auth Context] Get my account info from sevrer failed: ${response.status}: ${response.error}`
        );
        setError("服务器访问超载，请稍候再试");
      } else if (Number(response.status) === 403) {
        console.log(
          `[Auth Context] Get my account info from sevrer failed: ${response.status}: ${response.error}`
        );
        setError("用户名或密码错误");
      } else if (Number(response.status) === 404) {
        console.log(
          `[Auth Context] Get my account info from sevrer failed: ${response.status}: ${response.error}`
        );
        setError("用户名不存在");
      } else if (Number(response.status) === 400) {
        console.error(
          `[Auth Context] Get my account info from sevrer failed: ${response.status}: ${response.error}`
        );
        setError("客户端出错,请联系客服");
      } else if (response.error === "Network Error") {
        console.error(
          `[Auth Context] Get my account info from sevrer failed: ${response.status}: ${response.error}`
        );
        setError("网络错误,请稍候再试");
      } else {
        console.error(
          `[Auth Context] Get my account info from sevrer failed: ${response.status}: ${response.error}`
        );
        setError("未知错误,请联系客服");
      }
      setIsAuthenticationInitialized(false);
      return false;
    }

    if (response.data) {
      const curr_user = response.data;
      console.log(
        "[Auth Context] User " + curr_user.username + " loging in..."
      );
      curr_user.secret = pw;
      // const new_user_avatar_uri = await AuthenStorage.saveAvatarToFilesystem(
      //   curr_user.username,
      //   curr_user.custom_json
      // );
      // if (new_user_avatar_uri) {
      //   curr_user.avatar = new_user_avatar_uri;
      // }
      await AuthenStorage.storeAuthenticatedUser(curr_user);
      setUser(curr_user);
      setError("");
      setIsAuthenticationInitialized(true);
      return true;
    } else {
      console.error(
        `[Auth Context] Get my account info from sevrer failed: ${response.status}: ${response.error}`
      );
      setError("无用户信息,请联系客服");
      return false;
    }
  };

  const logOut = async () => {
    console.log("[Auth Context] User loging out...");
    setIsAuthenticationInitialized(false);
    await AuthenStorage.removeAuthenticatedUser();
    setUser(null);
  };

  const changePassword = async (old_password: string, new_password: string) => {
    const status_code = await AuthenServer.UpdateMyAccount(
      user?.username || "",
      old_password,
      null,
      new_password,
      null
    );
    if (user && status_code === 200) {
      const updated_user = { ...user, secret: new_password };
      // updated_user.secret = new_password;
      setUser(updated_user);
      await AuthenStorage.storeAuthenticatedUser(updated_user);
    }
    return status_code;
  };

  const chanegName = async (new_name: string) => {
    const status_code = await AuthenServer.UpdateMyAccount(
      user?.username || "",
      user?.secret || "",
      new_name,
      null,
      null
    );
    if (user && status_code === 200) {
      const updated_user = { ...user, first_name: new_name };
      // updated_user.first_name = new_name;
      setUser(updated_user);
      await AuthenStorage.storeAuthenticatedUser(updated_user);
    }
    return status_code;
  };

  const chanegAvatar = async (avatar_index: number) => {
    const status_code = await AuthenServer.UpdateMyAccount(
      user?.username || "",
      user?.secret || "",
      null,
      null,
      avatar_index
    );

    if (user && status_code === 200) {
      const updated_user = { ...user, custom_json: avatar_index.toString() };
      //updated_user.custom_json = avatar_index.toString();
      console.log("change avatar!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      setUser(updated_user);
      await AuthenStorage.storeAuthenticatedUser(updated_user);
    }

    return status_code;
  };

  const reloadAccountInfo = async () => {
    if (user) {
      const response = await AuthenServer.GetMyAccount(
        user.username,
        user.secret
      );
      const updated_user = response.data;
      if (updated_user) {
        updated_user.secret = user.secret;
        // const new_user_avatar_uri = await AuthenStorage.saveAvatarToFilesystem(
        //   updated_user.username,
        //   updated_user.custom_json
        // );
        // if (new_user_avatar_uri) {
        //   updated_user.avatar = new_user_avatar_uri;
        // }
        await AuthenStorage.storeAuthenticatedUser(updated_user);
        setUser(updated_user);
      }
    }
  };

  const initializeUserData = async () => {
    console.log("[Auth Context] Start to initialize authentication context");
    const curr_user = await AuthenStorage.fetchAuthenticatedUser();

    if (curr_user) {
      setUser(curr_user);
      setIsAuthenticationInitialized(true);
      console.log(
        "[Auth Context] Initialize authentication context successfully: " +
          curr_user?.username
      );
    } else {
      console.log(
        "[Auth Context] No user log in storage. Waiting for login..."
      );
      setIsAuthenticationInitialized(false);
    }
    setCanHideSplash(true);
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
        can_hide_splash,
        logIn,
        logOut,
        chanegName,
        changePassword,
        chanegAvatar,
        reloadAccountInfo,
      }}
    >
      {props.children}
    </AuthenticationContext.Provider>
  );
};
