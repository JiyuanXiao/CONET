import React, { useContext, useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { useTheme, StackActions } from "@react-navigation/native";
import { Searchbar, Button, ActivityIndicator } from "react-native-paper";
import { router, useNavigation } from "expo-router";
import { CE_PersonProps } from "@/constants/ChatEngineObjectTypes";
import { FontAwesome5 } from "@expo/vector-icons";
import ContactBar from "@/components/ContactBar/ContactBar.component";
import { ContactsContext } from "@/api/contacts/contacts.context";
import AvatarListBar from "@/components/AvatarListBar/AvatarListBar.component";
import * as ChatServer from "@/api/chats/chats.api";
import { AuthenticationContext } from "@/api/authentication/authentication.context";
import { MessagesContext } from "@/api/messages/messages.context";
import { getAvatarAssets } from "@/constants/Avatars";

export default function CreateGroupChatScreen() {
  const { colors } = useTheme();
  const [candidates, setCandidates] = useState<CE_PersonProps[]>([]);
  const [is_creating, setIsCreating] = useState(false);
  const [chat_title, setChatTitle] = useState("");
  const { contacts } = useContext(ContactsContext);
  const { user } = useContext(AuthenticationContext);
  const { messages, sendMessage } = useContext(MessagesContext);
  const navigation = useNavigation();
  const sendMessageRef = useRef(sendMessage);
  const avatars = getAvatarAssets();

  const handleCreate = async () => {
    try {
      setIsCreating(true);
      const new_chat_id = await ChatServer.CreateChat(
        user?.username || "",
        user?.secret || "",
        chat_title
      );

      if (new_chat_id) {
        console.log(`Create new chat ${new_chat_id} successfully...`);
        for (const candidate of candidates) {
          const success = await ChatServer.AddChatMember(
            user?.username || "",
            user?.secret || "",
            new_chat_id,
            candidate.username
          );
          if (success) {
            console.log(
              `Add ${candidate.username} to new chat ${new_chat_id} successfully...`
            );
            // send a system message
            await sendMessageRef.current(
              new_chat_id,
              `[${process.env.EXPO_PUBLIC_SPECIAL_MESSAGE_INDICATOR}][系统消息] ${user?.first_name} 创建了聊天群`,
              Date.now().toString()
            );
            setIsCreating(false);
            navigation.dispatch(StackActions.popToTop());
            router.push({
              pathname: "/chat-window",
              params: {
                chat_id: new_chat_id,
              },
            });
          } else {
            console.warn(
              `[create-group-chat.tsx] add member ${candidate.username} to chat ${new_chat_id} failed`
            );
            setIsCreating(false);
            Alert.alert("出现错误", `添加用户${candidate.username}到聊天出错`, [
              { text: "OK", onPress: () => {} },
            ]);
          }
        }
      } else {
        console.warn(`[create-group-chat.tsx] create chat failed`);
        setIsCreating(false);
        Alert.alert("发起聊天失败", `创建新聊天出错`, [
          { text: "OK", onPress: () => {} },
        ]);
      }
    } catch (err) {
      console.error(`[create-group-chat.tsx] create chat failed: ${err}`);
      setIsCreating(false);
      Alert.alert("发起聊天失败", `服务器出错`, [
        { text: "OK", onPress: () => {} },
      ]);
    }
  };

  const handleClearText = () => {};

  const handleContactOnPress = (candidate: CE_PersonProps) => {
    setCandidates((prev_candidates) => [...prev_candidates, candidate]);
  };

  const resetCandidates = (newCandidates: CE_PersonProps[]) => {
    setCandidates(newCandidates);
  };

  useEffect(() => {
    sendMessageRef.current = sendMessage;
  }, [messages]);

  return (
    <View style={styles.container}>
      <View style={styles.title_bar}>
        <Searchbar
          mode="bar"
          placeholder="输入群名"
          onChangeText={setChatTitle}
          onSubmitEditing={handleCreate}
          onClearIconPress={handleClearText}
          value={chat_title}
          style={[styles.title_input, { backgroundColor: colors.card }]}
          icon={() => (
            <FontAwesome5 name="pen-alt" size={24} color={colors.text} />
          )}
          returnKeyType="done"
        />
        {is_creating ? (
          <ActivityIndicator
            animating={true}
            color={colors.primary}
            style={{ paddingVertical: 15 }}
          />
        ) : (
          <Button
            mode="contained"
            buttonColor={colors.primary}
            textColor="black"
            disabled={chat_title.length === 0 || is_creating}
            style={[styles.create_chat_button]}
            onPress={handleCreate}
          >
            创建
          </Button>
        )}
      </View>
      {candidates.length > 0 && (
        <>
          <Text style={[styles.group_bar_title, { color: colors.border }]}>
            新添群成员
          </Text>
          <AvatarListBar
            members={candidates}
            resetCandidates={resetCandidates}
          />
        </>
      )}
      {contacts.size > 0 ? (
        <FlatList
          data={Array.from(contacts.values())}
          renderItem={({ item }: { item: CE_PersonProps }) => {
            return !candidates.includes(item) ? (
              <TouchableOpacity onPress={() => handleContactOnPress(item)}>
                <ContactBar
                  contact_alias={item.first_name}
                  avatar_img_src={
                    avatars ? [avatars[Number(item.custom_json)]] : []
                  }
                />
              </TouchableOpacity>
            ) : (
              <></>
            );
          }}
          keyExtractor={(item) => item.username}
        ></FlatList>
      ) : (
        <View>
          <Text style={[styles.notice_text, { color: colors.border }]}>
            无联系人
          </Text>
          <Button
            mode="contained"
            buttonColor={colors.primary}
            textColor="black"
            style={[styles.add_contact_button]}
            onPress={() => {
              router.push({
                pathname: "/add-contact",
              });
            }}
          >
            添加联系人
          </Button>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title_bar: {
    width: "100%",
    height: 76,
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 15,
  },
  title_input: {
    width: "70%",
    borderRadius: 10,
    margin: 10,
  },
  create_chat_button: {
    height: "70%",
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  add_contact_button: {
    height: 50,
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 10,
    margin: 20,
  },
  group_bar_title: {
    alignSelf: "flex-start",
    fontSize: 15,
    marginLeft: 15,
  },
  notice_text: {
    alignSelf: "center",
    fontSize: 20,
    margin: 10,
  },
  card: {
    justifyContent: "center",
    height: 100,
    width: "100%",
  },
  card_text: {
    fontSize: 15,
  },
});
