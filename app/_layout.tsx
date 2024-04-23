import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "@/components/useColorScheme";

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

  const DarkTheme = {
    dark: true,
    colors: {
      primary: "#da7c2b",
      background: "#1a191c",
      card: "#424248",
      text: "#ebe8e8",
      border: "#64636d",
      notification: "ff453a",
    },
  };

  const LightTheme = {
    dark: false,
    colors: {
      primary: "#da7c2b",
      background: "#f4f4f4",
      card: "#b5b5b5",
      text: "#000000",
      border: "#929293",
      notification: "ff453a",
    },
  };

  const CurrentTheme = colorScheme === "dark" ? DarkTheme : LightTheme;

  return (
    <ThemeProvider value={CurrentTheme}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: CurrentTheme.colors.background },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{ title: "Chats", headerShown: false }}
        />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        <Stack.Screen name="chat-window" />
      </Stack>
    </ThemeProvider>
  );
}
