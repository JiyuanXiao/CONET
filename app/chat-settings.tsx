import React, { useEffect, useState, useContext } from "react";
import { useNavigation } from "expo-router";
import { ScrollView, FlatList, TouchableOpacity } from "react-native";
import { useRoute, StackActions } from "@react-navigation/native";
import OptionBar from "@/components/OptionBar/OptionBar.component";
import ProfileBar from "@/components/ProfileBar/ProfileBar.component";
import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog.component";
import { MessagesContext } from "@/api/messages/messages.context";
import { ChatsContext } from "@/api/chats/chats.context";
import { CE_ChatMemberProps } from "@/constants/ChatEngineObjectTypes";

export default function ChatSettingsScreen() {
  const route = useRoute();
  const { chat_id } = route.params as {
    chat_id: number;
  };

  const {
    messages_object_list,
    getLoadedMessagesObjectById,
    ClearAllMessagesById,
  } = useContext(MessagesContext);
  const { chats, setChats, deleteChat } = useContext(ChatsContext);

  const [chat_members, setChatMembers] = useState<CE_ChatMemberProps[]>([]);
  const [dialog_visible, setDialogVisible] = useState<boolean>(false);
  const [confirm_message, setConfrimMessage] = useState<string>("");
  const [isConfirm, setIsConfirm] = useState<boolean>(false);
  const [actionFunction, setActionFunction] = useState<() => void>(() => {});
  const navigation = useNavigation();

  const ClearChatHistory = () => {
    console.log(
      "FriendSettingsScreen(): Start to clear chat history for chat: " +
        chat_id.toString()
    );
    ClearAllMessagesById(chat_id);
    console.log(
      "FriendSettingsScreen(): Successfully cleared chat history for chat: " +
        chat_id.toString()
    );

    navigation.goBack();
  };

  const DeleteChat = () => {
    console.log(
      "ChatSettingsScreen(): Start to delete friend: " + chat_id.toString()
    );
    deleteChat(chat_id);
    console.log(
      "ChatSettingsScreen(): Deleted friend " +
        chat_id.toString() +
        " successfully..."
    );

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
    const current_chat = chats.find(
      (chat) => chat.id.toString() === chat_id.toString()
    );
    if (current_chat) {
      setChatMembers(current_chat.people);
    } else {
      console.error(
        "at ChatSettingsScreen() in chat-settings.tsx: chat " +
          chat_id.toString() +
          " is not in chat context"
      );
    }
  }, [chats]);

  // useEffect(() => {
  //   console.log(
  //     "FriendSettingsScreen(): Start to update chat history for: " + name
  //   );
  //   updateFriendById(id);
  //   console.log(
  //     "FriendSettingsScreen(): Successfully updated chat history for: " + name
  //   );
  // }, [messages_object_list]);

  return (
    <ScrollView>
      <FlatList
        data={chat_members}
        renderItem={({ item }) => (
          <ProfileBar
            contact_username={item.person.username}
            contact_alias={item.person.first_name}
            avatar_img_src={item.person.avatar}
          />
        )}
        keyExtractor={(item) => item.person.username}
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
          setConfrimMessage("确认删除聊天?");
          setActionFunction(() => DeleteChat);
        }}
      >
        <OptionBar content="删除联聊天" />
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