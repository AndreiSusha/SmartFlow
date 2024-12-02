import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { PolarChart, Pie } from 'victory-native';

const data = [
  { value: 200, color: '#53B6C7', label: 'Electricity' },
  { value: 1500, color: '#3D6BC1', label: 'Water' },
  { value: 80, color: '#5EB8D4', label: 'Gas' },
  { value: 300, color: '#FFDC00', label: 'Internet' },
];

const Chart = () => {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const months = [
    { label: 'January', value: 'January' },
    { label: 'February', value: 'February' },
    { label: 'March', value: 'March' },
    { label: 'April', value: 'April' },
    { label: 'May', value: 'May' },
    { label: 'June', value: 'June' },
    { label: 'July', value: 'July' },
    { label: 'August', value: 'August' },
    { label: 'September', value: 'September' },
    { label: 'October', value: 'October' },
    { label: 'November', value: 'November' },
    { label: 'December', value: 'December' },
  ];

  return (
    <View style={styles.chartBox}>
      {/* Dropdown menu */}
      <View style={styles.dropdownBox}>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={[
            styles.placeholderStyle,
            { fontFamily: 'Roboto-Regular' },
          ]}
          selectedTextStyle={[
            styles.selectedTextStyle,
            { fontFamily: 'Roboto-Regular' },
          ]}
          itemTextStyle={{
            fontSize: 13,
            color: '#A0C287',
            fontFamily: 'Roboto-Regular',
          }}
          iconStyle={{ tintColor: '#A0C287' }}
          data={months}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Month' : '...'}
          value={selectedMonth}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => {
            setSelectedMonth(item.value);
            setIsFocus(false);
          }}
        />
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
    paddingHorizontal: 8,
    elevation: 4,
    zIndex: 1,
    width: 120,
  },
  dropdown: {
    height: 30,
    borderWidth: 1,
    borderRadius: 16,
    borderColor: '#A0C287',
    paddingHorizontal: 12,
  },
  placeholderStyle: {
    fontSize: 13,
    color: '#A0C287',
    fontFamily: 'Roboto-Regular',
  },
  selectedTextStyle: {
    fontSize: 13,
    color: '#A0C287',
  },
  chartContainer: {
    width: '100%',
    height: 180,
    marginTop: 40,
  },
});

export default Chart;
