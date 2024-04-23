import React, { useState } from "react";
import { useTheme } from "@react-navigation/native";
import { InputBarContainer, InputBox, OffsetFooter } from "./InputBar.styles";
import { FontAwesome6, FontAwesome } from "@expo/vector-icons";
import { TextInput } from "./InputBar.styles";

const VoiceMessageIcon = () => (
  <FontAwesome
    name="microphone"
    size={26}
    color="grey"
    style={{ marginLeft: 5 }}
  />
);

const StickerIcon = () => (
  <FontAwesome6
    name="face-smile"
    size={26}
    color="grey"
    style={{ paddingRight: 0 }}
  />
);

const SelectPictureIcon = () => (
  <FontAwesome
    name="picture-o"
    size={26}
    color="white"
    style={{ paddingLeft: 0, paddingRight: 0 }}
  />
);

const InputBar = () => {
  const [message, setMessage] = useState("");
  const [inputHeight, setInputHeight] = useState(0);
  const { colors } = useTheme();

  const handleChangeText = (text: string) => {
    if (text.endsWith("\n")) {
      if (message.length > 0) {
        console.log("Submit:", message);
        // Submit Message Here
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
      <InputBarContainer inputHeight={inputHeight}>
        <InputBox inputHeight={inputHeight}>
          <VoiceMessageIcon />
          <TextInput
            value={message}
            inputHeight={inputHeight}
            theme_colors={colors}
            onChangeText={handleChangeText}
            onContentSizeChange={handleContentSizeChange}
          />
          <StickerIcon />
          <SelectPictureIcon />
        </InputBox>
      </InputBarContainer>
      <OffsetFooter />
    </>
  );
};

export default InputBar;
