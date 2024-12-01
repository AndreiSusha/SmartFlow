import { Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";

const Button = ({ children, onPress, isDisabled = false, style }) => {
  return (
    <TouchableOpacity
      style={[styles.button, style, isDisabled && styles.disabled]}
      onPress={onPress}
      disabled={isDisabled}
    >
      <Text style={styles.buttonText}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 56,
    width: "100%",
    backgroundColor: "#53B6C7",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: "Urbanist-Regular",
  },
  disabled: {
    opacity: 0.4,
  },
});

export default Button;
