import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Reusable UserCard Component
const UserCard = ({ name, branch, onPress }) => {
  return (
    <TouchableOpacity style={styles.userContainer} onPress={onPress}>
      <View style={styles.user}>
        <View style={styles.Image}></View>
        <View style={styles.Info}>
          <Text style={styles.userTitle}>{name}</Text>
          <Text style={styles.userBranch}>{branch}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({

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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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

export { UserCard };