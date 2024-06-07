import React, { useEffect, useState, useContext, useRef } from "react";
import { useNavigation } from "expo-router";
import { ScrollView, FlatList, TouchableOpacity, View } from "react-native";
import { useRoute, StackActions } from "@react-navigation/native";
import OptionBar from "@/components/OptionBar/OptionBar.component";
import ProfileBar from "@/components/ProfileBar/ProfileBar.component";
import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog.component";
import { MessagesContext } from "@/api/messages/messages.context";
import { ChatsContext } from "@/api/chats/chats.context";
import {
  CE_ChatMemberProps,
  CE_PersonProps,
} from "@/constants/ChatEngineObjectTypes";
import { AuthenticationContext } from "@/api/authentication/authentication.context";
import AvatarListBar from "@/components/AvatarListBar/AvatarListBar.component";

export default function ChatSettingsScreen() {
  const route = useRoute();
  const { chat_id } = route.params as {
    chat_id: number;
  };

  const { ClearAllMessagesById } = useContext(MessagesContext);
  const { chats, deleteChat } = useContext(ChatsContext);
  const [chat_members, setChatMembers] = useState<CE_PersonProps[]>([]);
  const { user } = useContext(AuthenticationContext);
  const [is_direct_chat, setIsDirectChat] = useState<boolean>(false);
  const [friend, setFriend] = useState<CE_ChatMemberProps>();
  const [dialog_visible, setDialogVisible] = useState<boolean>(false);
  const [confirm_message, setConfrimMessage] = useState<string>("");
  const [isConfirm, setIsConfirm] = useState<boolean>(false);
  const [actionFunction, setActionFunction] = useState<() => void>(() => {});
  const navigation = useNavigation();

  const addChatMember = async () => {};

  const ClearChatHistory = () => {
    console.log(
      "FriendSettingsScreen(): Start to clear chat history for chat: " +
        chat_id.toString()
    );
    ClearAllMessagesById(Number(chat_id));
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
    deleteChat(Number(chat_id));
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
    const current_chat = chats.get(Number(chat_id));
    if (current_chat) {
      for (const person of current_chat.people) {
        const current_members = chat_members;
        current_members.push(person.person);
        setChatMembers(current_members);
      }
      setIsDirectChat(current_chat.people.length <= 2);
      if (current_chat.is_direct_chat) {
        const member_1 = current_chat.people[0];
        const member_2 = current_chat.people[1];
        if (member_1.person.username === user?.username) {
          setFriend(member_2);
        } else {
          setFriend(member_1);
        }
      }
    } else {
      console.error(
        "at ChatSettingsScreen() in chat-settings.tsx: chat " +
          chat_id.toString() +
          " is not in chat context"
      );
    }
  }, [chats]);

  return (
    <>
      {is_direct_chat ? (
        <ProfileBar
          contact_alias={friend?.person.first_name || ""}
          avatar_img_src={friend ? [friend.person.avatar] : [""]}
        />
      ) : (
        <AvatarListBar members={chat_members} />
        // <AvatarListBar />
      )}
      <TouchableOpacity onPress={addChatMember}>
        <OptionBar content="添加成员" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setDialogVisible(true);
          setConfrimMessage("确认清空聊天记录?");
          //setActionFunction(() => ClearChatHistory);
          setActionFunction(() => {});
        }}
      >
        <OptionBar content="清空聊天记录" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setDialogVisible(true);
          setConfrimMessage("确认删除聊天?");
          //setActionFunction(() => DeleteChat);
          setActionFunction(() => {});
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
    </>
  );
}
