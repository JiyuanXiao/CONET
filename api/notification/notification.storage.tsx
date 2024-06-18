import AsyncStorage from "@react-native-async-storage/async-storage";

export const setNotificationState = async (state: boolean) => {
  let state_string;
  if (state) {
    state_string = "true";
  } else {
    state_string = "false";
  }
  try {
    await AsyncStorage.setItem("notification-state", state_string);
    console.log(
      `[Notification Storage] save notification state to storage: ${state}`
    );
  } catch (err) {
    console.error("[Notification Storage] setNotificationState(): " + err);
  }
};

export const getNotificationsState = async (): Promise<boolean | null> => {
  try {
    const state = await AsyncStorage.getItem("notification-state");
    console.log(
      `[Notification Storage] get notification state from storage ${state}`
    );
    if (!state) {
      return null;
    }
    if (state === "true") {
      return true;
    }
    if (state === "false") {
      return false;
    }
    return null;
  } catch (err) {
    console.error("[Notification Storage] getNotificationsState(): " + err);
    return null;
  }
};
