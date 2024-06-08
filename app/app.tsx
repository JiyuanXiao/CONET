import React, { useContext } from "react";
import { Stack } from "expo-router";
import { useTheme } from "@react-navigation/native";
import { AuthenticationContext } from "@/api/authentication/authentication.context";
import LoginScreen from "./login";

const App = () => {
  const { colors } = useTheme();
  const { user } = useContext(AuthenticationContext);
  return user ? (
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
        name="create-group-chat"
        options={{
          title: "创建群聊",
          headerTitleAlign: "center",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="chat-settings"
        options={{
          title: "聊天设置",
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
        options={{
          headerBackTitleVisible: false,
          headerTitleAlign: "center",
        }}
        name="chat-window"
      />
    </Stack>
  ) : (
    <LoginScreen />
  );
};

export default App;
