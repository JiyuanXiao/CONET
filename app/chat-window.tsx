import React, { useState, useLayoutEffect, useEffect, useContext } from "react";
import { View, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import InputBar from "@/components/InputBar/InputBar.component";
import { useTheme, useRoute, useNavigation } from "@react-navigation/native";
import { ChatList } from "@/components/ChatList/ChatList.component";
import { ThemeColorsProps } from "@/constants/Types";
import { Feather } from "@expo/vector-icons";
import { FriendsContext } from "@/api/friends/friends.context";

const MoreIcon = (props: { theme_colors: ThemeColorsProps }) => {
  return (
    <Feather name="more-horizontal" size={26} color={props.theme_colors.text} />
  );
};

export default function ChatWindowScreen() {
  const { colors } = useTheme();

  const [messageSent, setMessageSent] = useState<boolean>(false);

  const navigation = useNavigation();
  const route = useRoute();
  const { id, name, avatar_icon, icon_background_color } = route.params as {
    id: string;
    name: string;
    avatar_icon: string;
    icon_background_color: string;
  };

  const { setCurrentTalkingFriendId } = useContext(FriendsContext);

  // Display the name on the header
  useLayoutEffect(() => {
    navigation.setOptions({
      title: name,
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: "/friend-settings",
              params: {
                id: id,
                name: name,
                avatar_icon: avatar_icon,
                icon_background_color: icon_background_color,
              },
            });
          }}
        >
          <MoreIcon theme_colors={colors} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, name]);

  useEffect(() => {
    setCurrentTalkingFriendId(id);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <ChatList
        id={id}
        messageSent={messageSent}
        avatar_icon={avatar_icon}
        icon_background_color={icon_background_color}
        setMessageSent={setMessageSent}
      />
      <InputBar friend_id={id} setMessageSent={setMessageSent} />
    </View>
  );
}
