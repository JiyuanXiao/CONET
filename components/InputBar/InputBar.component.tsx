import React, { useState } from "react";
import { useTheme } from "@react-navigation/native";
import { InputBarContainer, InputBox, OffsetFooter } from "./InputBar.styles";
import { FontAwesome6, FontAwesome } from "@expo/vector-icons";
import { TextInput } from "./InputBar.styles";
import { ThemeColorsProps } from "@/constants/Types";

const VoiceMessageIcon: React.FC<{ theme_colors: ThemeColorsProps }> = (
  props
) => (
  <FontAwesome
    name="microphone"
    size={26}
    color={props.theme_colors.border}
    style={{ marginLeft: 5 }}
  />
);

const StickerIcon: React.FC<{ theme_colors: ThemeColorsProps }> = (props) => (
  <FontAwesome6 name="face-smile" size={26} color={props.theme_colors.border} />
);

const SelectPictureIcon: React.FC<{ theme_colors: ThemeColorsProps }> = (
  props
) => <FontAwesome name="picture-o" size={26} color={props.theme_colors.text} />;

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
      <InputBarContainer inputHeight={inputHeight} theme_colors={colors}>
        <InputBox inputHeight={inputHeight} theme_colors={colors}>
          <VoiceMessageIcon theme_colors={colors} />
          <TextInput
            value={message}
            inputHeight={inputHeight}
            theme_colors={colors}
            onChangeText={handleChangeText}
            onContentSizeChange={handleContentSizeChange}
          />
          <StickerIcon theme_colors={colors} />
          <SelectPictureIcon theme_colors={colors} />
        </InputBox>
      </InputBarContainer>
      <OffsetFooter theme_colors={colors} />
    </>
  );
};

export default InputBar;
