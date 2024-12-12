import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const months = [
  { label: 'January', value: 1 },
  { label: 'February', value: 2 },
  { label: 'March', value: 3 },
  { label: 'April', value: 4 },
  { label: 'May', value: 5 },
  { label: 'June', value: 6 },
  { label: 'July', value: 7 },
  { label: 'August', value: 8 },
  { label: 'September', value: 9 },
  { label: 'October', value: 10 },
  { label: 'November', value: 11 },
  { label: 'December', value: 12 },
];

const MonthDropdown = ({ selectedMonth, setSelectedMonth }) => {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View style={styles.dropdownBox}>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        itemTextStyle={styles.itemTextStyle}
        iconStyle={styles.iconStyle}
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
  );
};

const styles = StyleSheet.create({
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
    fontFamily: 'Roboto-Regular',
  },
  itemTextStyle: {
    fontSize: 13,
    color: '#A0C287',
    fontFamily: 'Roboto-Regular',
  },
  iconStyle: {
    tintColor: '#A0C287',
  },
});

export default MonthDropdown;
