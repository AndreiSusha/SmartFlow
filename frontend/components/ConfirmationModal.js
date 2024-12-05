import React from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";

const ConfirmationModal = ({ visible, title, message, onConfirm, onCancel }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      // animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.removeButton} onPress={onConfirm}>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f2f2f2",
    borderRadius: 4,
    alignItems: "center",
    marginRight: 5,
  },
  cancelText: {
    color: "#555",
    fontWeight: "bold",
  },
  removeButton: {
    flex: 1,
    padding: 10,
    backgroundColor: "#e74c3c",
    borderRadius: 4,
    alignItems: "center",
    marginLeft: 5,
  },
  removeText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ConfirmationModal;
