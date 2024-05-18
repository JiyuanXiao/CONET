import { ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { PaperProvider } from "react-native-paper";
import { DarkTheme, LightTheme } from "@/constants/Theme";
import { AuthenticationContextProvider } from "@/api/authentication/authentication.context";
import { SQLiteProvider } from "expo-sqlite";
import { FriendsContextProvider } from "@/api/friends/friends.context";
import { MessagesContextProvider } from "@/api/messages/messages.context";
import "react-native-reanimated";

// export {
//   // Catch any errors thrown by the Layout component.
//   ErrorBoundary,
// } from "expo-router";

// export const unstable_settings = {
//   // Ensure that reloading on `/modal` keeps a back button present.
//   initialRouteName: "(tabs)",
// };

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // const [loaded, error] = useFonts({
  //   SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  //   ...FontAwesome.font,
  // });

  // // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  // useEffect(() => {
  //   if (error) throw error;
  // }, [error]);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  // if (!loaded) {
  //   return null;
  // }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  const CurrentTheme = colorScheme === "dark" ? DarkTheme : LightTheme;

  return (
    <PaperProvider>
      <ThemeProvider value={CurrentTheme}>
        <AuthenticationContextProvider>
          <SQLiteProvider databaseName="messages.db">
            <FriendsContextProvider>
              <MessagesContextProvider>
                <Stack
                  screenOptions={{
                    headerStyle: {
                      backgroundColor: CurrentTheme.colors.background,
                    },
                  }}
                >
                  <Stack.Screen
                    name="(tabs)"
                    options={{ title: "Chats", headerShown: false }}
                  />
                  <Stack.Screen
                    name="add-friends"
                    options={{ title: "添加朋友", presentation: "modal" }}
                  />
                  <Stack.Screen
                    name="add-friend-detail"
                    options={{
                      title: "详情",
                      headerBackTitleVisible: false,
                      headerTitleAlign: "center",
                      presentation: "modal",
                    }}
                  />
                  <Stack.Screen
                    name="friend-settings"
                    options={{
                      title: "聊天设置",
                      headerBackTitleVisible: false,
                    }}
                  />
                  <Stack.Screen
                    options={{
                      headerBackTitleVisible: false,
                      headerTitleAlign: "center",
                    }}
                    name="chat-window"
                  />
                </Stack>
              </MessagesContextProvider>
            </FriendsContextProvider>
          </SQLiteProvider>
        </AuthenticationContextProvider>
      </ThemeProvider>
    </PaperProvider>
  );
}
