import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Button,
  FlatList,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { Avatar, Divider } from "react-native-paper";
import ContactBar from "@/components/ContactBar/ContactBar.component";
import ContactActionBar from "@/components/ContactBar/ContactActionBar.component";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { CE_PersonProps } from "@/constants/ChatEngineObjectTypes";
import { ContactsContext } from "@/api/contacts/contacts.context";
import { getAvatarAssets } from "@/constants/Avatars";

export default function SettngScreen() {
  const { colors } = useTheme();
  const { contacts } = useContext(ContactsContext);
  const assets = getAvatarAssets();

  return (
    <>
      <View style={{ marginBottom: 15 }}>
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: "/add-contact",
            });
          }}
        >
          <ContactActionBar
            content="添加联系人"
            IconComponent={() => (
              <Avatar.Icon
                size={50}
                icon={() => (
                  <Feather name="user-plus" size={25} color={colors.text} />
                )}
                style={{
                  borderColor: colors.text,
                  borderWidth: 2,
                  borderRadius: 10,
                  backgroundColor: colors.notification,
                  marginLeft: 10,
                }}
              />
            )}
            theme_colors={colors}
          />
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: "/create-group-chat",
            });
          }}
        >
          <ContactActionBar
            content="群聊"
            IconComponent={() => (
              <Avatar.Icon
                size={50}
                icon={() => (
                  <Ionicons
                    name="chatbubbles-outline"
                    size={26}
                    color={colors.text}
                  />
                )}
                style={{
                  borderColor: colors.text,
                  borderWidth: 2,
                  borderRadius: 10,
                  backgroundColor: "green",
                  marginLeft: 10,
                }}
              />
            )}
            theme_colors={colors}
          />
        </TouchableOpacity>
      </View>
      {contacts.size > 0 ? (
        <>
          <Text style={[styles.subtitle_text, { color: colors.border }]}>
            联系人列表
          </Text>
          <FlatList
            data={Array.from(contacts.values())}
            renderItem={({ item }: { item: CE_PersonProps }) => (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/contact-detail",
                    params: {
                      contact_username: item.username,
                      contact_first_name: item.first_name,
                      avatar_index: item.custom_json,
                      source: "contact",
                    },
                  })
                }
              >
                <ContactBar
                  contact_alias={item.first_name}
                  avatar_img_src={
                    assets ? [assets[Number(item.custom_json)]] : []
                  }
                />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.username}
          ></FlatList>
        </>
      ) : (
        <Text style={[styles.notice_text, { color: colors.border }]}>
          无联系人
        </Text>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle_text: {
    alignSelf: "center",
    fontSize: 15,
    margin: 5,
  },
  notice_text: {
    alignSelf: "center",
    fontSize: 20,
    margin: 10,
  },
});
