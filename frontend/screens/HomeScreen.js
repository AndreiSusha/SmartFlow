import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ReportCard from '../components/ReportCard';
import Chart from '../components/Chart';

const HomeScreen = ({ route }) => {
  const { role } = route.params || { role: 'user' };
  const [selectedOption, setSelectedOption] = useState('Option 1');

  return (
    <ScrollView style={styles.container}>
      {/* Drop down menu */}
      {/* {role === 'admin' && (
        <View style={styles.dropdownBox}>
          <Picker
            selectedValue={selectedOption}
            onValueChange={(itemValue) => setSelectedOption(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Option 1" value="Option 1" />
            <Picker.Item label="Option 2" value="Option 2" />
            <Picker.Item label="Option 3" value="Option 3" />
          </Picker>
        </View>
      )} */}

      {/* Title */}
      <Text style={styles.title}>Consumption Overview</Text>

      {/* Chart */}
      <Chart />

      {/* Reports */}
      <View style={styles.subtitleRow}>
        <Text style={styles.subtitle}>Monthly reports</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Report Cards */}
      <View style={styles.cardGrid}>
        <ReportCard title="Electricity" value="200 kWh" />
        <ReportCard title="Water" value="1500 L" />
        <ReportCard title="Gas" value="80 m³" />
        <ReportCard title="Internet" value="300 GB" />
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3E3E3',
    padding: 16,
  },
  dropdownBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    elevation: 4,
  },
  picker: {
    height: 50,
    color: '#53B6C7',
  },
  title: {
    fontSize: 22,
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
    marginBottom: 12,
  },
  subtitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
  },
  viewAll: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: '#A0C287',
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 7,
  },
});
