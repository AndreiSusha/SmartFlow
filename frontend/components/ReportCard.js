import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

const ReportCard = ({ title, value, onPress }) => {
  // Split the value into number and unit
  const [number, unit] = value.split(' ');

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardContent}>
        <Text style={styles.value}>
          <Text style={styles.valueNumber}>{number}</Text>
          <Text style={styles.valueUnit}> {unit}</Text>
        </Text>
        <Text style={styles.title}>{title}</Text>
        <Icon
          name="chevron-with-circle-right"
          size={34}
          color="#FFFFFF"
          style={styles.icon}
        />
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
    padding: 12,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    marginTop: 8,
  },
  value: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  valueNumber: {
    fontSize: 22,
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
  valueUnit: {
    fontSize: 10,
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
  icon: {
    position: 'absolute',
    right: 8,
    bottom: 3,
  },
});

export default ReportCard;
