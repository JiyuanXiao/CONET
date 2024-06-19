import React, { useState, useContext, useEffect } from "react";
import { TouchableOpacity, Alert } from "react-native";
import { useTheme } from "@react-navigation/native";
import { InputBarContainer, InputBox, OffsetFooter } from "./InputBar.styles";
import { FontAwesome6, FontAwesome } from "@expo/vector-icons";
import { TextInput } from "./InputBar.styles";
import { ThemeColorsProps, InputBarProps } from "@/constants/ComponentTypes";
import { AuthenticationContext } from "@/api/authentication/authentication.context";
import { MessagesContext } from "@/api/messages/messages.context";
import * as ImagePicker from "expo-image-picker";
import { useAssets, Asset } from "expo-asset";

const VoiceMessageIcon = (theme_colors: ThemeColorsProps) => (
  <FontAwesome
    name="microphone"
    size={26}
    color={theme_colors.border}
    style={{ marginLeft: 5 }}
  />
);

const SubmitIcon = ({
  disable,
  theme_colors,
}: {
  disable: boolean;
  theme_colors: ThemeColorsProps;
}) => (
  <FontAwesome
    name="send"
    size={20}
    color={disable ? theme_colors.border : theme_colors.primary}
    style={{
      backgroundColor: theme_colors.background,
      borderWidth: 2,
      borderRadius: 12,
      borderColor: disable ? theme_colors.border : theme_colors.primary,
      paddingRight: 15,
      paddingLeft: 13,
      paddingVertical: 7,
    }}
  />
);

const SelectPictureIcon = (theme_colors: ThemeColorsProps) => (
  <FontAwesome
    name="picture-o"
    size={26}
    color={theme_colors.text}
    style={{ marginLeft: 8 }}
  />
);

const InputBar = (props: InputBarProps) => {
  const [new_message, setNewMessage] = useState("");
  const [inputHeight, setInputHeight] = useState(0);
  const { colors } = useTheme();
  const { user } = useContext(AuthenticationContext);
  const { sendMessage } = useContext(MessagesContext);
  const [assets, error] = useAssets([require("@/assets/images/icon.png")]);

  const pickImage = async () => {
    // Ask for permission to access the media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    // Pick an image
    console.log("start");
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      allowsMultipleSelection: true,
      selectionLimit: 9,
      quality: 0.5,
    });
    console.log("finished");

    if (!result.canceled) {
      console.log("file size: " + result.assets[0].fileSize);
      try {
        for (const asset of result.assets) {
          if (asset.fileSize && asset.fileSize > 20000000) {
            Alert.alert("文件过大", "服务器不支持超过19.5M的文件", [
              { text: "OK", onPress: () => {} },
            ]);
          } else if (asset.type === "image") {
            //const new_message = `[${process.env.EXPO_PUBLIC_SPECIAL_MESSAGE_INDICATOR}][图片]data:${image.mimeType};base64,${image.base64}`;
            const new_message = `[${process.env.EXPO_PUBLIC_SPECIAL_MESSAGE_INDICATOR}][图片]${asset.uri}`;
            await sendMessage(
              props.chat_id,
              new_message,
              Date.now().toString()
            );
          } else if (asset.type === "video") {
            console.log("file size: " + asset.fileSize);
            const new_message = `[${process.env.EXPO_PUBLIC_SPECIAL_MESSAGE_INDICATOR}][视频]${asset.uri}`;
            await sendMessage(
              props.chat_id,
              new_message,
              Date.now().toString()
            );
          } else {
            console.warn("[InputBar] Unknow type of media, message is aborted");
          }
        }
      } catch (error) {
        console.error("Error in sending the image or video:", error);
        Alert.alert("发送出错", "", [{ text: "OK", onPress: () => {} }]);
      }
    }
  };

  const handleChangeText = (text: string) => {
    if (text.endsWith("\n")) {
      // let chat-window know a new message is sent
      props.setMessageSent(true);
      setNewMessage("");
      if (new_message.length > 0) {
        if (user) {
          // Update Message Context, Context will store message to local storage for us
          console.log(
            "InputBar(): calling sendMessage() for " + user?.username
          );

          sendMessage(props.chat_id, new_message, Date.now().toString());
        } else {
          console.error("InputBar(): User is undefined");
        }
      }
    } else {
      setNewMessage(text);
    }
  };

  const handleSubmit = () => {
    props.setMessageSent(true);
    setNewMessage("");
    if (new_message.length > 0) {
      if (user) {
        // Update Message Context, Context will store message to local storage for us
        console.log("InputBar(): calling sendMessage() for " + user?.username);

        sendMessage(props.chat_id, new_message, Date.now().toString());
      } else {
        console.error("InputBar(): User is undefined");
      }
    }
  };

  const handleContentSizeChange = (event: any) => {
    setInputHeight(event.nativeEvent.contentSize.height);
  };

  return (
    <>
      <InputBarContainer inputHeight={inputHeight} theme_colors={colors}>
        <InputBox inputHeight={inputHeight} theme_colors={colors}>
          <TouchableOpacity onPress={pickImage}>
            <SelectPictureIcon {...colors} />
          </TouchableOpacity>
          <TextInput
            value={new_message}
            inputHeight={inputHeight}
            theme_colors={colors}
            onChangeText={handleChangeText}
            onContentSizeChange={handleContentSizeChange}
          />
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={new_message.length === 0}
          >
            <SubmitIcon
              disable={new_message.length === 0}
              theme_colors={colors}
            />
          </TouchableOpacity>
        </InputBox>
      </InputBarContainer>
      <OffsetFooter theme_colors={colors} />
    </>
  );
};

export default InputBar;
