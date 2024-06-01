import React from "react";
import { FontAwesome5, FontAwesome6, FontAwesome } from "@expo/vector-icons";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useTheme } from "@react-navigation/native";
import { ThemeColorsProps } from "@/constants/ComponentTypes";

// explore the built-in icon families and icons on the web at https://icons.expo.fyi/

const SettingTabIcon = (props: {
  theme_colors: ThemeColorsProps;
  focused: boolean;
}) => {
  return (
    <FontAwesome
      name="gear"
      size={28}
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
      size={25}
      color={
        props.focused ? props.theme_colors.primary : props.theme_colors.text
      }
    />
  );
};

const AddUserIcon = (props: {
  theme_colors: ThemeColorsProps;
  pressed: boolean;
}) => {
  return (
    <FontAwesome5
      name="user-plus"
      size={18}
      color={props.theme_colors.text}
      style={{ marginRight: 15, opacity: props.pressed ? 0.5 : 1 }}
    />
  );
};

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
        headerTintColor: colors.text,
        headerStyle: { backgroundColor: colors.background },
        tabBarStyle: { backgroundColor: colors.background },
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "CONET",
          headerTitleAlign: "center",
          tabBarIcon: ({ focused }) => (
            <ChatsTabIcon focused={focused} theme_colors={colors} />
          ),
          headerRight: () => (
            <Link href="/add-contact" asChild>
              <Pressable>
                {({ pressed }) => (
                  <AddUserIcon theme_colors={colors} pressed={pressed} />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: "设置",
          tabBarIcon: ({ focused }) => (
            <SettingTabIcon focused={focused} theme_colors={colors} />
          ),
        }}
      />
    </Tabs>
  );
}
