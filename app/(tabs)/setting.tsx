import React, { useState, useContext } from "react";
import { StyleSheet, Button } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Text, View } from "react-native";
import { AuthenticationContext } from "@/api/authentication/authentication.context";

export default function SettngScreen() {
  const { colors } = useTheme();
  const { logOut } = useContext(AuthenticationContext);
  const handleLogout = () => {
    logOut();
  };
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Setting</Text>
      <Button onPress={handleLogout} title="Logout" color="#841584" />
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
});
