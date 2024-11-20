import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ReportCard = ({ title, value, onPress }) => {
  // console.log('ReportCard props:', { title, value, onPress });
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardContent}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 320,
    height: 120,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4, // Shadow for Android
  },
  cardContent: {
    padding: 16,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  title: {
    fontSize: 18,
    color: '#53B6C7',
    fontFamily: 'Urbanist-Bold',
  },
  value: {
    fontSize: 22,
    color: '#333',
    fontFamily: 'Urbanist-Regular',
    marginTop: 8,
  },
});

export default ReportCard;
