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

// const MOCK_CONTACTS: ContactProps[] = [
//   { id: 383299, username: "admin", alias: "龟龟", avatar: "" },
//   { id: 383302, username: "jichang", alias: "鸡肠", avatar: "" },
//   { id: 383301, username: "shaoji", alias: "烧鸡", avatar: "" },
//   { id: 384817, username: "yejiang", alias: "叶酱", avatar: "" },
//   { id: 383299, username: "admin", alias: "龟龟", avatar: "" },
//   { id: 383302, username: "jichang", alias: "鸡肠", avatar: "" },
//   { id: 383301, username: "shaoji", alias: "烧鸡", avatar: "" },
//   { id: 384817, username: "yejiang", alias: "叶酱", avatar: "" },
//   { id: 383299, username: "admin", alias: "龟龟", avatar: "" },
//   { id: 383302, username: "jichang", alias: "鸡肠", avatar: "" },
//   { id: 383301, username: "shaoji", alias: "烧鸡", avatar: "" },
//   { id: 384817, username: "yejiang", alias: "叶酱", avatar: "" },
//   { id: 383299, username: "admin", alias: "龟龟", avatar: "" },
//   { id: 383302, username: "jichang", alias: "鸡肠", avatar: "" },
//   { id: 383301, username: "shaoji", alias: "烧鸡", avatar: "" },
//   { id: 384817, username: "yejiang", alias: "叶酱", avatar: "" },
//   { id: 383299, username: "admin", alias: "龟龟", avatar: "" },
//   { id: 383302, username: "jichang", alias: "鸡肠", avatar: "" },
//   { id: 383301, username: "shaoji", alias: "烧鸡", avatar: "" },
//   { id: 384817, username: "yejiang", alias: "叶酱", avatar: "" },
//   { id: 383299, username: "admin", alias: "龟龟", avatar: "" },
//   { id: 383302, username: "jichang", alias: "鸡肠", avatar: "" },
//   { id: 383301, username: "shaoji", alias: "烧鸡", avatar: "" },
//   { id: 384817, username: "yejiang", alias: "叶酱", avatar: "" },
// ];

// export interface ContactProps {
//   id: number;
//   username: string;
//   alias: string;
//   avatar: string;
// }

// const AvatarListBar = () => {
//   const { colors } = useTheme();
//   return (
//     <View style={[styles.container, { backgroundColor: colors.card }]}>
//       <FlatList
//         data={MOCK_CONTACTS}
//         numColumns={5}
//         renderItem={({ item }: { item: ContactProps }) => {
//           return (
//             <View style={styles.avatar}>
//               <ProfileAvatar
//                 img_src={[item.avatar]}
//                 size={50}
//                 theme_colors={colors}
//               />
//               <Text style={[styles.name, { color: colors.border }]}>
//                 {item.alias}
//               </Text>
//             </View>
//           );
//         }}
//       />
//     </View>
//   );
// };

const AvatarListBar = ({
  members,
  resetCandidates,
}: {
  members: CE_PersonProps[];
  resetCandidates?: (newCandidates: CE_PersonProps[]) => void;
}) => {
  const { colors } = useTheme();
  const flatListRef = useRef<FlatList>(null);

  const handleOnPress = (item: CE_PersonProps) => {
    if (resetCandidates) {
      const updated_candidates = members.filter(
        (member) => member.username !== item.username
      );
      resetCandidates(updated_candidates);
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
                  img_src={[item.avatar]}
                  size={50}
                  theme_colors={colors}
                />
                <Text style={[styles.name, { color: colors.border }]}>
                  {item.first_name}
                </Text>
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
    marginHorizontal: 16,
  },
  name: {
    alignSelf: "center",
    paddingVertical: 5,
  },
});

export default AvatarListBar;
