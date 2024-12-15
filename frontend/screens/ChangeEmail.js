import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import Input from '@components/Input';
import Button from '@components/Button';

const ChangeEmail = () => {
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [confirmNewEmail, setConfirmNewEmail] = useState('');
 

  const API_IP = process.env.EXPO_PUBLIC_API_BASE_URL;

  const handleSubmit = async () => {
    if (newEmail !== confirmNewEmail) {
      Alert.alert('Error', 'New email and confirm email do not match');
      return;
    }
        console.log('Success', 'Email updated successfully!');
       
      
  };

  return (
    <View style={styles.container}>
      <Input
        label="Current Email"
        placeholder="Current Email"
        value={currentEmail}
        editable={false} // Makes this field read-only
      />
      <Input
        label="New Email"
        placeholder="Enter new email"
        value={newEmail}
        onChangeText={setNewEmail}
        keyboardType="email-address"
      />
      <Input
        label="Confirm New Email"
        placeholder="Confirm new email"
        value={confirmNewEmail}
        onChangeText={setConfirmNewEmail}
        keyboardType="email-address"
      />
      <View style={styles.buttonContainer}>
        <Button onPress={handleSubmit}>Submit</Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default ChangeEmail;
