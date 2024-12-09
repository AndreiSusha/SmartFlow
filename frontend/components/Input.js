import React, { useState } from "react";
import { TextInput, StyleSheet, View, Text } from "react-native";
import { Colors } from "@styles/Colors";

function Input({
  placeholder,
  label,
  keyboardType,
  secure,
  onUpdateValue,
  value,
  isInvalid,
  ...props
}) {
  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input]}
        placeholder={placeholder ? placeholder : "Don't leave this field blank"}
        autoCapitalize="none"
        keyboardType={keyboardType}
        secureTextEntry={secure}
        onChangeText={onUpdateValue}
        value={value}
        placeholderTextColor={"#8391A1"}
        autoCorrect={false}
        {...props}
      />
    </View>
  );
}

export default Input;

const styles = StyleSheet.create({
  input: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    height: 55,
    width: "100%",
    borderBottomColor: Colors.primary,
    borderBottomWidth: 1.5,
    borderRadius: 8,
    fontSize: 16,
    fontFamily: "Urbanist-Regular",
    backgroundColor: "#FFFFFF",
    marginBottom: 15
  },
  label: {
    fontSize: 16,
    fontFamily: "Urbanist-Regular",
    color: "#4A4A4A",
    marginBottom: 6,
    marginStart: 4,
  },
});
