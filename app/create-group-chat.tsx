import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { Searchbar, Button } from "react-native-paper";
import { router } from "expo-router";
import { CE_PersonProps } from "@/constants/ChatEngineObjectTypes";
import { FontAwesome5 } from "@expo/vector-icons";
import ContactBar from "@/components/ContactBar/ContactBar.component";
import { ContactsContext } from "@/api/contacts/contacts.context";
import AvatarListBar from "@/components/AvatarListBar/AvatarListBar.component";

export default function CreateGroupChatScreen() {
  const { colors } = useTheme();
  const [candidates, setCandidates] = useState<CE_PersonProps[]>([]);
  const [chat_title, setChatTitle] = useState("");
  const { contacts } = useContext(ContactsContext);

  const handleCreate = () => {};

  const handleClearText = () => {};

  const handleContactOnPress = (candidate: CE_PersonProps) => {
    setCandidates((prev_candidates) => [...prev_candidates, candidate]);
  };

  const resetCandidates = (newCandidates: CE_PersonProps[]) => {
    setCandidates(newCandidates);
  };

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
        <Button
          mode="contained"
          buttonColor={colors.primary}
          textColor="black"
          disabled={chat_title.length === 0}
          style={[styles.create_chat_button]}
          onPress={() => console.log("Pressed")}
        >
          创建
        </Button>
      </View>
      {candidates.length > 0 && (
        <AvatarListBar members={candidates} resetCandidates={resetCandidates} />
      )}
      {contacts.size > 0 ? (
        <FlatList
          data={Array.from(contacts.values())}
          renderItem={({ item }: { item: CE_PersonProps }) => {
            return !candidates.includes(item) ? (
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
