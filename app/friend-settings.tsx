import React, { useEffect, useState, useContext } from "react";
import { useNavigation } from "expo-router";
import { ScrollView, TouchableOpacity } from "react-native";
import { useRoute, StackActions } from "@react-navigation/native";
import OptionBar from "@/components/OptionBar/OptionBar.component";
import ProfileBar from "@/components/ProfileBar/ProfileBar.component";
import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog.component";
import { MessagesContext } from "@/api/messages/messages.context";
import { ChatsContext } from "@/api/chats/chats.context";

export default function FriendSettingsScreen() {
  const route = useRoute();
  const {
    id,
    name,
    avatar_icon,
    icon_color,
    icon_background_color,
    icon_border_color,
  } = route.params as {
    id: string;
    name: string;
    avatar_icon: string;
    icon_color: string;
    icon_background_color: string;
    icon_border_color: string;
  };

  const {
    messages_object_list,
    getLoadedMessagesObjectById,
    ClearAllMessagesById,
  } = useContext(MessagesContext);
  const { updateChatById, deleteChatById } = useContext(ChatsContext);

  const [dialog_visible, setDialogVisible] = useState<boolean>(false);
  const [confirm_message, setConfrimMessage] = useState<string>("");
  const [isConfirm, setIsConfirm] = useState<boolean>(false);
  const [actionFunction, setActionFunction] = useState<() => void>(() => {});
  const navigation = useNavigation();

  const ClearChatHistory = () => {
    console.log("Start to clear chat history for: " + id);
    ClearAllMessagesById(id);
    console.log("Successfully cleared chat history for: " + id);

    navigation.goBack();
  };

  const DeleteFriend = () => {
    console.log("Start to delete friend: " + id);
    deleteChatById(id);
    console.log("Deleted friend " + id + " successfully...");

    navigation.dispatch(StackActions.popToTop());
  };

  useEffect(() => {
    if (isConfirm) {
      actionFunction();
      setActionFunction(() => {});
      setIsConfirm(false);
    }
  }, [isConfirm]);

  useEffect(() => {
    updateChatById(id);
  }, [messages_object_list]);

  return (
    <ScrollView>
      <ProfileBar
        user_id={id}
        user_name={name}
        avatar_icon={avatar_icon}
        icon_background_color={icon_background_color}
        icon_color={icon_color}
        icon_border_color={icon_border_color}
      />
      <TouchableOpacity
        onPress={() => {
          setDialogVisible(true);
          setConfrimMessage("确认清空聊天记录?");
          setActionFunction(() => ClearChatHistory);
        }}
      >
        <OptionBar content="清空聊天记录" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setDialogVisible(true);
          setConfrimMessage("确认删除好友?");
          setActionFunction(() => DeleteFriend);
        }}
      >
        <OptionBar content="删除好友" />
      </TouchableOpacity>
      <ConfirmDialog
        visible={dialog_visible}
        setDialogVisible={setDialogVisible}
        confirm_message={confirm_message}
        setIsConfirm={setIsConfirm}
      />
    </ScrollView>
  );
}
