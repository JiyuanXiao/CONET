import React, { useContext, useEffect, useState } from "react";
import {
  FontAwesome5,
  FontAwesome6,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Link, Tabs } from "expo-router";
import { Pressable, TouchableOpacity } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useTheme } from "@react-navigation/native";
import { ThemeColorsProps } from "@/constants/ComponentTypes";
import { WebSocketContext } from "@/api/websocket/websocket.context";
import { MessagesContext } from "@/api/messages/messages.context";
import { NotificationContext } from "@/api/notification/notification.context";
import { moderateScale } from "react-native-size-matters";

// explore the built-in icon families and icons on the web at https://icons.expo.fyi/

const SettingTabIcon = (props: {
  theme_colors: ThemeColorsProps;
  focused: boolean;
}) => {
  return (
    <FontAwesome
      name="gear"
      size={25}
      color={
        props.focused ? props.theme_colors.primary : props.theme_colors.text
      }
    />
  );
};

const ContactTabIcon = (props: {
  theme_colors: ThemeColorsProps;
  focused: boolean;
}) => {
  return (
    <FontAwesome6
      name="contact-book"
      size={20}
      color={
        props.focused ? props.theme_colors.primary : props.theme_colors.text
      }
    />
  );
};

const ChatsTabIcon = (props: {
  theme_colors: ThemeColorsProps;
  focused: boolean;
}) => {
  return (
    <FontAwesome6
      name="comment-dollar"
      size={22}
      color={
        props.focused ? props.theme_colors.primary : props.theme_colors.text
      }
    />
  );
};

const NotificationIcon = (props: {
  theme_colors: ThemeColorsProps;
  notification_on: boolean;
}) => {
  return (
    <Ionicons
      name={props.notification_on ? "notifications" : "notifications-off"}
      size={25}
      color={
        props.notification_on
          ? props.theme_colors.primary
          : props.theme_colors.border
      }
      style={{ marginRight: 20 }}
    />
  );
};

export default function TabLayout() {
  const { colors } = useTheme();
  const { websocket_connected } = useContext(WebSocketContext);
  const { is_messages_initialized } = useContext(MessagesContext);
  const { is_notificaiton_on, turnOffNotificaiton, turnOnNotification } =
    useContext(NotificationContext);

  const handleNotification = async () => {
    if (is_notificaiton_on) {
      await turnOffNotificaiton();
    } else {
      await turnOnNotification();
    }
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
        headerTintColor: colors.text,
        headerStyle: {
          backgroundColor: colors.background,
        },
        tabBarStyle: { backgroundColor: colors.background },
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: is_messages_initialized
            ? websocket_connected
              ? "CONET"
              : "连接中..."
            : "读取中...",
          headerTitleAlign: "center",
          tabBarIcon: ({ focused }) => (
            <ChatsTabIcon focused={focused} theme_colors={colors} />
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleNotification}>
              <NotificationIcon
                theme_colors={colors}
                notification_on={is_notificaiton_on}
              />
            </TouchableOpacity>
          ),
          headerLeft: () =>
            (!websocket_connected || !is_messages_initialized) && (
              <ActivityIndicator
                size="small"
                color={colors.primary}
                style={{ marginLeft: moderateScale(110, 1.7) }}
              />
            ),
        }}
      />
      <Tabs.Screen
        name="contact"
        options={{
          title: "通讯录",
          headerTitleAlign: "center",
          tabBarIcon: ({ focused }) => (
            <ContactTabIcon focused={focused} theme_colors={colors} />
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: "设置",
          headerTitleAlign: "center",
          tabBarIcon: ({ focused }) => (
            <SettingTabIcon focused={focused} theme_colors={colors} />
          ),
        }}
      />
    </Tabs>
  );
}
