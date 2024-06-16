import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Image, ClipPath, Defs, Circle, Rect } from "react-native-svg";
import { Asset } from "expo-asset";

const GroupAvatar = ({ avatars, size }: { avatars: Asset[]; size: number }) => {
  const margin = 1;
  const cols = Math.ceil(Math.sqrt(avatars.length));
  const rows = Math.ceil((avatars.length - cols) / cols) + 1; // Calculate number of rows needed
  // Assume a square grid for simplicity
  const avatarSize = (size - 4 * margin) / cols - margin; // Size of each individual avatar

  const [avatar_strings, setAvatarStrings] = useState<string[]>([]);

  useEffect(() => {
    const convertAvatarsToString = async () => {
      const avatar_uri = [];
      for (const avatar of avatars) {
        const downloaded_avatar = await avatar.downloadAsync();
        if (downloaded_avatar.localUri) {
          avatar_uri.push(downloaded_avatar.localUri);
        }
      }
      setAvatarStrings(avatar_uri);
    };

    convertAvatarsToString();
  }, []);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg height={size} width={size}>
        <Rect x="0" y="0" width={size} height={size} fill="#DCD7D7" />
        <Defs>
          <ClipPath id="clip">
            {avatar_strings.map((_, index) => {
              const row = Math.floor(index / cols);
              const col = index % cols;
              const x = col * (avatarSize + margin) + 2 * margin;
              const y =
                row * (avatarSize + margin) +
                2 * margin +
                ((cols - rows) * (avatarSize + margin)) / 2;
              return (
                <Rect
                  key={index}
                  x={x}
                  y={y}
                  width={avatarSize}
                  height={avatarSize}
                />
              );
            })}
          </ClipPath>
        </Defs>
        {avatar_strings.slice(0, rows * cols).map((uri, index) => {
          const row = Math.floor(index / cols);
          const col = index % cols;
          const x = col * (avatarSize + margin) + 2 * margin;
          const y =
            row * (avatarSize + margin) +
            2 * margin +
            ((cols - rows) * (avatarSize + margin)) / 2;
          return (
            <Image
              key={index}
              x={x}
              y={y}
              width={avatarSize}
              height={avatarSize}
              href={{ uri }}
              clipPath="url(#clip)"
              preserveAspectRatio="xMidYMid slice"
            />
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden", // Ensures the borderRadius is applied correctly
    borderWidth: 1, // Optional: add a border to visualize the borderRadius
    borderColor: "#DCD7D7", // Optional: border color
    borderRadius: 5,
  },
});

export default GroupAvatar;
