import React, { useState, useContext } from "react";
import { StyleSheet, Button } from "react-native";
import { useTheme } from "@react-navigation/native";
import { ScrollView, TouchableOpacity } from "react-native";
import { AuthenticationContext } from "@/api/authentication/authentication.context";
import OptionBar from "@/components/OptionBar/OptionBar.component";
import ProfileBar from "@/components/ProfileBar/ProfileBar.component";

export default function SettngScreen() {
  const { user, logOut } = useContext(AuthenticationContext);
  const handleLogout = () => {
    console.log("SettingScreen() in setting.tsx is calling logOut()");
    logOut();
  };

  return (
    <ScrollView>
      <ProfileBar
        contact_id={user?.id || 0}
        contact_alias={user?.first_name || ""}
        contact_username={user?.username || ""}
        avatar_img_src={user?.avatar || "@/assets/avatars/avatar_1.png"}
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
