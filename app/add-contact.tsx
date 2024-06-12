import React, { useState, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { Searchbar, Card, Button, ActivityIndicator } from "react-native-paper";
import { router } from "expo-router";
import ProfileBar from "@/components/ProfileBar/ProfileBar.component";
import { ContactsContext } from "@/api/contacts/contacts.context";
import { ContactStorageProps } from "@/constants/ContextTypes";

export default function AddContactScreen() {
  const { colors } = useTheme();

  const [searchQuery, setSearchQuery] = useState("");
  const [doesSearch, setDoesSearch] = useState(false);
  const [searchResult, setSearchResult] = useState<ContactStorageProps | null>(
    null
  );
  const { searchContact } = useContext(ContactsContext);
  const [is_loading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (searchQuery.length > 0) {
      try {
        setIsLoading(true);
        const contact_id = Number(searchQuery);
        const result = await searchContact(contact_id);
        setDoesSearch(true);
        setSearchResult(result);
        setIsLoading(false);
      } catch (err) {
        console.error(`[add-contact.tsx] handleSearch(): error ${err}`);
        Alert.alert("搜索用户失败", "服务器出错", [
          { text: "OK", onPress: () => {} },
        ]);
      }
    }
  };

  const handleClearText = () => {
    setDoesSearch(false);
    setSearchResult(null);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View style={styles.search_bar}>
          <Searchbar
            mode="bar"
            placeholder="输入联系人ID"
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            onFocus={() => setDoesSearch(false)}
            onClearIconPress={handleClearText}
            value={searchQuery}
            keyboardType="decimal-pad"
            style={[styles.search_input, { backgroundColor: colors.card }]}
          />
          {is_loading ? (
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
              disabled={searchQuery.length === 0 || is_loading}
              style={[styles.button]}
              onPress={handleSearch}
            >
              搜索
            </Button>
          )}
        </View>
        {searchResult ? (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/add-contact-detail",
                params: {
                  contact_id: searchResult.id,
                  contact_username: searchResult.contact.username,
                  contact_first_name: searchResult.contact.first_name,
                  custom_json: searchResult.contact.custom_json,
                  avatar: searchResult.contact.avatar,
                },
              })
            }
          >
            <ProfileBar
              contact_id={searchResult.id}
              contact_alias={searchResult.contact.first_name}
              contact_username={searchResult.contact.last_name}
              avatar_img_src={[searchResult.contact.avatar]}
            />
          </TouchableOpacity>
        ) : (
          doesSearch && (
            <Card.Content
              style={[styles.card, { backgroundColor: colors.card }]}
            >
              <Text style={[styles.card_text, { color: colors.text }]}>
                该用户不存在
              </Text>
            </Card.Content>
          )
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  search_bar: {
    width: "100%",
    height: 76,
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 15,
  },
  search_input: {
    width: "70%",
    borderRadius: 10,
    margin: 10,
  },
  button: {
    height: "70%",
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  card: {
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    width: "100%",
  },
  card_text: {
    fontSize: 15,
  },
});
