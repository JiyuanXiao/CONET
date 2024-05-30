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

export default function LoginScreen() {
  const { colors } = useTheme();
  const [username, setUsername] = useState("");
  const [passwrod, setPasswrod] = useState("");
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
      <View style={[styles.background, { backgroundColor: "#fcc404" }]}>
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
            outlineColor="black"
            activeOutlineColor={colors.primary}
            textColor="black"
            outlineStyle={{ borderRadius: 15, borderWidth: 4 }}
            left={
              <TextInput.Icon
                icon="account"
                color="black"
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
            outlineColor="black"
            activeOutlineColor={colors.primary}
            textColor="black"
            outlineStyle={{ borderRadius: 15, borderWidth: 4 }}
            left={
              <TextInput.Icon
                icon="lock"
                color="black"
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
            style={{ color: colors.notification }}
          >
            {helpertext}
          </HelperText>
          <Button
            onPress={() => handleOnPress()}
            mode="contained"
            buttonColor={colors.primary}
            textColor="white"
            style={styles.button}
          >
            <Entypo name="login" size={20} color="black" />
            <Text style={styles.button_text}> LOGIN</Text>
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
    resizeMode: "contain",
  },
  title: {
    fontSize: 50,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    marginVertical: 15,
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
    width: "100%",
    borderRadius: 15,

    justifyContent: "center",
    alignSelf: "center",
    borderColor: "black",
    borderWidth: 4,
    paddingVertical: 3,
  },
  button_text: {
    color: "black",
    fontWeight: "bold",
    fontSize: 18,
  },
});
