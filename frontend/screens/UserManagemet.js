import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, } 
from 'react-native';
import { useNavigation } from '@react-navigation/native';

const UserManagement = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {/* Search Container */}
      <View style={styles.searchContainer}>
        <TextInput 
          style={styles.searchInput} 
          placeholder="Search users..."
        />
      </View>

      {/* Users Container */}
      <TouchableOpacity style={styles.userContainer} onPress={() => navigation.navigate("UserDetails")}>
      
        <View style={styles.user}>
          <View style={styles.Image}>
          </View>
          <View style={styles.Info}>
            <Text style={styles.userTitle}>Kristin Watson</Text>
            <Text style={styles.userBranch}>Asia-Pacific Branch</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.userContainer} onPress={() => navigation.navigate("UserDetails")}>
      
        <View style={styles.user}>
          <View style={styles.Image}>
          </View>
          <View style={styles.Info}>
            <Text style={styles.userTitle}>Kristin Watson</Text>
            <Text style={styles.userBranch}>Asia-Pacific Branch</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  
  },
  searchContainer: {
    width: '100%',
    marginBottom: 10, 
    padding: 10,
    borderRadius: 8,
    elevation: 3, 
    shadowColor: '#000', // Shadow color (black in this case)
    shadowOffset: { width: 0, height: 2 }, // Position of the shadow
    shadowOpacity: 0.1, // Opacity of the shadow
    shadowRadius: 4, // Blurriness of the shadow

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
  },
  userContainer: {
    width: '100%',
    padding: 10,
    borderRadius: 8,
 
  },
  user: {
    flexDirection: 'row', 
    padding: 12, 
    borderWidth: 1, 
    borderColor: '#e0e0e0', 
    borderRadius: 16,
    shadowColor: '#000', // Shadow color (black in this case)
    shadowOffset: { width: 0, height: 2 }, // Position of the shadow
    shadowOpacity: 0.1, // Opacity of the shadow
    shadowRadius: 4, // Blurriness of the shadow
  },
  Image: {
    width: 80, 
    height: 80, 
    backgroundColor: '#e0e0e0', 
    borderRadius: 50, 
    marginRight: 5, 
  },
  Info: {
    flex: 1,
    padding: 10,
  },
  userTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5, 
    color: '#333', 
  },
  userBranch: {
    fontSize: 14,
    color: '#777', 
  },
});

export default UserManagement;
