import React, { useContext, useState } from "react";
import { TouchableOpacity } from "react-native";
import { router, useNavigation } from "expo-router";
import { useRoute, useTheme } from "@react-navigation/native";
import { ActivityIndicator } from "react-native-paper";
import ProfileBar from "@/components/ProfileBar/ProfileBar.component";
import OptionBar from "@/components/OptionBar/OptionBar.component";
import { AuthenticationContext } from "@/api/authentication/authentication.context";
import * as ChatServer from "@/api/chats/chats.api";
import { ContactsContext } from "@/api/contacts/contacts.context";

export default function ChatMemberSettingScreen() {
  const { colors } = useTheme();
  const route = useRoute();
  const { user } = useContext(AuthenticationContext);
  const [is_creating, setIsCreating] = useState(false);
  const {
    chat_id,
    admin_username,
    member_username,
    member_first_name,
    avatar,
  } = route.params as {
    chat_id: number;
    admin_username: string;
    member_username: string;
    member_first_name: string;
    avatar: string;
  };

  const navigation = useNavigation();

  const startChat = async () => {
    try {
      setIsCreating(true);
      const new_chat_id = await ChatServer.CreateChat(
        user?.username || "",
        user?.secret || "",
        `${user?.first_name}的聊天`
      );
      if (new_chat_id) {
        console.log(`Create new chat ${new_chat_id} successfully...`);

        const success = await ChatServer.AddChatMember(
          user?.username || "",
          user?.secret || "",
          new_chat_id,
          member_username
        );
        if (success) {
          console.log(
            `Add ${member_username} to new chat ${new_chat_id} successfully...`
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
            `[contact-detail.tsx] add member ${member_username} to chat ${new_chat_id} failed`
          );
          setIsCreating(false);
        }
      } else {
        console.warn(`[contact-detail.tsx] create chat failed`);
        setIsCreating(false);
      }
    } catch (err) {
      console.error(`[contact-detail.tsx] create chat failed: ${err}`);
      setIsCreating(false);
    }
  };

  const deleteChatMmeber = async () => {
    if (user) {
      try {
        await ChatServer.RemoveChatMember(
          user.username,
          user.secret,
          chat_id,
          member_username
        );
        console.log(`Delete contact ${member_username}`);
        navigation.goBack();
      } catch (err) {
        console.error(`[contact-detail.tsx] deleteContact(): Error: ${err}`);
      }
    }
  };

  return (
    <>
      <ProfileBar contact_alias={member_first_name} avatar_img_src={[avatar]} />

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
      {admin_username === user?.username &&
        member_username !== user.username && (
          <TouchableOpacity onPress={deleteChatMmeber}>
            <OptionBar content="移除该群员" align_self="center" />
          </TouchableOpacity>
        )}
    </>
  );
}
