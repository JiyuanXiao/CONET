import React, { useContext } from "react";
import { Stack } from "expo-router";
import { useTheme } from "@react-navigation/native";
import { AuthenticationContext } from "@/api/authentication/authentication.context";
import LoginScreen from "./login";
import SplashScreen from "./splash";

const App = () => {
  const { colors } = useTheme();
  const { user, can_hide_splash } = useContext(AuthenticationContext);

  return can_hide_splash ? (
    user ? (
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{ title: "Chats", headerShown: false }}
        />
        <Stack.Screen
          name="add-chat-member"
          options={{
            headerBackTitleVisible: false,
            headerTitleAlign: "center",
            title: "添加新成员",
          }}
        />
        <Stack.Screen
          name="add-contact"
          options={{
            headerBackTitleVisible: false,
            headerTitleAlign: "center",
            title: "添加联系人",
          }}
        />
        <Stack.Screen
          name="add-contact-detail"
          options={{
            title: "详情",
            headerBackTitleVisible: false,
            headerTitleAlign: "center",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="account-setting"
          options={{
            headerTitleAlign: "center",
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="create-group-chat"
          options={{
            title: "创建聊天群",
            headerTitleAlign: "center",
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="chat-settings"
          options={{
            title: "聊天群设置",
            headerTitleAlign: "center",
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="contact-detail"
          options={{
            title: "详情",
            headerTitleAlign: "center",
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="chat-member-setting"
          options={{
            title: "群员详情",
            headerTitleAlign: "center",
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="chat-window"
          options={{
            headerBackTitleVisible: false,
            headerTitleAlign: "center",
          }}
        />
      </Stack>
    ) : (
      <LoginScreen />
    )
  ) : (
    <SplashScreen />
  );
};

export default App;
