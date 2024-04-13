import React from "react";
import { StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import { Text } from "@/components/Themed";
import { useTheme } from "@react-navigation/native";
import ProfileAvatar from "@/components/ProfileAvatar";

interface ChatProps {
  name: string;
  last_msg: string;
  last_msg_time: string;
}

export default function Chat({ name, last_msg, last_msg_time }: ChatProps) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    card: {
      flex: 1,
      height: 80,
      paddingRight: 16,
      width: "100%",
      backgroundColor: colors.card,
      borderRadius: 20,
      marginTop: 13,
    },
    title: {
      fontSize: 17,
      fontWeight: "bold",
      color: colors.text,
      paddingLeft: 10,
    },
    subtitle: {
      fontSize: 13,
      color: colors.text,
      paddingLeft: 10,
    },
  });

  return (
    <Card.Title
      style={styles.card}
      title={name}
      titleStyle={styles.title}
      subtitle={last_msg}
      subtitleStyle={styles.subtitle}
      left={() => <ProfileAvatar text={name} />}
      right={() => <Text>{last_msg_time}</Text>}
    />
  );
}
