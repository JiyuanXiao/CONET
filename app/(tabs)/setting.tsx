import React, { useState, useContext } from "react";
import { StyleSheet, Button } from "react-native";
import { useTheme } from "@react-navigation/native";
import { ScrollView, TouchableOpacity } from "react-native";
import { AuthenticationContext } from "@/api/authentication/authentication.context";
import OptionBar from "@/components/OptionBar/OptionBar.component";
import ProfileBar from "@/components/ProfileBar/ProfileBar.component";

export default function SettngScreen() {
  const { colors } = useTheme();
  const { user, logOut } = useContext(AuthenticationContext);
  const handleLogout = () => {
    logOut();
  };
  return (
    <ScrollView>
      <ProfileBar
        user_id={user?.account_id || ""}
        user_name={user?.name || ""}
        avatar_icon={user?.avatar_icon || "alien"}
        icon_background_color={user?.icon_background_color || colors.border}
      />
      <TouchableOpacity onPress={handleLogout}>
        <OptionBar content="退出登录" align_self="center" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
