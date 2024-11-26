import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { PolarChart, Pie } from 'victory-native';

const data = [
  { value: 200, color: '#53B6C7', label: 'Electricity' },
  { value: 1500, color: '#3D6BC1', label: 'Water' },
  { value: 80, color: '#5EB8D4', label: 'Gas' },
  { value: 300, color: '#FFDC00', label: 'Internet' },
];

const Chart = () => {
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const togglePicker = () => setIsPickerVisible(!isPickerVisible);

  return (
    <View style={styles.chartBox}>
      {/* Dropdown menu */}
      <View style={styles.dropdownBox}>
        <TouchableOpacity onPress={togglePicker}>
          <Text style={styles.dropdownButtonText}>Select Month</Text>
        </TouchableOpacity>
        {isPickerVisible && (
          <Picker
            selectedValue={selectedMonth}
            onValueChange={(itemValue) => setSelectedMonth(itemValue)}
            style={styles.picker}
          >
            {months.map((month, index) => (
              <Picker.Item key={index} label={month} value={month} />
            ))}
          </Picker>
        )}
      </View>

      {/* Chart */}
      <View style={styles.chartContainer}>
        <PolarChart
          data={data}
          labelKey="label"
          valueKey="value"
          colorKey="color"
        >
          <Pie.Chart innerRadius="80%" radius="40%" />
        </PolarChart>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartBox: {
    width: '90%',
    height: 300,
    backgroundColor: '#FFFFFF',
    borderRadius: 21.18,
    padding: 16,
    marginBottom: 36,
    alignSelf: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    position: 'relative',
  },
  dropdownBox: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    elevation: 4,
    zIndex: 1,
    width: 120,
  },
  dropdownButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#53B6C7',
  },
  picker: {
    height: 100,
    width: 120,
    color: '#53B6C7',
  },
  selectedMonth: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#000000',
    marginTop: 8,
  },
  chartContainer: {
    width: '100%',
    height: 180,
    marginTop: 40,
  },
});

export default Chart;
