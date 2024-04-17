import React from "react";
import { Text, View } from "./Themed";
import { StyleSheet } from "react-native";
import { Scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useTheme } from "@react-navigation/native";

export default function MessageBubble({
  isReceived = false,
  message_content,
}: {
  isReceived?: boolean;
  message_content: string;
}) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.bubble_container,
        isReceived
          ? styles.justifed_received_bubble
          : styles.justifed_sent_bubble,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isReceived
            ? { backgroundColor: colors.border }
            : { backgroundColor: colors.primary },
        ]}
      >
        <Text style={styles.text}>{message_content}</Text>
      </View>
      <View
        style={[styles.arrow_container, { backgroundColor: colors.background }]}
      >
        <View
          style={[
            styles.arrow,
            isReceived
              ? styles.recevied_arrow_part_1
              : styles.sent_arrow_part_1,
            isReceived
              ? { backgroundColor: colors.border }
              : { backgroundColor: colors.primary },
            ,
          ]}
        ></View>
        <View
          style={[
            styles.arrow,
            isReceived
              ? styles.recevied_arrow_part_2
              : styles.sent_arrow_part_2,
            { backgroundColor: colors.background },
          ]}
        ></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble_container: {
    position: "relative",
    marginVertical: moderateScale(7, 2),
    justifyContent: "flex-end",
  },
  justifed_received_bubble: {
    flexDirection: "row-reverse",
  },
  justifed_sent_bubble: {
    flexDirection: "row",
  },
  bubble: {
    position: "relative",
    paddingHorizontal: moderateScale(10, 2),
    paddingTop: moderateScale(7, 2),
    paddingBottom: moderateScale(7, 2),
    maxWidth: moderateScale(250, 1),
    borderRadius: 20,
  },
  text: {
    fontSize: 16,
    justifyContent: "center",
  },
  arrow_container: {
    position: "relative",
    width: moderateScale(10, 2),
    bottom: 0,
  },
  arrow: {
    position: "absolute",
    bottom: 0,
    width: moderateScale(10, 2),
    height: moderateScale(15, 2),
    alignSelf: "flex-end",
  },

  recevied_arrow_part_1: {
    borderBottomRightRadius: 20,
    right: moderateScale(-8),
  },
  recevied_arrow_part_2: {
    borderBottomRightRadius: 40,
  },
  sent_arrow_part_1: {
    borderBottomLeftRadius: 20,
    left: moderateScale(-8),
  },
  sent_arrow_part_2: {
    borderBottomLeftRadius: 40,
  },
});
