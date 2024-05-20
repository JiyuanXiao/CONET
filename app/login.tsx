import React, { useState, useContext } from "react";
import { StyleSheet, Button, TextInput } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Text, View } from "react-native";
import { AuthenticationContext } from "@/api/authentication/authentication.context";

export default function LoginScreen() {
  const { colors } = useTheme();
  const [id, setId] = useState("");
  const [passwrod, setPasswrod] = useState("");
  const { logIn } = useContext(AuthenticationContext);

  const handleOnPress = () => {
    if (id.length > 0 && passwrod.length > 0) {
      logIn(id, passwrod);
      setId("");
      setPasswrod("");
    }
  };
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Login</Text>
      <TextInput
        style={styles.input}
        onChangeText={setId}
        value={id}
        placeholder="ID"
      />
      <TextInput
        style={styles.input}
        onChangeText={setPasswrod}
        value={passwrod}
        placeholder="password"
      />
      <Button onPress={handleOnPress} title="Login" color="#841584" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
