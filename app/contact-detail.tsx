import React, { useContext } from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "expo-router";
import { useRoute, StackActions } from "@react-navigation/native";
import ProfileBar from "@/components/ProfileBar/ProfileBar.component";
import OptionBar from "@/components/OptionBar/OptionBar.component";
import { ContactsContext } from "@/api/contacts/contacts.context";
import { AuthenticationContext } from "@/api/authentication/authentication.context";
import { CE_PersonProps } from "@/constants/ChatEngineObjectTypes";

export default function ContactDetailScreen() {
  const route = useRoute();
  const { user } = useContext(AuthenticationContext);
  const { contact_username, contact_first_name, avatar, source } =
    route.params as {
      contact_username: string;
      contact_first_name: string;
      avatar: string;
      source: string;
    };

  const navigation = useNavigation();

  const startChat = async () => {
    navigation.dispatch(StackActions.popToTop());
  };

  const deleteContact = async () => {};

  return (
    <>
      <ProfileBar
        contact_alias={contact_first_name}
        avatar_img_src={[avatar]}
      />
      <TouchableOpacity onPress={startChat}>
        <OptionBar content="发起聊天" align_self="center" />
      </TouchableOpacity>
      {source === "contact" && (
        <TouchableOpacity onPress={deleteContact}>
          <OptionBar content="删除联系人" align_self="center" />
        </TouchableOpacity>
      )}
    </>
  );
}
