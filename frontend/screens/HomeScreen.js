import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import MonthDropdown from '../components/MonthDropdown';
import ReportCard from '../components/ReportCard';
import DonutChart from '../components/reports/charts/DonutChart';

const HomeScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [chartData, setChartData] = useState([]);

  // Fetch data from API
  const fetchDataFromAPI = async (month) => {
    try {
      console.log('Selected month:', month);
      const API_IP = process.env.EXPO_PUBLIC_API_BASE_URL;
      const response = await fetch(
        `${API_IP}/measurements/last-calendar-month?month=${month}` // Исправлено: добавлен "="
      );
      console.log(
        'Fetching URL:',
        `${API_IP}/measurements/last-calendar-month?month=${month}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Format data for Donut Charts
      const formattedData = [
        {
          percentage: data.temperature[0]?.total_value || 0,
          color: '#53B6C7',
          radius: 70,
          strokeWidth: 15,
          label: 'Temperature',
        },
        {
          percentage: data.co2[0]?.total_value || 0,
          color: '#337EFF',
          radius: 70,
          strokeWidth: 15,
          label: 'CO2',
        },
        {
          percentage: data.vdd[0]?.total_value || 0,
          color: '#A0C287',
          radius: 70,
          strokeWidth: 15,
          label: 'VDD',
        },
        {
          percentage: data.humidity[0]?.total_value || 0,
          color: '#FF6F61',
          radius: 70,
          strokeWidth: 15,
          label: 'Humidity',
        },
      ];

      setChartData(formattedData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  // Fetch data from API when selectedMonth changes
  useEffect(() => {
    if (selectedMonth) {
      fetchDataFromAPI(selectedMonth);
    }
  }, [selectedMonth]);

  // Animate Donut Charts when screen is focused
  useEffect(() => {
    if (isFocused) {
      setShouldAnimate(true);
    } else {
      setShouldAnimate(false);
    }
  }, [isFocused]);

  return (
    <ScrollView style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Consumption Overview</Text>

      {/* Donut Chart */}
      <View style={styles.chartContainer}>
        {/* Month Dropdown */}
        <MonthDropdown
          selectedMonth={selectedMonth}
          setSelectedMonth={(month) => {
            console.log('Month selected from dropdown:', month);
            setSelectedMonth;
          }}
        />
        <View style={styles.rowContainer}>
          {/* Donut Charts */}
          <View>
            {chartData.slice(0, 2).map((item, index) => (
              <DonutChart
                key={index}
                percentage={item.percentage}
                color={item.color}
                radius={item.radius}
                strokeWidth={item.strokeWidth}
                animate={shouldAnimate}
              />
            ))}
          </View>
          <View style={styles.chartCorner}>
            {chartData.slice(2).map((item, index) => (
              <DonutChart
                key={index}
                percentage={item.percentage}
                color={item.color}
                radius={item.radius}
                strokeWidth={item.strokeWidth}
                animate={shouldAnimate}
              />
            ))}
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legendContainer}>
          {chartData.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View
                style={[styles.colorBox, { backgroundColor: item.color }]}
              />
              <Text style={styles.legendText}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Reports */}
      <View style={styles.subtitleRow}>
        <Text style={styles.subtitle}>Monthly reports</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Reports')}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Report Cards */}
      <View style={styles.cardGrid}>
        {chartData.map((report, index) => (
          <ReportCard
            key={index}
            title={report.label}
            value={`${report.percentage} units`}
            onPress={() =>
              navigation.navigate('Reports', {
                screen: 'Report',
                params: { reportTitle: report.label },
              })
            }
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 60,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
    marginBottom: 12,
  },
  chartContainer: {
    width: '90%',
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
  rowContainer: {
    marginTop: 34,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  chartCorner: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'relative',
  },
  legendContainer: {
    position: 'absolute',
    bottom: 16,
    right: -6,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  colorBox: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#000000',
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
