import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import React, { useEffect } from "react";
import { useToastStore } from "../stores/toastStore";
import { StyleSheet, Text, View } from "react-native";

const ToastNotification = () => {
  const { title, message, type, show, hideToast, time } = useToastStore();

  useEffect(() => {
    if (show) {
      const timeout = setTimeout(() => {
        hideToast();
      }, time);

      return () => clearTimeout(timeout);
    }
  }, [show, hideToast]);

  if (!show) return null;

  const colors = {
    success: {
      border: "#4CAF50", 
      background: "#EDF7ED", 
      text: "#1E4620", 
    },
    error: {
      border: "#F44336", 
      background: "#FDECEA", 
      text: "#5A1F1F", 
    },
    info: {
      border: "#53B6C7",
      background: "#E5F6F9", 
      text: "#0F4C5C", 
    },
    warning: {
      border: "#FFC107", 
      background: "#FFF8E1", 
      text: "#5D3D00", 
    },
  };

  const currentColors = colors[type] || colors.info;

  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOutUp}
      style={[
        styles.container,
        {
          borderLeftColor: currentColors.border,
          backgroundColor: currentColors.background,
        },
      ]}
    >
      <View>
        <Text style={[styles.title, { color: currentColors.text }]}>{title}</Text>
        <Text style={[styles.message, { color: currentColors.text }]}>
          {message}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    top: 70,
    width: "90%",
    position: "absolute",
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    alignSelf: "center",
    borderLeftWidth: 5,
    zIndex: 100,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  message: {
    fontWeight: "500",
    fontSize: 14,
    marginTop: 4,
  },
});

export default ToastNotification;
