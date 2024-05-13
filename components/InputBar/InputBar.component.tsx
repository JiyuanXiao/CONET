import React, { useState, useContext } from "react";
import { useTheme } from "@react-navigation/native";
import { InputBarContainer, InputBox, OffsetFooter } from "./InputBar.styles";
import { FontAwesome6, FontAwesome } from "@expo/vector-icons";
import { TextInput } from "./InputBar.styles";
import {
  ThemeColorsProps,
  MessagesProps,
  InputBarProps,
} from "@/constants/Types";
import { AuthenticationContext } from "@/api/authentication/authentication.context";
import { storeMessage } from "@/api/messages/messages.storage";
import { useSQLiteContext } from "expo-sqlite";
import { ChatsContext } from "@/api/chats/chats.context";

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
  const [message, setMessage] = useState("");
  const [inputHeight, setInputHeight] = useState(0);
  const { colors } = useTheme();
  const { user } = useContext(AuthenticationContext);
  const { updateChatById } = useContext(ChatsContext);
  const db = useSQLiteContext();

  const handleChangeText = (text: string) => {
    if (text.endsWith("\n")) {
      // let chat-window know a new message is sent
      props.setMessageSent(true);

      if (message.length > 0) {
        // store new message to local storage
        const newMessage = storeMessage({
          content: message,
          sender_id: user?.id || "",
          receiver_id: props.other_id,
          content_type: "text",
          is_recevied: false,
          db: db,
        });

        if (newMessage) {
          // update the state of messages by appending the new message
          props.setMessages([newMessage, ...props.messages]);

          // Updated the chats context so that ChatBox component can re-render
          updateChatById(props.other_id, {
            id: props.other_id,
            last_message_content: newMessage.content,
            last_message_timestamp: newMessage.timestamp,
          });
        }

        console.log("INFO: MESSAGE SUNMITTED: ", message);
      }
      setMessage("");
    } else {
      setMessage(text);
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
            value={message}
            inputHeight={inputHeight}
            theme_colors={colors}
            onChangeText={handleChangeText}
            onContentSizeChange={handleContentSizeChange}
          />
          <StickerIcon {...colors} />
          <SelectPictureIcon {...colors} />
        </InputBox>
      </InputBarContainer>
      <OffsetFooter theme_colors={colors} />
    </>
  );
};

export default InputBar;
