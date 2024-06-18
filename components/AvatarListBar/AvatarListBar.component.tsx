import React, { useRef, useEffect } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import ProfileAvatar from "../ProfileAvatar/ProfileAvatar.component";
import { CE_PersonProps } from "@/constants/ChatEngineObjectTypes";
import { FontAwesome } from "@expo/vector-icons";
import { getAvatarAssets } from "@/constants/Avatars";
import { moderateScale } from "react-native-size-matters";

const AvatarListBar = ({
  members,
  chat_id,
  admin_username,
  resetCandidates,
  OpenChatMemberSetting,
}: {
  members: CE_PersonProps[];
  chat_id?: number;
  admin_username?: string;
  resetCandidates?: (newCandidates: CE_PersonProps[]) => void;
  OpenChatMemberSetting?: (
    chat_id: number,
    admin_username: string,
    member_username: string,
    member_first_name: string,
    avatar_index: string
  ) => void;
}) => {
  const { colors } = useTheme();
  const flatListRef = useRef<FlatList>(null);
  const avatars = getAvatarAssets();

  const handleOnPress = (item: CE_PersonProps) => {
    if (resetCandidates) {
      const updated_candidates = members.filter(
        (member) => member.username !== item.username
      );
      resetCandidates(updated_candidates);
    } else if (OpenChatMemberSetting) {
      OpenChatMemberSetting(
        chat_id || -1,
        admin_username || "",
        item.username,
        item.first_name,
        item.custom_json
      );
    }
  };

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [members]);

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <FlatList
        ref={flatListRef}
        data={members}
        numColumns={5}
        renderItem={({ item }: { item: CE_PersonProps }) => {
          return (
            <TouchableOpacity onPress={() => handleOnPress(item)}>
              <View style={styles.avatar}>
                <ProfileAvatar
                  img_src={avatars ? [avatars[Number(item.custom_json)]] : []}
                  size={moderateScale(48, 0.8)}
                  theme_colors={colors}
                />
                {resetCandidates ? (
                  <View
                    style={{
                      maxWidth: 50,
                      maxHeight: 30,
                    }}
                  >
                    <Text style={[styles.name, { color: colors.border }]}>
                      {item.first_name.substring(0, 4)}
                    </Text>
                    <FontAwesome
                      name="remove"
                      size={18}
                      color={colors.notification}
                      style={{ alignSelf: "center", paddingTop: 0 }}
                    />
                  </View>
                ) : (
                  <Text style={[styles.name, { color: colors.border }]}>
                    {item.first_name.substring(0, 4)}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    justifyContent: "center",
    width: "100%",
    paddingTop: 10,
    paddingBottom: 20,
    marginVertical: 10,
    maxHeight: 320,
  },
  avatar: {
    marginVertical: 10,
    marginHorizontal: moderateScale(10, 2),
  },
  name: {
    alignSelf: "center",
    paddingTop: 5,
    fontSize: moderateScale(10, 2),
  },
});

export default AvatarListBar;
