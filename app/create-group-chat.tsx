import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { Searchbar, Button, Checkbox } from "react-native-paper";
import { router } from "expo-router";
import ProfileBar from "@/components/ProfileBar/ProfileBar.component";
import { CE_UserProps } from "@/constants/ChatEngineObjectTypes";
import { FontAwesome5 } from "@expo/vector-icons";
import ContactBar from "@/components/ContactBar/ContactBar.component";

interface ContactProps {
  id: number;
  username: string;
  alias: string;
  avatar: string;
}

interface FriendProps {
  id: string;
  name: string;
  avatar_icon: string;
  icon_color: string;
  icon_background_color: string;
  icon_border_color: string;
}

const MOCK_CONTACTS: ContactProps[] = [
  { id: 383299, username: "admin", alias: "龟龟", avatar: "" },
  { id: 383302, username: "jichang", alias: "鸡肠", avatar: "" },
  { id: 383301, username: "shaoji", alias: "烧鸡", avatar: "" },
  { id: 384817, username: "yejiang", alias: "叶酱", avatar: "" },
];

// const MOCK_CONTACTS: ContactProps[] = [];

export default function CreateGroupChatScreen() {
  const { colors } = useTheme();

  const [chat_title, setChatTitle] = useState("");
  const [doesSearch, setDoesSearch] = useState(false);
  const [searchResult, setSearchResult] = useState<CE_UserProps>();

  const handleCreate = () => {
    // if (searchQuery.length > 0) {
    //   const result = MOCK_FRIENDS.find(
    //     (friend) => friend.account_id === searchQuery
    //   );
    //   setDoesSearch(true);
    //   setSearchResult(result);
    // }
  };

  const handleClearText = () => {
    setDoesSearch(false);
    setSearchResult(undefined);
  };

  return (
    <View style={styles.container}>
      <View style={styles.title_bar}>
        <Searchbar
          mode="bar"
          placeholder="输入群名"
          onChangeText={setChatTitle}
          onSubmitEditing={handleCreate}
          onFocus={() => setDoesSearch(false)}
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
      {MOCK_CONTACTS.length > 0 ? (
        <FlatList
          data={MOCK_CONTACTS}
          renderItem={({ item }: { item: ContactProps }) => {
            return (
              <TouchableOpacity onPress={() => {}}>
                <ContactBar
                  contact_alias={item.alias}
                  avatar_img_src={[item.alias]}
                />
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => item.id.toString()}
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
