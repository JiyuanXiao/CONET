import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Searchbar, Card } from "react-native-paper";
import { router } from "expo-router";
import ProfileBar from "@/components/ProfileBar/ProfileBar.component";
import { MOCK_FRIENDS } from "@/mock_data/friends.mock";

interface FriendProps {
  id: string;
  name: string;
  avatar_icon: string;
  icon_color: string;
  icon_background_color: string;
  icon_border_color: string;
}

export default function AddFriendsScreen() {
  const { colors } = useTheme();

  const [searchQuery, setSearchQuery] = useState("");
  const [doesSearch, setDoesSearch] = useState(false);
  const [searchResult, setSearchResult] = useState<{
    id: string;
    name: string;
    avatar_icon: string;
    icon_background_color: string;
  }>();

  const handleSearch = () => {
    if (searchQuery.length > 0) {
      const result = MOCK_FRIENDS.find((friend) => friend.id === searchQuery);
      setDoesSearch(true);
      setSearchResult(result);
    }
  };

  const handleClearText = () => {
    setDoesSearch(false);
    setSearchResult(undefined);
  };

  return (
    <View style={styles.container}>
      <Searchbar
        mode="bar"
        placeholder="输入对方ID"
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
        onFocus={() => setDoesSearch(false)}
        onClearIconPress={handleClearText}
        value={searchQuery}
        style={[styles.search_bar, { backgroundColor: colors.card }]}
      />
      {searchResult ? (
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/add-friend-detail",
              params: {
                id: searchResult.id,
                name: searchResult.name,
                icon: searchResult.avatar_icon,
                icon_background_color: searchResult.icon_background_color,
              },
            })
          }
        >
          <ProfileBar
            user_id={searchResult.id}
            user_name={searchResult.name}
            avatar_icon={searchResult.avatar_icon}
            icon_background_color={searchResult.icon_background_color}
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
    width: "96%",
    borderRadius: 10,
    margin: 10,
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
