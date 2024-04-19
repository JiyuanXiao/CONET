import React from "react";
import { AntDesign, FontAwesome6, FontAwesome } from "@expo/vector-icons";
import { Link, Tabs } from "expo-router";
import { Pressable, StyleProp, TextStyle } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
interface IconProps {
  size: number;
  color: string;
  style?: StyleProp<TextStyle>;
}

const SettingTabIcon = (props: IconProps) => {
  return <FontAwesome name="gear" {...props} />;
};

const ChatsTabIcon = (props: IconProps) => {
  return <FontAwesome6 name="comment-dollar" {...props} />;
};

const AddUserIcon = (props: IconProps) => {
  return <AntDesign name="pluscircleo" {...props} />;
};

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "CONET",
          tabBarIcon: ({ focused }) => (
            <ChatsTabIcon
              size={25}
              color={Colors[colorScheme ?? "light"].text}
              style={{ opacity: focused ? 1 : 0.4 }}
            />
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <AddUserIcon
                    size={24}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: "Setting",
          tabBarIcon: ({ focused }) => (
            <SettingTabIcon
              size={28}
              color={Colors[colorScheme ?? "light"].text}
              style={{ opacity: focused ? 1 : 0.4 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
