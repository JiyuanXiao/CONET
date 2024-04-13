import React from "react";
import { Avatar } from "react-native-paper";

const ProfileAvatar = ({ text }: { text: string }) => (
  <Avatar.Text size={55} label={text} labelStyle={{ fontSize: 20 }} />
);

export default ProfileAvatar;
