import { useVideoPlayer, VideoView } from "expo-video";
import {
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
  useCallback,
} from "react";
import {
  PixelRatio,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRoute, useTheme, useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";

export default function VideoScreen() {
  const route = useRoute();
  const { video_source } = route.params as {
    video_source: string;
  };

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const player = useVideoPlayer(video_source, (player) => {
    player.loop = false;
    player.play();
  });
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  useEffect(() => {
    const subscription = player.addListener("playingChange", (isPlaying) => {
      setIsPlaying(isPlaying);
    });

    return () => {
      subscription.remove();
    };
  }, [player]);

  const saveVideo = async (uri: string) => {
    let current_permission = permissionResponse;
    if (!current_permission || current_permission.status !== "granted") {
      current_permission = await requestPermission();
      console.log(current_permission);
    }

    if (current_permission?.status !== "granted") {
      Alert.alert("未成功授权访问相册");
      return;
    }

    Alert.alert("确认保存视频?", "", [
      {
        isPreferred: true,
        text: "确认",
        onPress: async () => {
          try {
            await MediaLibrary.saveToLibraryAsync(uri);
            Alert.alert("保存成功", "", [{ text: "OK", onPress: () => {} }]);
          } catch (err) {
            console.error(
              `[ImageMessageBubble.component] savePhoto: failed to save phto to library: ${err}`
            );
          }
        },
        style: "default",
      },
      {
        isPreferred: false,
        text: "取消",
        onPress: () => {},
        style: "destructive",
      },
    ]);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => saveVideo(video_source)}>
          <FontAwesome name="download" size={24} color={colors.text} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.contentContainer}>
      <VideoView
        ref={videoRef}
        style={styles.video}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 0,
  },
  video: {
    width: "100%",
    height: "90%",
  },
  controlsContainer: {
    padding: 10,
  },
});
