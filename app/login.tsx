import React, { useState, useContext, useRef, useEffect } from "react";
import {
  StyleSheet,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { TextInput, Button, HelperText } from "react-native-paper";
import { Dialog, Portal } from "react-native-paper";
import { useTheme } from "@react-navigation/native";
import { Text, View } from "react-native";
import { AuthenticationContext } from "@/api/authentication/authentication.context";
import { Entypo } from "@expo/vector-icons";

//const focus = "#ffe178";
const focus = "#041130";
const main = "#fcc404";
const blur = "#c49800";
//const blur = "#ffe178";

export default function LoginScreen() {
  const { colors } = useTheme();
  const [username, setUsername] = useState("");
  const [passwrod, setPasswrod] = useState("");
  const [username_focus, setUsernameFocus] = useState(false);
  const [password_focus, setPasswordFocus] = useState(false);
  const [password_invisiable, setPasswordInvisiable] = useState(true);
  const [helpertext_visiable, setHelperTextVisiable] = useState(false);
  const [helpertext, setHelperText] = useState("");
  const { logIn, error } = useContext(AuthenticationContext);
  const errorRef = useRef(error);

  const handleOnPress = async () => {
    if (username.length > 0 && passwrod.length > 0) {
      console.log("LoginScreen(): calls logIn() for: " + username);
      const login_success = await logIn(username, passwrod);
      if (!login_success) {
        // showDialog();
        setHelperText(errorRef.current);
        setHelperTextVisiable(true);
      } else {
        setUsername("");
        setPasswrod("");
        console.log("LoginScreen(): " + username + " Login success...");
      }
    } else {
      setHelperText("用户名或密码不能空白");
      setHelperTextVisiable(true);
    }
  };

  const handlePasswordSecureOnPress = () => {
    setPasswordInvisiable(!password_invisiable);
  };

  const onChangeId = (text: string) => {
    setUsername(text);
    setHelperText("");
    setHelperTextVisiable(false);
  };

  const onChangePassword = (text: string) => {
    setPasswrod(text);
    setHelperText("");
    setHelperTextVisiable(false);
  };

  useEffect(() => {
    errorRef.current = error;
  }, [error]);

  // const [visible, setVisible] = useState(false);

  // const showDialog = () => setVisible(true);

  // const hideDialog = () => setVisible(false);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.background, { backgroundColor: main }]}>
        <View style={styles.container}>
          {/* <Portal>
            <Dialog visible={visible} onDismiss={hideDialog}>
              <Dialog.Title>Alert</Dialog.Title>
              <Dialog.Content>
                <Text>{`base url: ${process.env.EXPO_PUBLIC_BASE_URL}\nwb: ${process.env.EXPO_PUBLIC_WEBSOCKET_BASE_URL}\nID: ${process.env.EXPO_PUBLIC_PROJECT_ID}\n${errorRef.current}`}</Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={hideDialog}>Done</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal> */}
          <Image
            style={styles.logo}
            source={require("@/assets/images/full-logo-transparent.png")}
          />
          <TextInput
            mode={"outlined"}
            style={[styles.input]}
            onChangeText={onChangeId}
            value={username}
            placeholder="用户名"
            outlineColor={blur}
            activeOutlineColor={focus}
            textColor="black"
            outlineStyle={{ borderRadius: 15, borderWidth: 3 }}
            onFocus={() => {
              setUsernameFocus(true);
            }}
            onBlur={() => {
              setUsernameFocus(false);
            }}
            left={
              <TextInput.Icon
                icon="account"
                color={username_focus ? focus : blur}
                size={30}
                style={styles.input_icon}
              />
            }
          />
          <TextInput
            mode={"outlined"}
            style={[styles.input]}
            onChangeText={onChangePassword}
            value={passwrod}
            placeholder="密码"
            secureTextEntry={password_invisiable}
            outlineColor={blur}
            activeOutlineColor={focus}
            textColor="black"
            outlineStyle={{ borderRadius: 15, borderWidth: 3 }}
            onFocus={() => {
              setPasswordFocus(true);
            }}
            onBlur={() => {
              setPasswordFocus(false);
            }}
            left={
              <TextInput.Icon
                icon="lock"
                color={password_focus ? focus : blur}
                size={28}
                style={styles.input_icon}
              />
            }
            right={
              <TextInput.Icon
                icon="eye"
                color={password_invisiable ? "grey" : "black"}
                size={28}
                style={styles.input_icon}
                onPress={handlePasswordSecureOnPress}
              />
            }
          />
          <HelperText
            type="error"
            visible={helpertext_visiable}
            style={{ color: colors.notification, height: 35 }}
          >
            {helpertext}
          </HelperText>
          <Button
            onPress={() => handleOnPress()}
            mode="contained"
            buttonColor="#041130"
            textColor="white"
            style={styles.button}
          >
            <Entypo name="login" size={20} color={blur} />
          </Button>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    width: "85%",
    marginVertical: 100,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  logo: {
    width: "100%",
    height: 150,
    marginBottom: 10,
    resizeMode: "contain",
  },
  title: {
    fontSize: 50,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    marginTop: 30,
    marginBottom: 0,
    backgroundColor: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  input_icon: {
    marginTop: 10,
    alignItems: "center",
    height: 30,
  },
  button: {
    width: "60%",
    height: 60,
    borderRadius: 30,

    justifyContent: "center",
    alignSelf: "center",
    borderColor: blur,
    borderWidth: 2,
    paddingVertical: 4,
    marginTop: 10,
  },
  button_text: {
    color: blur,
    fontWeight: "bold",
    fontSize: 18,
  },
});
