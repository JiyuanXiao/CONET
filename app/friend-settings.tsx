import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { useRoute, useTheme } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";
import OptionBar from "@/components/OptionBar/OptionBar.component";
import ProfileBar from "@/components/ProfileBar/ProfileBar.component";
import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog.component";

export default function FriendSettingsScreen() {
  const route = useRoute();
  const { id, name } = route.params as { id: string; name: string };
  const { colors } = useTheme();
  const db = useSQLiteContext();

  const [dialog_visible, setDialogVisible] = useState<boolean>(false);
  const [confirm_message, setConfrimMessage] = useState<string>("");
  const [isConfirm, setIsConfirm] = useState<boolean>(false);
  const [actionFunction, setActionFunction] = useState<() => void>(() => {});

  const ClearChatHistory = () => {
    console.log("HERE IS ClearChatHistory");
    // Write Methods in Message Context to handle Chat History Clear
  };

  const DeleteFriend = () => {
    console.log("HERE IS DeleteFriend");
    // Write Methods in Chat Context to handle Friend Deletion
  };

  useEffect(() => {
    if (isConfirm) {
      actionFunction();
      setActionFunction(() => {});
      setIsConfirm(false);
    }
  }, [isConfirm]);

  return (
    <ScrollView>
      <ProfileBar user_id={id} user_name={name} />
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
        <OptionBar content="删除好友" />
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
