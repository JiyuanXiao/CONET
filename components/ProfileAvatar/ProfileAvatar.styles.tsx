import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Avatar } from "react-native-paper";
import { UserAvatarProps } from "@/constants/ComponentTypes";
import { Image } from "expo-image";
import { Asset } from "expo-asset";

export const ProfileAvatarImage: React.FC<UserAvatarProps> = (props) => {
  const [source, setSource] = useState<string[]>([]);

  const handleError = () => {
    setSource(require("@/assets/avatars/avatar_default.png"));
  };

  const downloadImages = async (avatar_assets: Asset[]) => {
    const avatar_uris: string[] = [];
    for (const asset of avatar_assets) {
      const downloaded_asset = await asset.downloadAsync();
      if (downloaded_asset.localUri) {
        avatar_uris.push(downloaded_asset.localUri);
      }
    }
    setSource(avatar_uris);
  };

  useEffect(() => {
    if (props.img_src.length === 0) {
      setSource(require("@/assets/avatars/avatar_default.png"));
    } else {
      downloadImages(props.img_src);
    }
  }, [props.img_src]);

  return (
    <Image
      {...props}
      source={source}
      contentFit="contain"
      style={{
        backgroundColor: "transparent",
        width: props.size,
        height: props.size,
        borderRadius: 5,
      }}
      onError={handleError}
    />
  );
};
