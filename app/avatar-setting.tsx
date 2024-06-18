import React, { useEffect, useState, useContext } from "react";
import { useTheme } from "@react-navigation/native";
import { FlatList, View, StyleSheet, TouchableOpacity } from "react-native";
import { Button, ActivityIndicator } from "react-native-paper";
import { useNavigation } from "expo-router";
import ProfileAvatar from "@/components/ProfileAvatar/ProfileAvatar.component";
import { AuthenticationContext } from "@/api/authentication/authentication.context";
import { Asset, useAssets } from "expo-asset";
import ProfileBar from "@/components/ProfileBar/ProfileBar.component";
import { getAvatarAssets } from "@/constants/Avatars";
import { moderateScale } from "react-native-size-matters";

export default function AvatarSettingsScreen() {
  const { user } = useContext(AuthenticationContext);
  const { colors } = useTheme();
  const [selected_index, setSelectedIndex] = useState<number>(
    user ? Number(user?.custom_json) : -1
  );
  const { chanegAvatar } = useContext(AuthenticationContext);
  const [is_loading, setIsloading] = useState(false);
  const navigation = useNavigation();
  const avatars = getAvatarAssets();

  const handleSubmit = async () => {
    if (selected_index >= 0 && selected_index <= 30 && avatars) {
      setIsloading(true);
      try {
        await chanegAvatar(selected_index);
      } catch (err) {
        console.error(`[avatar-setting.tsx: handleSubmit(): error ${err}]`);
      }
      setIsloading(false);
      navigation.goBack();
    }
  };

  return (
    <>
      <View style={[styles.container, { backgroundColor: colors.card }]}>
        <ProfileBar
          contact_id={user?.id || 0}
          contact_alias={user?.first_name || ""}
          contact_username={user?.username || ""}
          avatar_img_src={
            avatars && selected_index >= 0 && selected_index <= 30
              ? [avatars[Number(selected_index)]]
              : []
          }
        />
        <FlatList
          data={avatars}
          numColumns={5}
          renderItem={({ item, index }: { item: Asset; index: number }) => {
            return (
              <TouchableOpacity onPress={() => setSelectedIndex(index)}>
                <View
                  style={[
                    styles.avatar,
                    {
                      borderColor: colors.primary,
                      borderWidth: selected_index === index ? 3 : 0,
                      borderRadius: 5,
                    },
                  ]}
                >
                  <ProfileAvatar
                    img_src={[item]}
                    size={moderateScale(47, 0.8)}
                    theme_colors={colors}
                  />
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
      {is_loading ? (
        <ActivityIndicator
          animating={true}
          color={colors.primary}
          style={{ paddingVertical: 15 }}
        />
      ) : (
        <Button
          mode="contained"
          buttonColor={colors.primary}
          textColor="black"
          disabled={selected_index < 0}
          style={[styles.submit_button]}
          onPress={handleSubmit}
        >
          确认
        </Button>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    justifyContent: "center",
    width: "100%",
    paddingTop: 10,
    paddingBottom: 20,
    marginVertical: 10,
    height: "80%",
  },
  avatar: {
    marginVertical: 10,
    marginHorizontal: moderateScale(10, 2),
  },
  name: {
    alignSelf: "center",
    paddingVertical: 5,
  },
  submit_button: {
    height: 50,
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 10,
  },
});
