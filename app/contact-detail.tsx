import React, { useContext, useEffect, useState, useRef } from "react";
import { TouchableOpacity, Alert } from "react-native";
import { router, useNavigation } from "expo-router";
import { useRoute, useTheme } from "@react-navigation/native";
import { ActivityIndicator } from "react-native-paper";
import ProfileBar from "@/components/ProfileBar/ProfileBar.component";
import OptionBar from "@/components/OptionBar/OptionBar.component";
import { AuthenticationContext } from "@/api/authentication/authentication.context";
import * as ChatServer from "@/api/chats/chats.api";
import { ContactsContext } from "@/api/contacts/contacts.context";
import { MessagesContext } from "@/api/messages/messages.context";
import { getAvatarAssets } from "@/constants/Avatars";

export default function ContactDetailScreen() {
  const { colors } = useTheme();
  const route = useRoute();
  const { user } = useContext(AuthenticationContext);
  const { contacts, removeContact, searchContact } =
    useContext(ContactsContext);
  const { messages, sendMessage } = useContext(MessagesContext);
  const [is_creating, setIsCreating] = useState(false);
  const [is_deleting, setIsDeleteing] = useState(false);
  const [contact_exits, setContactExist] = useState(false);
  const [contact_id, setContactId] = useState(-1);
  const { contact_username, contact_first_name, avatar_index, source } =
    route.params as {
      contact_username: string;
      contact_first_name: string;
      avatar_index: string;
      source: string;
    };
  const sendMessageRef = useRef(sendMessage);
  const navigation = useNavigation();
  const avatars = getAvatarAssets();

  const startChat = async () => {
    try {
      setIsCreating(true);
      const new_chat_id = await ChatServer.CreateChat(
        user?.username || "",
        user?.secret || "",
        `${user?.first_name}的聊天群`
      );
      if (new_chat_id) {
        console.log(`Create new chat ${new_chat_id} successfully...`);

        const success = await ChatServer.AddChatMember(
          user?.username || "",
          user?.secret || "",
          new_chat_id,
          contact_username
        );
        if (success) {
          console.log(
            `Add ${contact_username} to new chat ${new_chat_id} successfully...`
          );
          // send a system message
          await sendMessageRef.current(
            new_chat_id,
            `[${process.env.EXPO_PUBLIC_SPECIAL_MESSAGE_INDICATOR}][系统消息] ${user?.first_name} 创建了聊天群`,
            Date.now().toString()
          );
          setIsCreating(false);
          router.push({
            pathname: "/chat-window",
            params: {
              chat_id: new_chat_id,
            },
          });
        } else {
          console.warn(
            `[contact-detail.tsx] add member ${contact_username} to chat ${new_chat_id} failed`
          );
          setIsCreating(false);
          Alert.alert("出现错误", `添加用户${contact_username}到聊天出错`, [
            { text: "OK", onPress: () => {} },
          ]);
        }
      } else {
        console.warn(`[contact-detail.tsx] create chat failed`);
        setIsCreating(false);
        Alert.alert("发起聊天失败", `创建新聊天出错`, [
          { text: "OK", onPress: () => {} },
        ]);
      }
    } catch (err) {
      console.error(`[contact-detail.tsx] create chat failed: ${err}`);
      setIsCreating(false);
      Alert.alert("发起聊天失败", `服务器出错`, [
        { text: "OK", onPress: () => {} },
      ]);
    }
  };

  const deleteContact = async () => {
    if (contact_id !== -1) {
      try {
        setIsDeleteing(true);
        await removeContact(contact_id);
        console.log(`Delete contact ${contact_username}`);
        setIsDeleteing(false);
        navigation.goBack();
      } catch (err) {
        console.error(`[contact-detail.tsx] deleteContact(): Error: ${err}`);
        setIsDeleteing(false);
      }
    } else {
      console.warn(
        `[contact-detail.tsx] deleteContact(): contact ${contact_username} not found`
      );
      setIsDeleteing(false);
    }
  };

  useEffect(() => {
    for (let [id, contact] of contacts.entries()) {
      if (contact.username === contact_username) {
        setContactExist(true);
        setContactId(id);
      }
    }
  }, [contacts]);

  useEffect(() => {
    sendMessageRef.current = sendMessage;
  }, [messages]);

  return (
    <>
      <ProfileBar
        contact_alias={contact_first_name}
        avatar_img_src={avatars ? [avatars[Number(avatar_index)]] : []}
      />

      {is_creating ? (
        <ActivityIndicator
          animating={true}
          color={colors.primary}
          style={{ paddingVertical: 23 }}
        />
      ) : (
        <TouchableOpacity onPress={startChat}>
          <OptionBar content="发起新聊天" align_self="center" />
        </TouchableOpacity>
      )}
      {source === "contact" &&
        contact_exits &&
        (is_deleting ? (
          <ActivityIndicator
            animating={true}
            color={colors.primary}
            style={{ paddingVertical: 23 }}
          />
        ) : (
          <TouchableOpacity onPress={deleteContact}>
            <OptionBar content="删除联系人" align_self="center" />
          </TouchableOpacity>
        ))}
    </>
  );
}
