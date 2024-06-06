import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Searchbar, Card, Button } from "react-native-paper";
import { router } from "expo-router";
import ProfileBar from "@/components/ProfileBar/ProfileBar.component";
import { CE_UserProps } from "@/constants/ChatEngineObjectTypes";

interface FriendProps {
  id: string;
  name: string;
  avatar_icon: string;
  icon_color: string;
  icon_background_color: string;
  icon_border_color: string;
}

export default function AddContactScreen() {
  const { colors } = useTheme();

  const [searchQuery, setSearchQuery] = useState("");
  const [doesSearch, setDoesSearch] = useState(false);
  const [searchResult, setSearchResult] = useState<CE_UserProps>();

  const handleSearch = () => {
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
      <View style={styles.search_bar}>
        <Searchbar
          mode="bar"
          placeholder="输入对方ID"
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          onFocus={() => setDoesSearch(false)}
          onClearIconPress={handleClearText}
          value={searchQuery}
          style={[styles.search_input, { backgroundColor: colors.card }]}
        />
        <Button
          mode="contained"
          buttonColor={colors.primary}
          textColor="black"
          disabled={searchQuery.length === 0}
          style={[styles.button]}
          onPress={() => console.log("Pressed")}
        >
          搜索
        </Button>
      </View>
      {searchResult ? (
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/add-contact-detail",
              params: {
                contact_id: searchResult.id,
                contact_alias: searchResult.first_name,
                contact_username: searchResult.username,
                avatar_img_src: searchResult.avatar,
              },
            })
          }
        >
          <ProfileBar
            contact_id={searchResult.id}
            contact_alias={searchResult.first_name}
            contact_username={searchResult.username}
            avatar_img_src={[searchResult.avatar]}
          />
        </TouchableOpacity>
      ) : (
        doesSearch && (
          <Card.Content style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.card_text, { color: colors.text }]}>
              该用户不存在
            </Text>
          </Card.Content>
        )
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
