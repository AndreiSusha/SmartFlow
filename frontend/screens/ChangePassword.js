import React, { useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import Input from '@components/Input';
import Button from '@components/Button';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState(''); // Example current email
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleSubmit = () => {
    if (newPassword !== confirmNewPassword) {
      Alert.alert('Error', 'New Password and confirm Password do not match');
      return;
    }
    // Here, you can handle the email update logic
    console.log('Success', 'Password updated successfully!');
  };

  return (
    <View style={styles.container}>
      
      <Input
        label="Current Password"
        placeholder="Current password"
        value={currentPassword}
        editable={false} // Makes this field read-only
      />
      <Input
        label="New Password"
        placeholder="Enter new password"
        value={newPassword}
        onChangeText={setNewPassword}
        keyboardType="email-address"
      />
      
      <Input
        label="Confirm New Password"
        placeholder="Confirm new password"
        value={confirmNewPassword}
        onChangeText={setConfirmNewPassword}
        keyboardType="email-address"
      />
      

      <View style={styles.buttonContainer}>
        <Button onPress={handleSubmit} > Submit </Button>
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

export default ChangePassword;
