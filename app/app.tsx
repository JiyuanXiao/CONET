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
        name="add-contact"
        options={{ title: "添加联系人", presentation: "modal" }}
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
        name="chat-settings"
        options={{
          title: "聊天设置",
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
