import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useTheme, StackActions, useRoute } from "@react-navigation/native";
import { Searchbar, Button, ActivityIndicator } from "react-native-paper";
import { router, useNavigation } from "expo-router";
import { CE_PersonProps } from "@/constants/ChatEngineObjectTypes";
import { FontAwesome5 } from "@expo/vector-icons";
import ContactBar from "@/components/ContactBar/ContactBar.component";
import { ContactsContext } from "@/api/contacts/contacts.context";
import AvatarListBar from "@/components/AvatarListBar/AvatarListBar.component";
import * as ChatServer from "@/api/chats/chats.api";
import { AuthenticationContext } from "@/api/authentication/authentication.context";
import { ChatsContext } from "@/api/chats/chats.context";

export default function AddChatMemberScreen() {
  const { colors } = useTheme();
  const [candidates, setCandidates] = useState<CE_PersonProps[]>([]);
  const [chat_members, setChatMembers] = useState<CE_PersonProps[]>([]);
  const [is_adding, setIsAdding] = useState(false);
  const { contacts } = useContext(ContactsContext);
  const { user } = useContext(AuthenticationContext);
  const { chats } = useContext(ChatsContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { chat_id } = route.params as {
    chat_id: number;
  };

  const handleAddMembers = async () => {
    try {
      setIsAdding(true);

      for (const candidate of candidates) {
        const success = await ChatServer.AddChatMember(
          user?.username || "",
          user?.secret || "",
          chat_id,
          candidate.username
        );
        if (success) {
          console.log(
            `Add ${candidate.username} to new chat ${chat_id} successfully...`
          );
          setIsAdding(false);
          navigation.goBack();
        } else {
          console.warn(
            `[add-chat-member.tsx] add member ${candidate.username} to chat ${chat_id} failed`
          );
          setIsAdding(false);
        }
      }
    } catch (err) {
      console.error(`[add-chat-member.tsx] add chat member failed: ${err}`);
      setIsAdding(false);
    }
  };

  const handleContactOnPress = (candidate: CE_PersonProps) => {
    setCandidates((prev_candidates) => [...prev_candidates, candidate]);
  };

  const resetCandidates = (newCandidates: CE_PersonProps[]) => {
    setCandidates(newCandidates);
  };

  useEffect(() => {
    const current_chat = chats.get(Number(chat_id));
    if (current_chat) {
      for (const person of current_chat.people) {
        const current_members = chat_members;
        current_members.push(person.person);
        setChatMembers(current_members);
      }
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.title_bar}>
        {is_adding ? (
          <ActivityIndicator
            animating={true}
            color={colors.primary}
            style={{ paddingVertical: 15 }}
          />
        ) : (
          candidates.length > 0 && (
            <Button
              mode="contained"
              buttonColor={colors.primary}
              textColor="black"
              disabled={is_adding}
              style={[styles.add_member_button]}
              onPress={handleAddMembers}
            >
              添加
            </Button>
          )
        )}
      </View>
      {candidates.length > 0 && (
        <AvatarListBar members={candidates} resetCandidates={resetCandidates} />
      )}
      {contacts.size > 0 ? (
        <FlatList
          data={Array.from(contacts.values())}
          renderItem={({ item }: { item: CE_PersonProps }) => {
            return !candidates.includes(item) &&
              !chat_members.includes(item) ? (
              <TouchableOpacity onPress={() => handleContactOnPress(item)}>
                <ContactBar
                  contact_alias={item.first_name}
                  avatar_img_src={[item.avatar]}
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
  add_member_button: {
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
