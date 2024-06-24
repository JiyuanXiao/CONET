import React, { useState, useContext, useEffect, useRef } from "react";
import {
  TouchableOpacity,
  Alert,
  Text,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
  Dimensions,
} from "react-native";
import { Modal, Portal, ActivityIndicator } from "react-native-paper";
import { useTheme } from "@react-navigation/native";
import {
  InputBarContainer,
  InputBox,
  OffsetFooter,
  VoiceInput,
} from "./InputBar.styles";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import { TextInput } from "./InputBar.styles";
import { ThemeColorsProps, InputBarProps } from "@/constants/ComponentTypes";
import { AuthenticationContext } from "@/api/authentication/authentication.context";
import { MessagesContext } from "@/api/messages/messages.context";
import * as ImagePicker from "expo-image-picker";
import { moderateScale } from "react-native-size-matters";
import { Audio } from "expo-av";
import RecordingAnimationModal from "../RecordingIndicator/RecordingIndicator";
import { ChatsContext } from "@/api/chats/chats.context";

const VoiceMessageIcon = (theme_colors: ThemeColorsProps) => (
  <FontAwesome name="microphone" size={25} color={theme_colors.text} />
);

const KeyBoardIcon = (theme_colors: ThemeColorsProps) => (
  <Entypo name="keyboard" size={25} color={theme_colors.text} style={{}} />
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
      paddingRight: 12,
      paddingLeft: 10,
      paddingVertical: 7,
    }}
  />
);

const SelectPictureIcon = (theme_colors: ThemeColorsProps) => (
  <FontAwesome
    name="picture-o"
    size={26}
    color={theme_colors.text}
    style={{ marginHorizontal: 9 }}
  />
);

const InputBar = (props: InputBarProps) => {
  const [new_message, setNewMessage] = useState("");
  const [inputHeight, setInputHeight] = useState(0);
  const { colors } = useTheme();
  const { user } = useContext(AuthenticationContext);
  const { sendMessage } = useContext(MessagesContext);
  const { message_draft, setMessageDraftMap } = useContext(ChatsContext);
  const [is_voice_message_mode, setIsVoiceMessageMode] =
    useState<boolean>(false);
  const [loading_modal_visible, setLoadingModalVisible] =
    useState<boolean>(false);
  const [recording_modal_visible, setRecordingModalVisible] =
    useState<boolean>(false);
  const [sound_uri, setSoundUri] = useState<string | null>(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [time_out_sound, setTimeOutSound] = useState<Audio.Sound | null>(null);
  const [voice_sent_sound, setVoiceSentSound] = useState<Audio.Sound | null>(
    null
  );
  const [recording, setRecording] = useState<Audio.Recording | undefined>();
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const RECORDING_TIMEOUT_IN_SECOND = 59;
  const TIMEOUT_NOTICE_POINT_IN_SECOND = 10;
  const [timeLeft, setTimeLeft] = useState(RECORDING_TIMEOUT_IN_SECOND);
  const new_message_ref = useRef(new_message);

  ///////////////////////////////////////////////////////////////////////////////////////
  const [is_inside_panel, setIsInsidePanel] = useState<boolean>(true);
  const { height: screenHeight } = Dimensions.get("window");
  const controlPanelHeight = screenHeight * 0.15;

  ///////////////////////////////////////////////////////////////

  const openVoiceMessageMode = async () => {
    try {
      if (permissionResponse && permissionResponse.status !== "granted") {
        console.log("Requesting permission..");
        await requestPermission();
        setIsVoiceMessageMode(true);
      } else if (
        permissionResponse &&
        permissionResponse.status === "granted"
      ) {
        setIsVoiceMessageMode(true);
      }
    } catch (err) {
      console.warn("Failed to open voice message mode", err);
    }
  };

  const closeVoiceMessageMode = () => {
    setIsVoiceMessageMode(false);
  };

  async function startRecording() {
    setTimeLeft(RECORDING_TIMEOUT_IN_SECOND);
    setRecordingModalVisible(true);
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log("Recording started");

      // Start the timer
      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      setTimer(timerId);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    setRecordingModalVisible(false);
    if (recording) {
      console.log("Stopping recording..");
      try {
        setRecording(undefined);
        await recording.stopAndUnloadAsync();

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
        });
        const uri = recording.getURI();

        //setSoundUri(uri);
        await voice_sent_sound?.replayAsync();
        const voice_message = `[${process.env.EXPO_PUBLIC_SPECIAL_MESSAGE_INDICATOR}][语音]${uri}`;
        await sendMessage(props.chat_id, voice_message, Date.now().toString());

        // Clear the timer
        if (timer) {
          clearInterval(timer);
          setTimer(null);
        }
      } catch (err) {
        console.error(
          `[InputBar.component.tsx]: Send voice message failed: ${err}`
        );
      }
    }
  }

  const abortRecording = async () => {
    setRecordingModalVisible(false);
    if (recording) {
      console.log("Aborting recording..");
      try {
        setRecording(undefined);
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
        });
        setSoundUri(null);
        if (timer) {
          clearInterval(timer);
          setTimer(null);
        }
      } catch (err) {
        console.error(
          `[InputBar.component.tsx]: abort recording failed: ${err}`
        );
      }
    }
    setIsInsidePanel(true);
  };

  const stopRecordingRef = useRef(stopRecording);
  const abortRecordingRef = useRef(abortRecording);

  useEffect(() => {
    stopRecordingRef.current = stopRecording;
    abortRecordingRef.current = abortRecording;
  }, [recording, timer]);

  useEffect(() => {
    if (timeLeft === TIMEOUT_NOTICE_POINT_IN_SECOND && recording) {
      time_out_sound?.replayAsync();
    }
    if (timeLeft === 0 && recording) {
      stopRecording();
    }
  }, [timeLeft]);

  useEffect(() => {
    const setupSoundEffect = async () => {
      try {
        const timeout = await Audio.Sound.createAsync(
          require("@/assets/sounds/doublebeep.wav") // Replace with your sound file
        );
        setTimeOutSound(timeout.sound);
        const sent = await Audio.Sound.createAsync(
          require("@/assets/sounds/longpop.wav") // Replace with your sound file
        );
        setVoiceSentSound(sent.sound);
      } catch (error) {
        console.error("Error playing timeout sound:", error);
      }
    };
    setupSoundEffect();

    // load draft from chat context
    const draft = message_draft.get(Number(props.chat_id));
    console.log("draft: " + draft);
    setNewMessage(draft ? draft : "");
  }, []);

  //////////////////////////////////////////////////////////////////////////////////

  const panResponder = useRef(
    PanResponder.create({
      onPanResponderGrant: () => {
        console.log("Finger Down");
        startRecording();
      },
      onStartShouldSetPanResponderCapture() {
        return true;
      },
      onPanResponderMove: (
        evt: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        const { moveY } = gestureState;
        const isInside = moveY >= screenHeight - controlPanelHeight;
        setIsInsidePanel(isInside);
      },
      onPanResponderRelease: (
        evt: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        console.log("relase!!");
        const { moveY } = gestureState;

        if (moveY === 0 || moveY >= screenHeight - controlPanelHeight) {
          stopRecordingRef.current();
          console.log("sned!!");
        } else {
          abortRecordingRef.current();
          console.log("abort!!!");
        }
      },
    })
  ).current;

  //////////////////////////////////////////////////////////////////////////////////////////////

  const pickImage = async () => {
    // Ask for permission to access the media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    // Pick an image
    setLoadingModalVisible(true);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      allowsMultipleSelection: true,
      selectionLimit: 9,
      quality: 0.4,
    });
    setLoadingModalVisible(false);

    if (!result.canceled) {
      console.log("file size: " + result.assets[0].fileSize);
      try {
        for (const asset of result.assets) {
          if (asset.fileSize && asset.fileSize > 20000000) {
            Alert.alert("文件过大", "文件不能超过19.5M", [
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

  useEffect(() => {
    new_message_ref.current = new_message;
  }, [new_message]);

  useEffect(() => {
    return () => {
      setMessageDraftMap(props.chat_id, new_message_ref.current);
    };
  }, []);

  return (
    <>
      <Portal>
        <Modal
          visible={loading_modal_visible}
          onDismiss={() => setLoadingModalVisible(false)}
          contentContainerStyle={{
            backgroundColor: colors.card,
            padding: 20,
            width: "40%",
            height: "10%",
            justifyContent: "center",
            alignSelf: "center",
            borderRadius: 15,
            flexDirection: "row",
          }}
        >
          <ActivityIndicator
            size={moderateScale(18, 1)}
            color={colors.primary}
            style={{ paddingHorizontal: 10 }}
          />
          <Text
            style={{
              color: colors.text,
              alignSelf: "center",
              fontSize: moderateScale(12, 1.5),
            }}
          >
            文件加载中...
          </Text>
        </Modal>
      </Portal>
      <RecordingAnimationModal
        visible={recording_modal_visible}
        time_left={timeLeft}
        timeout_notice_point={TIMEOUT_NOTICE_POINT_IN_SECOND}
        is_inside_panel={is_inside_panel}
      />
      <InputBarContainer inputHeight={inputHeight} theme_colors={colors}>
        <InputBox inputHeight={inputHeight} theme_colors={colors}>
          {is_voice_message_mode ? (
            <TouchableOpacity
              onPress={closeVoiceMessageMode}
              style={{
                width: 40,
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              <KeyBoardIcon {...colors} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={openVoiceMessageMode}
              style={{
                width: 40,
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              <VoiceMessageIcon {...colors} />
            </TouchableOpacity>
          )}
          {is_voice_message_mode ? (
            <VoiceInput theme_colors={colors} {...panResponder.panHandlers}>
              <Text style={{ color: colors.text, fontSize: 16 }}>按住说话</Text>
            </VoiceInput>
          ) : (
            <TextInput
              value={new_message}
              inputHeight={inputHeight}
              theme_colors={colors}
              onChangeText={handleChangeText}
              onContentSizeChange={handleContentSizeChange}
            />
          )}

          {new_message.length === 0 ? (
            <TouchableOpacity onPress={pickImage}>
              <SelectPictureIcon {...colors} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={new_message.length === 0}
            >
              <SubmitIcon
                disable={new_message.length === 0}
                theme_colors={colors}
              />
            </TouchableOpacity>
          )}
        </InputBox>
      </InputBarContainer>
      <OffsetFooter theme_colors={colors} />
    </>
  );
};

export default InputBar;
