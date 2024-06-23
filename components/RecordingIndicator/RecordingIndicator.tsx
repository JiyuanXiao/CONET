import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, View, Modal, Animated, Easing } from "react-native";
import { useTheme } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

function CustomActivityIndicator({
  time_left,
  timeout_notice_point,
  is_inside_panel,
}: {
  time_left: number;
  timeout_notice_point: number;
  is_inside_panel: boolean;
}) {
  const lowestScale = 0.6;
  const scaleAnim = useRef(new Animated.Value(lowestScale)).current;
  const { colors } = useTheme();

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 900,
          easing: Easing.elastic(1),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: is_inside_panel ? lowestScale : 1,
          duration: 900,
          easing: Easing.back(1),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scaleAnim]);

  return (
    <>
      <View style={styles.indicatorBox}>
        <Animated.View
          style={{
            ...styles.indicator,
            transform: [{ scale: scaleAnim }],
            backgroundColor:
              time_left <= timeout_notice_point || !is_inside_panel
                ? colors.notification
                : "#2ec42e",
          }}
        >
          {is_inside_panel ? (
            time_left <= timeout_notice_point && (
              <Text style={[styles.indicatorText]}>{time_left}''</Text>
            )
          ) : (
            <FontAwesome name="trash" size={30} color="white" />
          )}
        </Animated.View>
      </View>
      <View>
        <Text
          style={[
            styles.tipsText,
            {
              color: is_inside_panel ? colors.text : colors.notification,
            },
          ]}
        >
          {is_inside_panel ? "上滑取消发送" : "松开取消发送"}
        </Text>
      </View>
    </>
  );
}

function RecordingAnimationModal({
  visible,
  time_left,
  timeout_notice_point,
  is_inside_panel,
}: {
  visible: boolean;
  time_left: number;
  timeout_notice_point: number;
  is_inside_panel: boolean;
}) {
  const { colors } = useTheme();

  return (
    <Modal transparent={true} visible={visible}>
      <View style={styles.indicatorWrapper}>
        <CustomActivityIndicator
          time_left={time_left}
          timeout_notice_point={timeout_notice_point}
          is_inside_panel={is_inside_panel}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: "#888",
    padding: 12,
    marginBottom: 12,
    marginLeft: 8,
    marginRight: 8,
  },
  itemText: {
    color: "#fff",
    fontSize: 24,
  },
  indicatorWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(100, 100, 100, 0.6)",
  },
  indicatorBox: {
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  indicator: {
    width: 70,
    height: 70,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  indicatorText: {
    fontSize: 20,
    color: "white",
  },
  recordingPanel: {
    width: "100%",
    height: "15%",
  },
  tipsText: {
    fontSize: 17,
    marginTop: 5,
  },
});

export default RecordingAnimationModal;
