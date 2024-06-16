import axios from "axios";

export const setNotificationToken = async (
  token: string | undefined,
  username: string | undefined
) => {
  if (!token || !username) {
    console.warn(
      `[Notification API] setNotificationToken(): token and username cannot be undefined`
    );
    return;
  }
  try {
    const url = `${process.env.EXPO_PUBLIC_NOTIFICATION_SERVER_URL}/${username}/`;
    console.log(url);
    const headers = {
      "SECRET-KEY": process.env.EXPO_PUBLIC_NOTIFICATION_SERVER_KEY,
      TOKEN: token,
    };
    const response = await axios.put(url, null, { headers });
    console.log(`[Notification API] Update Token: ${response.data}`);
  } catch (err) {
    console.log(`[Notification API] Update Token Failed: ${err}`);
  }
};

export const sendNotification = async (
  username: string,
  receiver_username: string,
  chat_name: string
) => {
  try {
    const url = `${process.env.EXPO_PUBLIC_NOTIFICATION_SERVER_URL}/${username}/`;
    const headers = {
      "SECRET-KEY": process.env.EXPO_PUBLIC_NOTIFICATION_SERVER_KEY,
      RECEIVER: receiver_username,
    };

    const data = {
      chat_name: chat_name,
    };
    const response = await axios.post(url, data, { headers });
    console.log(`[Notification API] Sent Notificaiton: ${response.data}`);
  } catch (err) {
    console.log(`[Notification API] Sent Notificaiton Failed: ${err}`);
  }
};

export const disconnectFromNotificaiton = async (
  username: string | undefined
) => {
  if (!username) {
    console.warn(
      `[Notification API] disconnectFromNotificaiton(): username cannot be undefined`
    );
    return;
  }
  try {
    const url = `${process.env.EXPO_PUBLIC_NOTIFICATION_SERVER_URL}/${username}/`;
    const headers = {
      "SECRET-KEY": process.env.EXPO_PUBLIC_NOTIFICATION_SERVER_KEY,
    };
    const response = await axios.delete(url, { headers });
    console.log(
      `[Notification API] Disconnect from notification server: ${response.data}`
    );
  } catch (err) {
    console.log(
      `[Notification API] Disconnect from notification server Failed: ${err}`
    );
  }
};
