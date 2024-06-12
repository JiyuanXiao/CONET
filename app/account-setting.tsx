import React, { useContext, useState, useLayoutEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useTheme, useRoute, useNavigation } from "@react-navigation/native";
import {
  Searchbar,
  Button,
  ActivityIndicator,
  HelperText,
} from "react-native-paper";
import { AuthenticationContext } from "@/api/authentication/authentication.context";
import { FontAwesome5 } from "@expo/vector-icons";
import * as AuthenServer from "@/api/authentication/authentication.api";

export default function AccountSettingScreen() {
  const { user } = useContext(AuthenticationContext);
  const [name, setName] = useState("");
  const [old_password, setOldPassword] = useState("");
  const [old_password_again, setOldPasswordAgain] = useState("");
  const [new_password, setNewPassowrd] = useState("");
  const [password_visiable, setPasswordVisiable] = useState(false);
  const [is_uploading, setIsUpLoading] = useState(false);
  const [helpertext_visiable, setHelperTextVisiable] = useState(false);
  const [helpertext, setHelperText] = useState("");
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { setting_type } = route.params as {
    setting_type: string;
  };

  const handleChangeName = async () => {
    try {
      setIsUpLoading(true);
      const success = await AuthenServer.UpdateMyAccount(
        user?.username || "",
        user?.secret || "",
        name,
        null
      );
      if (success === 200) {
        Alert.alert("成功重置名字", "", [{ text: "OK", onPress: () => {} }]);
      } else if (success === 429) {
        Alert.alert("重置名字失败", "用户请求达到上限，请稍后再试", [
          { text: "OK", onPress: () => {} },
        ]);
      } else if (success === 403 || success === 404) {
        Alert.alert("重置名字失败", "用户信息认证失败，请联系开发人员", [
          { text: "OK", onPress: () => {} },
        ]);
      } else if (success === 400) {
        Alert.alert("重置名字失败", "无效请求，请联系开发人员", [
          { text: "OK", onPress: () => {} },
        ]);
      } else {
        Alert.alert("重置名字失败", "服务器错误，请联系开发人员", [
          { text: "OK", onPress: () => {} },
        ]);
      }
      setIsUpLoading(false);
    } catch (err) {
      console.error(`[account-setting.tsx] handleChangeName(): ${err}`);
      setIsUpLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (
      old_password.length === 0 ||
      old_password_again.length === 0 ||
      new_password.length === 0
    ) {
      setHelperText("请输入密码");
      setHelperTextVisiable(true);
      return;
    }
    if (old_password !== old_password_again) {
      setHelperText("密码不一致");
      setHelperTextVisiable(true);
      return;
    }
    try {
      setIsUpLoading(true);
      const success = await AuthenServer.UpdateMyAccount(
        user?.username || "",
        old_password,
        null,
        new_password
      );
      if (success === 200) {
        Alert.alert("成功更改密码", "", [{ text: "OK", onPress: () => {} }]);
      } else if (success === 429) {
        Alert.alert("更改密码失败", "用户请求达到上限，请稍后再试", [
          { text: "OK", onPress: () => {} },
        ]);
      } else if (success === 403 || success === 404) {
        Alert.alert("等阵...更改密码失败", "密码不正确", [
          { text: "OK", onPress: () => {} },
        ]);
      } else if (success === 400) {
        Alert.alert("更改密码失败", "无效请求，请联系开发人员", [
          { text: "OK", onPress: () => {} },
        ]);
      } else {
        Alert.alert("更改密码失败", "服务器错误，请联系开发人员", [
          { text: "OK", onPress: () => {} },
        ]);
      }
      setIsUpLoading(false);
    } catch (err) {
      console.error(`[account-setting.tsx] handleChangePassword(): ${err}`);
      setIsUpLoading(false);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: setting_type === "change-name" ? "名字设置" : "更改密码",
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      {setting_type === "change-name" && (
        <View style={styles.input_bar}>
          <Searchbar
            mode="bar"
            placeholder="新名字"
            onChangeText={(text) => {
              setName(text);
              setHelperText("");
              setHelperTextVisiable(false);
            }}
            onSubmitEditing={handleChangeName}
            onClearIconPress={() => {
              setName("");
            }}
            value={name}
            style={[styles.input, { backgroundColor: colors.card }]}
            icon={() => (
              <FontAwesome5 name="pen-alt" size={24} color={colors.text} />
            )}
            returnKeyType="done"
          />
          {is_uploading ? (
            <ActivityIndicator
              animating={true}
              color={colors.primary}
              style={{ paddingVertical: 15 }}
            />
          ) : (
            <Button
              mode="contained"
              buttonColor={colors.primary}
              textColor="black"
              disabled={name.length === 0 || is_uploading}
              style={[styles.create_chat_button]}
              onPress={handleChangeName}
            >
              提交
            </Button>
          )}
        </View>
      )}
      {setting_type === "change-password" && (
        <View style={styles.input_bar}>
          <Searchbar
            mode="bar"
            secureTextEntry={!password_visiable}
            placeholder="旧密码"
            onChangeText={(text) => {
              setOldPassword(text);
              setHelperText("");
              setHelperTextVisiable(false);
            }}
            onSubmitEditing={() => {}}
            onClearIconPress={() => {
              setOldPassword("");
            }}
            value={old_password}
            style={[styles.input, { backgroundColor: colors.card }]}
            icon={() => (
              <FontAwesome5 name="lock-open" size={24} color={colors.text} />
            )}
            right={() => (
              <TouchableOpacity
                onPress={() => setPasswordVisiable((prevState) => !prevState)}
                style={{ marginHorizontal: 10 }}
              >
                <FontAwesome5
                  name={password_visiable ? "eye" : "eye-slash"}
                  size={24}
                  color={password_visiable ? colors.text : colors.border}
                />
              </TouchableOpacity>
            )}
            returnKeyType="done"
          />
          <Searchbar
            mode="bar"
            secureTextEntry={!password_visiable}
            placeholder="再次输入旧密码"
            onChangeText={(text) => {
              setOldPasswordAgain(text);
              setHelperText("");
              setHelperTextVisiable(false);
            }}
            onSubmitEditing={() => {}}
            onClearIconPress={() => {
              setOldPasswordAgain("");
            }}
            value={old_password_again}
            style={[styles.input, { backgroundColor: colors.card }]}
            icon={() => (
              <FontAwesome5 name="unlock" size={24} color={colors.text} />
            )}
            right={() => (
              <TouchableOpacity
                onPress={() => setPasswordVisiable((prevState) => !prevState)}
                style={{ marginHorizontal: 10 }}
              >
                <FontAwesome5
                  name={password_visiable ? "eye" : "eye-slash"}
                  size={24}
                  color={password_visiable ? colors.text : colors.border}
                />
              </TouchableOpacity>
            )}
            returnKeyType="done"
          />
          <Searchbar
            mode="bar"
            secureTextEntry={!password_visiable}
            placeholder="新密码"
            onChangeText={(text) => {
              setNewPassowrd(text);
              setHelperText("");
              setHelperTextVisiable(false);
            }}
            onSubmitEditing={() => {}}
            onClearIconPress={() => {
              setNewPassowrd("");
            }}
            value={new_password}
            style={[styles.input, { backgroundColor: colors.card }]}
            icon={() => (
              <FontAwesome5 name="lock" size={24} color={colors.text} />
            )}
            right={() => (
              <TouchableOpacity
                onPress={() => setPasswordVisiable((prevState) => !prevState)}
                style={{ marginHorizontal: 10 }}
              >
                <FontAwesome5
                  name={password_visiable ? "eye" : "eye-slash"}
                  size={24}
                  color={password_visiable ? colors.text : colors.border}
                />
              </TouchableOpacity>
            )}
            returnKeyType="done"
          />
          <HelperText
            type="error"
            visible={helpertext_visiable}
            style={{ color: colors.notification, height: 35 }}
          >
            {helpertext}
          </HelperText>
          {is_uploading ? (
            <ActivityIndicator
              animating={true}
              color={colors.primary}
              style={{ paddingVertical: 15 }}
            />
          ) : (
            <Button
              mode="contained"
              buttonColor={colors.primary}
              textColor="black"
              disabled={
                old_password.length === 0 ||
                old_password_again.length === 0 ||
                new_password.length === 0 ||
                is_uploading
              }
              style={[styles.create_chat_button]}
              onPress={handleChangePassword}
            >
              提交
            </Button>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  input_bar: {
    width: "100%",
    height: 76,
    marginVertical: 10,
  },
  input: {
    width: "95%",
    marginVertical: 10,
    borderRadius: 10,
    margin: 10,
  },
  create_chat_button: {
    height: "70%",
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 10,
  },
});
