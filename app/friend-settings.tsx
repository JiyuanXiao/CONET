import React, { useEffect, useState, useContext, useCallback } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { useRoute, useTheme } from "@react-navigation/native";
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
  const { updateChatById } = useContext(ChatsContext);

  const [dialog_visible, setDialogVisible] = useState<boolean>(false);
  const [confirm_message, setConfrimMessage] = useState<string>("");
  const [isConfirm, setIsConfirm] = useState<boolean>(false);
  const [actionFunction, setActionFunction] = useState<() => void>(() => {});

  const ClearChatHistory = () => {
    ClearAllMessagesById(id);

    console.log("HERE IS ClearChatHistory");
  };

  const DeleteFriend = () => {
    console.log("HERE IS DeleteFriend");
    // Write Methods in Chat Context to handle Friend Deletion
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
      last_message_content: last_msg_content,
      last_message_timestamp: last_msg_timestamp,
    } as ChatProps;
    updateChatById(id, updaed_chat);
  }, [messages_object_list]);

  return (
    <ScrollView>
      <ProfileBar user_id={id} user_name={name} />
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
