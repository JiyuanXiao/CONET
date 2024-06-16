import React, { useEffect, useState, useContext } from "react";
import { useNavigation } from "expo-router";
import { TouchableOpacity, Alert } from "react-native";
import { useRoute, useTheme } from "@react-navigation/native";
import { ActivityIndicator } from "react-native-paper";
import OptionBar from "@/components/OptionBar/OptionBar.component";
import ProfileBar from "@/components/ProfileBar/ProfileBar.component";
import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog.component";
import { router } from "expo-router";
import { MessagesContext } from "@/api/messages/messages.context";
import { ChatsContext } from "@/api/chats/chats.context";
import {
  CE_ChatMemberProps,
  CE_PersonProps,
} from "@/constants/ChatEngineObjectTypes";
import { AuthenticationContext } from "@/api/authentication/authentication.context";
import AvatarListBar from "@/components/AvatarListBar/AvatarListBar.component";
import * as ChatServer from "@/api/chats/chats.api";
import { getAvatarAssets } from "@/constants/Avatars";

export default function ChatSettingsScreen() {
  const route = useRoute();
  const { chat_id } = route.params as {
    chat_id: number;
  };
  const { colors } = useTheme();
  const { ClearAllMessagesById } = useContext(MessagesContext);
  const { chats } = useContext(ChatsContext);
  const [chat_members, setChatMembers] = useState<CE_PersonProps[]>([]);
  const { user } = useContext(AuthenticationContext);
  const [is_direct_chat, setIsDirectChat] = useState<boolean>(false);
  const [friend, setFriend] = useState<CE_ChatMemberProps>();
  const [dialog_visible, setDialogVisible] = useState<boolean>(false);
  const [confirm_message, setConfrimMessage] = useState<string>("");
  const [isConfirm, setIsConfirm] = useState<boolean>(false);
  const [actionFunction, setActionFunction] = useState<() => void>(() => {});
  const [is_deleting, setIsDeleteing] = useState(false);
  const [is_clearing, setIsClearing] = useState(false);
  const navigation = useNavigation();
  const avatars = getAvatarAssets();

  const addChatMember = () => {
    router.push({
      pathname: "/add-chat-member",
      params: {
        chat_id: chat_id,
      },
    });
  };

  const ClearChatHistory = async () => {
    console.log(
      "FriendSettingsScreen(): Start to clear chat history for chat: " +
        chat_id.toString()
    );
    setIsClearing(true);
    await ClearAllMessagesById(Number(chat_id));
    setIsClearing(false);
    console.log(
      "FriendSettingsScreen(): Successfully cleared chat history for chat: " +
        chat_id.toString()
    );

    navigation.goBack();
  };

  const DeleteChat = async () => {
    try {
      setIsDeleteing(true);
      await ChatServer.DeleteChat(
        user?.username || "",
        user?.secret || "",
        chat_id
      );
      console.log("Deleted chat " + chat_id + " successfully...");
      setIsDeleteing(false);
      //navigation.dispatch(StackActions.popToTop());
    } catch (err) {
      console.warn(
        `ChatSettingsScreen(): delete chat ${chat_id} failed: ${err}`
      );
      setIsDeleteing(false);
      Alert.alert("删除聊天失败", `服务器出错`, [
        { text: "OK", onPress: () => {} },
      ]);
    }
  };

  const OpenChatMemberSetting = (
    chat_id: number,
    admin_username: string,
    member_username: string,
    member_first_name: string,
    avatar_index: string
  ) => {
    router.push({
      pathname: "/chat-member-setting",
      params: {
        chat_id: chat_id,
        admin_username: admin_username,
        member_username: member_username,
        member_first_name: member_first_name,
        avatar_index: avatar_index,
      },
    });
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
      const current_members = [];
      for (const person of current_chat.people) {
        current_members.push(person.person);
      }
      setChatMembers(current_members);
      setIsDirectChat(current_chat.people.length <= 2);
      if (current_chat.people.length <= 2) {
        const member_1 = current_chat.people[0];
        const member_2 = current_chat.people[1];
        if (member_1.person.username === user?.username) {
          setFriend(member_2);
        } else {
          setFriend(member_1);
        }
      }
    } else {
      console.warn(
        "at ChatSettingsScreen() in chat-settings.tsx: chat " +
          chat_id.toString() +
          " is not in chat context"
      );
    }
  }, []);

  useEffect(() => {
    const current_chat = chats.get(Number(chat_id));
    if (current_chat) {
      const current_members = [];
      for (const person of current_chat.people) {
        current_members.push(person.person);
      }
      setChatMembers(current_members);
      setIsDirectChat(current_chat.people.length <= 2);
    }
  }, [chats]);

  return (
    <>
      {is_direct_chat ? (
        <ProfileBar
          contact_alias={friend?.person.first_name || ""}
          avatar_img_src={
            friend && avatars
              ? [avatars[Number(friend.person.custom_json)]]
              : []
          }
        />
      ) : (
        <AvatarListBar
          members={chat_members}
          chat_id={chat_id}
          admin_username={chats.get(Number(chat_id))?.admin.username}
          OpenChatMemberSetting={OpenChatMemberSetting}
        />
        // <AvatarListBar />
      )}
      <TouchableOpacity onPress={addChatMember}>
        <OptionBar content="添加新成员到群" />
      </TouchableOpacity>
      {is_clearing ? (
        <ActivityIndicator
          animating={true}
          color={colors.primary}
          style={{ paddingVertical: 23 }}
        />
      ) : (
        <TouchableOpacity
          onPress={() => {
            setDialogVisible(true);
            setConfrimMessage("确认清空聊天记录?");
            setActionFunction(() => ClearChatHistory);
          }}
        >
          <OptionBar content="清空聊天记录" />
        </TouchableOpacity>
      )}
      {chats.get(Number(chat_id))?.admin.username === user?.username &&
        (is_deleting ? (
          <ActivityIndicator
            animating={true}
            color={colors.primary}
            style={{ paddingVertical: 23 }}
          />
        ) : (
          <TouchableOpacity
            onPress={() => {
              setDialogVisible(true);
              setConfrimMessage("确认删除聊天群?");
              setActionFunction(() => DeleteChat);
            }}
          >
            <OptionBar content="删除聊天群" />
          </TouchableOpacity>
        ))}
      <ConfirmDialog
        visible={dialog_visible}
        setDialogVisible={setDialogVisible}
        confirm_message={confirm_message}
        setIsConfirm={setIsConfirm}
      />
    </>
  );
}
