import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons

const BottomSheet = ({ visible, onClose, options, onSelect }) => {
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      // Slide up animation
      Animated.timing(animation, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      // Slide down animation
      Animated.timing(animation, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const screenHeight = Dimensions.get('window').height;

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [screenHeight, 0],
  });

  if (!visible) {
    return null;
  }

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <Animated.View style={[styles.sheetContainer, { transform: [{ translateY }] }]}>
              {options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.optionButton}
                  onPress={() => {
                    onSelect(option);
                    onClose();
                  }}
                >
                  {option.icon && (
                    <Ionicons
                      name={option.icon}
                      size={24}
                      color="#333"
                      style={styles.optionIcon}
                    />
                  )}
                  <Text style={styles.optionText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    minHeight: 100,
  },
  optionButton: {
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 15,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  optionIcon: {
    marginRight: 15, 
  },
  optionText: {
    fontSize: 18,
    color: '#333',
  },
});

export default BottomSheet;
