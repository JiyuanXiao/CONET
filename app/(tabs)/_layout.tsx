import React from "react";
import { AntDesign, FontAwesome6, FontAwesome } from "@expo/vector-icons";
import { Link, Tabs } from "expo-router";
import { Pressable, StyleProp, TextStyle } from "react-native";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useTheme } from "@react-navigation/native";

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
          tabBarIcon: ({ focused }) => (
            <ChatsTabIcon
              size={25}
              color={focused ? colors.primary : colors.text}
              //style={{ opacity: focused ? 1 : 0.4 }}
            />
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <AddUserIcon
                    size={24}
                    color={colors.text}
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
              color={focused ? colors.primary : colors.text}
              //style={{ opacity: focused ? 1 : 0.4 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
