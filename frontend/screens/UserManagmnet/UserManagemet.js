import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';
import { UserCard } from '../../components/userManagmnet/UserCard';
import { useNavigation } from '@react-navigation/native';

const UserManagement = () => {
  const [users, setUsers] = useState([]); // State for users
  const [loading, setLoading] = useState(true); // State for loading
  const [search, setSearch] = useState(''); // State for search
  const navigation = useNavigation();

  const API_IP = process.env.EXPO_PUBLIC_API_BASE_URL;
  useEffect(() => {
    const fetchUsers = async () => {
      try {

        // const response = await axios.get(`${API_IP}/users/3`);
        const response = await axios.get('http://192.168.0.103:3000/users/3');

        // Filter users with role_id 2
        const filteredUsers = response.data.filter(user => user.role_id === 2);

        setUsers(filteredUsers); // Update state with filtered users
      } catch (error) {
        console.error('Error fetching users:', error); // Log any errors
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchUsers();
  }, []);

  // Filter users for search (by username)
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Search Container */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Display Users */}
      {/* {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : filteredUsers.length > 0 ? (
        filteredUsers.map((user) => (
          <UserCard
            key={user.id}
            name={user.username}
            branch={user.asset_name}
            onPress={() => navigation.navigate('UserDetails', { userId: user.id })}
          />
        ))
      ) : (
        <Text>No users found</Text>
      )} */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView contentContainerStyle={styles.userList}>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <UserCard
                key={user.id}
                name={user.username}
                branch={user.asset_name}
                onPress={() => navigation.navigate('UserDetails', { userId: user.id })}
              />
            ))
          ) : (
            <Text>No users found</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'transparent',
  },
  searchContainer: {
    width: '100%',
    marginBottom: 10,
    padding: 10,
    backgroundColor: 'transparent', 
  },
  searchInput: {
    width: '100%',
    padding: 10,
    borderRadius: 16,
    backgroundColor: '#fff',
    marginBottom: 10,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default UserManagement;
