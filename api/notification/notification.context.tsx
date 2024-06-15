import { useState, useEffect, useRef, createContext, useContext } from "react";
import { Text, View, Button, Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { ChatsContext } from "../chats/chats.context";
import { AuthenticationContext } from "../authentication/authentication.context";
import { CE_ChatProps } from "@/constants/ChatEngineObjectTypes";
import * as NotificationServer from "@/api/notification/notification.api";

interface NotificationContextProps {
  notification: Notifications.Notification | undefined;
  sendNotificationByChatId: (chat_id: number) => Promise<void>;
  registerForPushNotificationsAsync(): Promise<string | undefined>;
  disconnectFromNotificaiton: () => Promise<void>;
}

export const NotificationContext = createContext<NotificationContextProps>({
  notification: undefined,
  sendNotificationByChatId: async () => {},
  registerForPushNotificationsAsync: async () => undefined,
  disconnectFromNotificaiton: async () => {},
});

export const NotificationContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const { chats } = useContext(ChatsContext);
  const { user, is_authentication_initialized } = useContext(
    AuthenticationContext
  );

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  function handleRegistrationError(errorMessage: string) {
    alert(errorMessage);
    throw new Error(errorMessage);
  }

  async function registerForPushNotificationsAsync() {
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
        sound: "long-pop.wave",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        handleRegistrationError(
          "Permission not granted to get push token for push notification!"
        );
        return;
      }
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        handleRegistrationError("Project ID not found");
      }
      try {
        const pushTokenString = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;
        await NotificationServer.setNotificationToken(
          pushTokenString,
          user?.username
        );
        return pushTokenString;
      } catch (e: unknown) {
        handleRegistrationError(`${e}`);
      }
    } else {
      handleRegistrationError(
        "Must use physical device for push notifications"
      );
    }
  }

  // async function sendPushNotification(title: string, body: string) {
  //   const message = {
  //     to: expoPushToken,
  //     sound: "default",
  //     title: title,
  //     body: body,
  //     data: {},
  //   };
  //   try {
  //     await fetch("https://exp.host/--/api/v2/push/send", {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Accept-encoding": "gzip, deflate",
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(message),
  //     });
  //     console.log(`[Notification Context] sent notification ${title}: ${body}`);
  //   } catch (err) {
  //     console.error(`[Notification Context] sent notification error: ${err}`);
  //   }
  // }

  const getChatTitle = (chat: CE_ChatProps) => {
    switch (chat.people.length) {
      case 0:
        return "";
      case 1:
        return chat.people[0].person.first_name;
      case 2:
        const name_1 = chat.people[0].person.first_name;
        const name_2 = chat.people[1].person.first_name;
        return chat.people[0].person.username === user?.username
          ? name_1
          : name_2;
      default:
        return chat.title;
    }
  };

  const sendNotificationByChatId = async (chat_id: number) => {
    const current_chat = chats.get(Number(chat_id));
    console.log(`[Notification Context] ${JSON.stringify(current_chat)}`);
    if (current_chat) {
      const chat_title = getChatTitle(current_chat);
      for (const member of current_chat.people) {
        try {
          await NotificationServer.sendNotification(
            user?.username || "",
            member.person.username,
            chat_title
          );
          console.log(
            `[Notification Context] send notification to ${member.person.first_name}`
          );
        } catch (err) {
          console.error(
            `[Notification Context] send notification to ${member.person.first_name} failed: ${err}`
          );
        }
      }
    }
  };

  const disconnectFromNotificaiton = async () => {
    try {
      await NotificationServer.disconnectFromNotificaiton(user?.username);
      console.log(
        `[Notification Context] ${user?.username} stop receving notification`
      );
    } catch (err) {
      console.error(
        `[Notification Context] disconnect from notificaiton server failed: ${err}`
      );
    }
  };

  useEffect(() => {
    if (is_authentication_initialized && user) {
      registerForPushNotificationsAsync()
        .then((token) => {
          setExpoPushToken(token ?? "");
          // await NotificationServer.setNotificationToken(token, user?.username);
          console.log(`[Notification Context] token: ${token}`);
        })
        .catch((error: any) => {
          setExpoPushToken(`${error}`);
          console.error(
            `[Notification Context] register token error: ${error}`
          );
        });

      // App is in foreground
      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          console.log(`[Notification Context] app is in foreground!!!`);
          setNotification(notification);
        });

      // Notification is tapped
      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log(`[Notification Context] notification is tapped!!!`);
          console.log(response);
        });
    }
    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
      disconnectFromNotificaiton();
    };
  }, [is_authentication_initialized, user]);

  return (
    <NotificationContext.Provider
      value={{
        notification,
        sendNotificationByChatId,
        registerForPushNotificationsAsync,
        disconnectFromNotificaiton,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// export default function App() {

//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
//       <Text>Your Expo push token: {expoPushToken}</Text>
//       <View style={{ alignItems: 'center', justifyContent: 'center' }}>
//         <Text>Title: {notification && notification.request.content.title} </Text>
//         <Text>Body: {notification && notification.request.content.body}</Text>
//         <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
//       </View>
//       <Button
//         title="Press to Send Notification"
//         onPress={async () => {
//           await sendPushNotification(expoPushToken);
//         }}
//       />
//     </View>
//   );
// }
