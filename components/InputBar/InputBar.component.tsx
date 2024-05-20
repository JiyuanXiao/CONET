import React, { useState, useContext, useEffect } from "react";
import { useTheme } from "@react-navigation/native";
import { InputBarContainer, InputBox, OffsetFooter } from "./InputBar.styles";
import { FontAwesome6, FontAwesome } from "@expo/vector-icons";
import { TextInput } from "./InputBar.styles";
import { ThemeColorsProps, InputBarProps } from "@/constants/Types";
import { AuthenticationContext } from "@/api/authentication/authentication.context";
import { useSQLiteContext } from "expo-sqlite";
import { FriendsContext } from "@/api/friends/friends.context";
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
  const [message, setMessage] = useState("");
  const [inputHeight, setInputHeight] = useState(0);
  const { colors } = useTheme();
  const { user } = useContext(AuthenticationContext);
  const { updateFriendById } = useContext(FriendsContext);
  const { messages_object_list, addMessageById, getLoadedMessagesObjectById } =
    useContext(MessagesContext);
  const db = useSQLiteContext();

  const handleChangeText = (text: string) => {
    if (text.endsWith("\n")) {
      // let chat-window know a new message is sent
      props.setMessageSent(true);

      if (message.length > 0) {
        const formated_message = {
          content: message,
          sender_id: user?.account_id || "",
          receiver_id: props.friend_id,
          content_type: "text",
          is_recevied: false,
          db: db,
        };

        // Update Message Context, Context will store message to local storage for us
        addMessageById(
          user?.account_id || "",
          props.friend_id,
          formated_message
        );
      }
      setMessage("");
    } else {
      setMessage(text);
    }
  };

  const handleContentSizeChange = (event: any) => {
    setInputHeight(event.nativeEvent.contentSize.height);
  };

  // update chatbox info
  useEffect(() => {
    const newMessagesObject = getLoadedMessagesObjectById(props.friend_id);
    const newMessages = newMessagesObject?.loaded_messages;
    if (newMessages && newMessages.length > 0) {
      updateFriendById(props.friend_id);
    }
  }, [messages_object_list]);

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
