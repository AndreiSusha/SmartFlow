// EditUser.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import axios from 'axios';
import { useUserContext } from '../../UserContext';
import Input from '@components/Input';
import Button from '@components/Button';

const EditUser = ({ route, navigation }) => {
  const { userDetails, setUserDetails } = useUserContext(); 
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [location, setLocation] = useState(null);
  const [summary, setSummary] = useState(null);
  const [phone, setPhone] = useState(null);

  useEffect(() => {
    if(!userDetails) return; 
    setUserId(userDetails.id);
    setUsername(userDetails.username);
    setEmail(userDetails.email);
    setLocation(userDetails.asset_name);
    setSummary(userDetails.userSummary);
    setPhone(userDetails.phoneNumber);
    setUserDetails(null);
  },[userDetails])
  
  // const handleSave = async () => { 
  //   try {
  //     const response = await axios.put(`http://192.168.0.103:3000/user/${userId}`, {
  //       username,
  //       email,
  //       asset_name: location,
  //       // summary,
  //       // phone
  //     });

  //     if (response.status === 200) {
  //       Alert.alert('Success', 'User updated successfully');
  //       navigation.goBack(); // Go back to UserDetails after update
  //     }
  //   } catch (error) {
  //     console.error('Error updating user:', error);
  //     Alert.alert('Error', 'Failed to update user');
  //   }
  // };

  const handleSave = async () => { 
    try {
      const response = await axios.put(`http://192.168.0.103:3000/user/${userId}`, {
        username,
        email,
        asset_name: location,
        // summary,
        // phone
      });
  
      console.log('Response:', response);  // Log the response object
  
      if (response.status === 200) {
        Alert.alert('Success', 'User updated successfully');
        // navigation.goBack(); // Go back to UserDetails after update
        navigation.navigate('UserDetails')
      } else {
        console.log(`Unexpected response status: ${response.status}`); // Log unexpected statuses
      }
    } catch (error) {
      console.error('Error updating user:', error);
      Alert.alert('Error', 'Failed to update user');
    }
  };
  

  return (
    <View style={styles.container}>

      <Input
        label="User Name"
        placeholder="User name"
        value={username}
        onUpdateValue={setUsername}
      />
      <Input
        label="Email"
        placeholder="Enter your email"
        value={email}
        onUpdateValue={setEmail}
      />
      <Input
        label="Assigned Location"
        placeholder="Assigned location"
        value={location}
        onUpdateValue={setLocation}
      />
      <Input
        label="Phone Number"
        placeholder="Phone number"
        value={phone}
        onUpdateValue={setPhone}
      />
      <Input
        label="User Summary"
        placeholder="User summary"
        value={summary}
        onUpdateValue={setSummary}
      />

      {/* <Text style={styles.label}>Assigned Location</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
      /> */}

      {/* <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      /> */}

      {/* <Text style={styles.label}>User Summary</Text>
      <TextInput
        style={styles.input}
        value={summary}
        onChangeText={setSummary}
      /> */}

      <View style={styles.buttonContainer}>
        {/* <Button title="Save" onPress={handleSave} /> */}
        <Button onPress={handleSave} > Save</Button>
      </View>
    </View>
  );
};

export default EditUser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingLeft: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
});
