import React, { useState, useContext } from "react";
import { StyleSheet, Button } from "react-native";
import { useTheme } from "@react-navigation/native";
import { ScrollView, TouchableOpacity } from "react-native";
import { AuthenticationContext } from "@/api/authentication/authentication.context";
import OptionBar from "@/components/OptionBar/OptionBar.component";
import ProfileBar from "@/components/ProfileBar/ProfileBar.component";
import { ChatsContext } from "@/api/chats/chats.context";
import { MessagesContext } from "@/api/messages/messages.context";
import { WebSocketContext } from "@/api/websocket/websocket.context";

export default function SettngScreen() {
  const { user, logOut } = useContext(AuthenticationContext);
  const { resetChatContext } = useContext(ChatsContext);
  const { resetMessageContext } = useContext(MessagesContext);
  const { closeWebSocket } = useContext(WebSocketContext);
  const handleLogout = () => {
    console.log("SettingScreen() in setting.tsx is calling logOut()");
    closeWebSocket();
    resetMessageContext();
    resetChatContext();
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
