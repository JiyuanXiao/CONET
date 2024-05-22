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
  const { id, name, icon, icon_background_color } = route.params as {
    id: string;
    name: string;
    icon: string;
    icon_background_color: string;
  };

  const { addFriend } = useContext(FriendsContext);
  const { resetLoadedMessagesById } = useContext(MessagesContext);
  const navigation = useNavigation();

  const handleAddFriend = () => {
    console.log("AddFriendDetailScreen(): Start adding a new chat: " + id);
    addFriend(id, name, icon, icon_background_color);
    console.log("AddFriendDetailScreen(): Added new chat successfully: " + id);
    console.log("AddFriendDetailScreen(): Start load messages for: " + id);
    resetLoadedMessagesById(id);
    console.log("AddFriendDetailScreen(): Load messages successfully: " + id);
    navigation.dispatch(StackActions.popToTop());
  };

  return (
    <>
      <ProfileBar
        user_id={id}
        user_name={name}
        avatar_icon={icon}
        icon_background_color={icon_background_color}
      />
      <TouchableOpacity onPress={handleAddFriend}>
        <OptionBar content="添加联系人" align_self="center" />
      </TouchableOpacity>
    </>
  );
}
