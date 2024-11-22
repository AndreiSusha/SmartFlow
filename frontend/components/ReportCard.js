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
    width: 150,
    height: 95,
    backgroundColor: '#53B6C7',
    borderRadius: 10,
    marginBottom: 14,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 4,
  },
  cardContent: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
  value: {
    fontSize: 22,
    color: '#E3E3E3',
    fontFamily: 'Urbanist-Regular',
    marginTop: 8,
  },
});

export default ReportCard;
