import React, { useEffect, useState, useContext } from "react";
import { useNavigation } from "expo-router";
import { ScrollView, TouchableOpacity } from "react-native";
import { useRoute, StackActions } from "@react-navigation/native";
import OptionBar from "@/components/OptionBar/OptionBar.component";
import ProfileBar from "@/components/ProfileBar/ProfileBar.component";
import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog.component";
import { MessagesContext } from "@/api/messages/messages.context";
import { FriendsContext } from "@/api/friends/friends.context";

export default function FriendSettingsScreen() {
  const route = useRoute();
  const { id, name, avatar_icon, icon_background_color } = route.params as {
    id: string;
    name: string;
    avatar_icon: string;
    icon_background_color: string;
  };

  const {
    messages_object_list,
    getLoadedMessagesObjectById,
    ClearAllMessagesById,
  } = useContext(MessagesContext);
  const { updateFriendById, deleteFriendById } = useContext(FriendsContext);

  const [dialog_visible, setDialogVisible] = useState<boolean>(false);
  const [confirm_message, setConfrimMessage] = useState<string>("");
  const [isConfirm, setIsConfirm] = useState<boolean>(false);
  const [actionFunction, setActionFunction] = useState<() => void>(() => {});
  const navigation = useNavigation();

  const ClearChatHistory = () => {
    console.log(
      "FriendSettingsScreen(): Start to clear chat history for: " + name
    );
    ClearAllMessagesById(id);
    updateFriendById(id);
    console.log(
      "FriendSettingsScreen(): Successfully cleared chat history for: " + name
    );

    navigation.goBack();
  };

  const DeleteFriend = () => {
    console.log("FriendSettingsScreen(): Start to delete friend: " + name);
    deleteFriendById(id);
    console.log(
      "FriendSettingsScreen(): Deleted friend " + name + " successfully..."
    );

    navigation.dispatch(StackActions.popToTop());
  };

  useEffect(() => {
    if (isConfirm) {
      actionFunction();
      setActionFunction(() => {});
      setIsConfirm(false);
    }
  }, [isConfirm]);

  useEffect(() => {
    console.log(
      "FriendSettingsScreen(): Start to update chat history for: " + name
    );
    updateFriendById(id);
    console.log(
      "FriendSettingsScreen(): Successfully updated chat history for: " + name
    );
  }, [messages_object_list]);

  return (
    <ScrollView>
      <ProfileBar
        user_id={id}
        user_name={name}
        avatar_icon={avatar_icon}
        icon_background_color={icon_background_color}
      />
      <TouchableOpacity
        onPress={() => {
          setDialogVisible(true);
          setConfrimMessage("确认清空聊天记录?");
          setActionFunction(() => ClearChatHistory);
        }}
      >
        <OptionBar content="清空聊天记录" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setDialogVisible(true);
          setConfrimMessage("确认删除好友?");
          setActionFunction(() => DeleteFriend);
        }}
      >
        <OptionBar content="删除联系人" />
      </TouchableOpacity>
      <ConfirmDialog
        visible={dialog_visible}
        setDialogVisible={setDialogVisible}
        confirm_message={confirm_message}
        setIsConfirm={setIsConfirm}
      />
    </ScrollView>
  );
}
