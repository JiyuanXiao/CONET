import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect, useRef, useState } from "react";
import { PixelRatio, StyleSheet, View, Button } from "react-native";
import { useRoute } from "@react-navigation/native";

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

  useEffect(() => {
    const subscription = player.addListener("playingChange", (isPlaying) => {
      setIsPlaying(isPlaying);
    });

    return () => {
      subscription.remove();
    };
  }, [player]);

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
