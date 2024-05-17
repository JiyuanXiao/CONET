import React, { useEffect, useState, useContext } from "react";
import { useNavigation } from "expo-router";
import { ScrollView, TouchableOpacity } from "react-native";
import { useRoute, useTheme, StackActions } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";
import OptionBar from "@/components/OptionBar/OptionBar.component";
import ProfileBar from "@/components/ProfileBar/ProfileBar.component";
import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog.component";
import { MessagesContext } from "@/api/messages/messages.context";
import { ChatsContext } from "@/api/chats/chats.context";
import { ChatProps } from "@/constants/Types";

export default function FriendSettingsScreen() {
  const route = useRoute();
  const { id, name } = route.params as { id: string; name: string };
  const { colors } = useTheme();
  const db = useSQLiteContext();
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
    console.log("Start to Clear Chat History for: " + id);
    ClearAllMessagesById(id);
    console.log("Successfully Cleared Chat History for: " + id);

    navigation.goBack();
  };

  const DeleteFriend = () => {
    console.log("Start to Delete Friend: " + id);
    deleteChatById(id);
    console.log("Deleted friend " + id + " Successfully...");

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
    const messages_object = getLoadedMessagesObjectById(id);
    let last_msg_content = "";
    let last_msg_timestamp = "";

    // Unusual situation
    if (messages_object && messages_object?.loaded_messages.length !== 0) {
      last_msg_content = messages_object?.loaded_messages[0].content;
      last_msg_timestamp = messages_object?.loaded_messages[0].timestamp;
    }

    // update chat info to refresh the chatbox content
    const updaed_chat = {
      id: id,
      name: name,
      last_message_content: last_msg_content,
      last_message_timestamp: last_msg_timestamp,
    } as ChatProps;
    updateChatById(id, updaed_chat);
  }, [messages_object_list]);

  return (
    <ScrollView>
      <ProfileBar
        user_id={id}
        user_name={name}
        avatar_icon="alien"
        icon_background_color={colors.border}
        icon_color={colors.text}
        icon_border_color={colors.text}
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
