import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

const ReportCard = ({ title, value, onPress }) => {
  // Split the value into number and unit
  const [number, unit] = value.split(' ');

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardContent}>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>
            <Text style={styles.valueNumber}>{number}</Text>
            <Text style={styles.valueUnit}> {unit}</Text>
          </Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <Icon
            name="chevron-with-circle-right"
            size={30}
            color="#FFFFFF"
            style={styles.icon}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: 100,
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
    flex: 1,
  },
  valueContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    maxWidth: '100%',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    color: '#E3E3E3',
    fontFamily: 'Inter-SemiBold',
  },
  value: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
  },
  valueNumber: {
    fontSize: 22,
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
  valueUnit: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
  icon: {
    marginRight: -4,
  },
});

export default ReportCard;
