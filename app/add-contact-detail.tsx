import React, { useContext } from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "expo-router";
import { useRoute, StackActions } from "@react-navigation/native";
import ProfileBar from "@/components/ProfileBar/ProfileBar.component";
import OptionBar from "@/components/OptionBar/OptionBar.component";
// import { FriendsContext } from "@/api/friends/friends.context";
import { MessagesContext } from "@/api/messages/messages.context";

export default function AddContactDetailScreen() {
  const route = useRoute();
  const { contact_id, contact_alias, contact_username, avatar_img_src } =
    route.params as {
      contact_id: number;
      contact_alias: string;
      contact_username: string;
      avatar_img_src: string;
    };

  // const { addFriend } = useContext(FriendsContext);
  const { resetLoadedMessagesById } = useContext(MessagesContext);
  const navigation = useNavigation();

  const handleAddFriend = () => {
    console.log(
      "AddContactDetailScreen(): Start adding a new contact: " + contact_alias
    );
    // addFriend(id, name, avatar_img_src);
    console.log(
      "AddContactDetailScreen(): Added new contact successfully: " +
        contact_alias
    );

    navigation.dispatch(StackActions.pop());
  };

  return (
    <>
      <ProfileBar
        contact_id={contact_id}
        contact_alias={contact_alias}
        contact_username={contact_username}
        avatar_img_src={avatar_img_src}
      />
      <TouchableOpacity onPress={handleAddFriend}>
        <OptionBar content="添加联系人" align_self="center" />
      </TouchableOpacity>
    </>
  );
}
