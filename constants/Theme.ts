import { default_theme } from "./Colors";

export const DarkTheme = {
  dark: true,
  colors: {
    primary: default_theme.PRIMARY,
    background: "#110F16",
    card: "#1a191c",
    text: "#ebe8e8",
    border: "#64636d",
    notification: "#ff453a",
  },
};

export const LightTheme = {
  dark: false,
  colors: {
    primary: default_theme.PRIMARY,
    background: "#f4f4f4",
    card: "#e6e6e6",
    text: "#000000",
    border: "#babab3",
    notification: "#ff453a",
  },
};
