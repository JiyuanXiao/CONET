import React, {
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { StyleSheet } from "react-native";
import { router } from "expo-router";
import { ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { AuthenticationContext } from "@/api/authentication/authentication.context";
import OptionBar from "@/components/OptionBar/OptionBar.component";
import ProfileBar from "@/components/ProfileBar/ProfileBar.component";
import { ChatsContext } from "@/api/chats/chats.context";
import { MessagesContext } from "@/api/messages/messages.context";
import { WebSocketContext } from "@/api/websocket/websocket.context";
import { ContactsContext } from "@/api/contacts/contacts.context";
import * as FileSystem from "expo-file-system";

export default function SettngScreen() {
  const { user, logOut, reloadAccountInfo } = useContext(AuthenticationContext);
  const { resetChatContext } = useContext(ChatsContext);
  const { resetMessageContext } = useContext(MessagesContext);
  const { closeWebSocket } = useContext(WebSocketContext);
  const { resetContacts } = useContext(ContactsContext);
  const [refreshing, setRefreshing] = useState(false);
  const reloadAccountInfoRef = useRef(reloadAccountInfo);
  const handleLogout = () => {
    console.log("SettingScreen() in setting.tsx is calling logOut()");
    resetMessageContext();
    resetChatContext();
    resetContacts();
    closeWebSocket();
    logOut();
  };

  const handleChangeName = () => {
    router.push({
      pathname: "/account-setting",
      params: {
        setting_type: "change-name",
      },
    });
  };

  const handleChangePassword = () => {
    router.push({
      pathname: "/account-setting",
      params: {
        setting_type: "change-password",
      },
    });
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    if (user) {
      console.log("refreshing account info...");
      await reloadAccountInfo();
    }

    setRefreshing(false);
  }, []);

  useEffect(() => {
    reloadAccountInfoRef.current = reloadAccountInfo;
  }, [user]);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <ProfileBar
        contact_id={user?.id || 0}
        contact_alias={user?.first_name || ""}
        contact_username={user?.username || ""}
        avatar_img_src={
          user ? [user.avatar] : ["@/assets/avatars/avatar_default.png"]
        }
      />
      <TouchableOpacity onPress={handleChangeName}>
        <OptionBar content="名字设置" />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleChangePassword}>
        <OptionBar content="更改密码" />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogout}>
        <OptionBar content="退出登录" align_self="center" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
