import React, { useContext } from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "expo-router";
import { useRoute, StackActions } from "@react-navigation/native";
import ProfileBar from "@/components/ProfileBar/ProfileBar.component";
import OptionBar from "@/components/OptionBar/OptionBar.component";
import { FriendsContext } from "@/api/friends/friends.context";
import { MessagesContext } from "@/api/messages/messages.context";

export default function AddFriendDetailScreen() {
  const route = useRoute();
  const {
    id,
    name,
    icon,
    icon_color,
    icon_background_color,
    icon_border_color,
  } = route.params as {
    id: string;
    name: string;
    icon: string;
    icon_color: string;
    icon_background_color: string;
    icon_border_color: string;
  };

  const { friends, addFriend, updateFriendById } = useContext(FriendsContext);
  const { resetLoadedMessagesById } = useContext(MessagesContext);
  const navigation = useNavigation();

  const handleAddFriend = () => {
    console.log("Start adding a new chat: " + id);
    addFriend(
      id,
      name,
      icon,
      icon_color,
      icon_background_color,
      icon_border_color
    );
    console.log("Added new chat successfully: " + id);
    console.log("Start load messages for: " + id);
    resetLoadedMessagesById(id);
    console.log("Load messages successfully: " + id);
    navigation.dispatch(StackActions.popToTop());
  };

  return (
    <>
      <ProfileBar
        user_id={id}
        user_name={name}
        avatar_icon={icon}
        icon_background_color={icon_background_color}
        icon_color={icon_color}
        icon_border_color={icon_border_color}
      />
      <TouchableOpacity onPress={handleAddFriend}>
        <OptionBar content="添加好友" align_self="center" />
      </TouchableOpacity>
    </>
  );
}
