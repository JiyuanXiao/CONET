import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { DarkTheme, LightTheme } from "@/constants/Theme";
import { AuthenticationContextProvider } from "@/api/authentication/authentication.context";
import { SQLiteProvider } from "expo-sqlite";
import { ChatsContextProvider } from "@/api/chats/chats.context";
import "react-native-reanimated";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  const CurrentTheme = colorScheme === "dark" ? DarkTheme : LightTheme;

  return (
    <ThemeProvider value={CurrentTheme}>
      <AuthenticationContextProvider>
        <SQLiteProvider databaseName="messages.db">
          <ChatsContextProvider>
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
              <Stack.Screen name="modal" options={{ presentation: "modal" }} />
              <Stack.Screen name="chat-window" />
            </Stack>
          </ChatsContextProvider>
        </SQLiteProvider>
      </AuthenticationContextProvider>
    </ThemeProvider>
  );
}
