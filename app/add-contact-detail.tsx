import React, { useContext } from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "expo-router";
import { useRoute, StackActions } from "@react-navigation/native";
import ProfileBar from "@/components/ProfileBar/ProfileBar.component";
import OptionBar from "@/components/OptionBar/OptionBar.component";
import { ContactsContext } from "@/api/contacts/contacts.context";
import { AuthenticationContext } from "@/api/authentication/authentication.context";
import { CE_PersonProps } from "@/constants/ChatEngineObjectTypes";

export default function AddContactDetailScreen() {
  const route = useRoute();
  const { addContact } = useContext(ContactsContext);
  const { user } = useContext(AuthenticationContext);
  const {
    contact_id,
    contact_username,
    contact_first_name,
    custom_json,
    avatar,
  } = route.params as {
    contact_id: number;
    contact_username: string;
    contact_first_name: string;
    custom_json: string;
    avatar: string;
  };

  const navigation = useNavigation();

  const handleAddFriend = async () => {
    const contact: CE_PersonProps = {
      username: contact_username,
      first_name: contact_first_name,
      last_name: "",
      avatar: avatar,
      custom_json: custom_json,
      is_online: false,
    };
    try {
      await addContact(contact_id, contact);
      console.log(
        `AddContactDetailScreen(): Added new contact ${contact_first_name} successfully: `
      );
      navigation.dispatch(StackActions.popToTop());
    } catch (err) {
      console.error(`AddContactDetailScreen(): ERROR: ${err}`);
    }
  };

  return (
    <>
      <ProfileBar
        contact_id={contact_id}
        contact_alias={contact_first_name}
        avatar_img_src={[avatar]}
      />
      <TouchableOpacity
        onPress={handleAddFriend}
        disabled={Number(contact_id) === Number(user?.id)}
      >
        <OptionBar content="添加到通讯录" align_self="center" />
      </TouchableOpacity>
    </>
  );
}
