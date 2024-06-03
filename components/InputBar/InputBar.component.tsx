import React, { useState, useContext, useEffect } from "react";
import { useTheme } from "@react-navigation/native";
import { InputBarContainer, InputBox, OffsetFooter } from "./InputBar.styles";
import { FontAwesome6, FontAwesome } from "@expo/vector-icons";
import { TextInput } from "./InputBar.styles";
import { ThemeColorsProps, InputBarProps } from "@/constants/ComponentTypes";
import { AuthenticationContext } from "@/api/authentication/authentication.context";
import { useSQLiteContext } from "expo-sqlite";
import { MessagesContext } from "@/api/messages/messages.context";

const VoiceMessageIcon = (theme_colors: ThemeColorsProps) => (
  <FontAwesome
    name="microphone"
    size={26}
    color={theme_colors.border}
    style={{ marginLeft: 5 }}
  />
);

const StickerIcon = (theme_colors: ThemeColorsProps) => (
  <FontAwesome6 name="face-smile" size={26} color={theme_colors.border} />
);

const SelectPictureIcon = (theme_colors: ThemeColorsProps) => (
  <FontAwesome name="picture-o" size={26} color={theme_colors.text} />
);

const InputBar = (props: InputBarProps) => {
  const [new_message, setNewMessage] = useState("");
  const [inputHeight, setInputHeight] = useState(0);
  const { colors } = useTheme();
  const { user } = useContext(AuthenticationContext);
  const { sendMessage } = useContext(MessagesContext);

  const handleChangeText = (text: string) => {
    if (text.endsWith("\n")) {
      // let chat-window know a new message is sent
      props.setMessageSent(true);

      if (new_message.length > 0) {
        if (user) {
          // Update Message Context, Context will store message to local storage for us
          console.log(
            "InputBar(): calling sendMessage() for " + user?.username
          );

          sendMessage(
            props.chat_id,
            user.username,
            new_message,
            null,
            Date.now().toString()
          );
        } else {
          console.error("InputBar(): User is undefined");
        }
      }
      setNewMessage("");
    } else {
      setNewMessage(text);
    }
  };

  const handleContentSizeChange = (event: any) => {
    setInputHeight(event.nativeEvent.contentSize.height);
  };

  return (
    <>
      <InputBarContainer inputHeight={inputHeight} theme_colors={colors}>
        <InputBox inputHeight={inputHeight} theme_colors={colors}>
          <VoiceMessageIcon {...colors} />
          <TextInput
            value={new_message}
            inputHeight={inputHeight}
            theme_colors={colors}
            onChangeText={handleChangeText}
            onContentSizeChange={handleContentSizeChange}
          />
          <SelectPictureIcon {...colors} />
        </InputBox>
      </InputBarContainer>
      <OffsetFooter theme_colors={colors} />
    </>
  );
};

export default InputBar;
