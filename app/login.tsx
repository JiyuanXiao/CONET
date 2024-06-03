import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { TextInput, Button, HelperText } from "react-native-paper";
import { useTheme } from "@react-navigation/native";
import { Text, View } from "react-native";
import { AuthenticationContext } from "@/api/authentication/authentication.context";
import { Entypo } from "@expo/vector-icons";

const light = "#ffe178";
const main = "#fcc404";
const dark = "#c49800";

export default function LoginScreen() {
  const { colors } = useTheme();
  const [username, setUsername] = useState("");
  const [passwrod, setPasswrod] = useState("");
  const [username_focus, setUsernameFocus] = useState(false);
  const [password_focus, setPasswordFocus] = useState(false);
  const [password_invisiable, setPasswordInvisiable] = useState(true);
  const [helpertext_visiable, setHelperTextVisiable] = useState(false);
  const [helpertext, setHelperText] = useState("");
  const { logIn } = useContext(AuthenticationContext);

  const handleOnPress = async () => {
    if (username.length > 0 && passwrod.length > 0) {
      console.log("LoginScreen(): calls logIn() for: " + username);
      const login_success = await logIn(username, passwrod);
      if (!login_success) {
        setHelperText("用户名或密码错误");
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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.background, { backgroundColor: main }]}>
        <View style={styles.container}>
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
            outlineColor={dark}
            activeOutlineColor={light}
            textColor="black"
            outlineStyle={{ borderRadius: 15, borderWidth: 2 }}
            onFocus={() => {
              setUsernameFocus(true);
            }}
            onBlur={() => {
              setUsernameFocus(false);
            }}
            left={
              <TextInput.Icon
                icon="account"
                color={username_focus ? light : dark}
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
            outlineColor={dark}
            activeOutlineColor={light}
            textColor="black"
            outlineStyle={{ borderRadius: 15, borderWidth: 2 }}
            onFocus={() => {
              setPasswordFocus(true);
            }}
            onBlur={() => {
              setPasswordFocus(false);
            }}
            left={
              <TextInput.Icon
                icon="lock"
                color={password_focus ? light : dark}
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
            <Entypo name="login" size={20} color={dark} />
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
    borderColor: "#c49800",
    borderWidth: 2,
    paddingVertical: 4,
    marginTop: 10,
  },
  button_text: {
    color: dark,
    fontWeight: "bold",
    fontSize: 18,
  },
});
