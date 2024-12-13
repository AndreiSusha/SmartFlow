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
import Constants from 'expo-constants';

// const API_URL = `${Constants.expoConfig.extra.EXPO_PUBLIC_API_BASE_URL}/api/measurements/last-calendar-month`;
const API_IP = process.env.EXPO_PUBLIC_API_BASE_URL;

const HomeScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [reportCards, setReportCards] = useState([]);

  useEffect(() => {
    if (isFocused) {
      setShouldAnimate(true);
    } else {
      setShouldAnimate(false);
    }
  }, [isFocused]);

  useEffect(() => {
    if (selectedMonth) {
      fetchMeasurements(selectedMonth);
    }
  }, [selectedMonth]);

  const fetchMeasurements = async (month) => {
    try {
      const response = await fetch(
        `${API_IP}api/measurements/last-calendar-month?month=${month}`
      );
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();

      const chartFormat = [
        {
          percentage: calculatePercentage(data.temperature),
          color: '#53B6C7',
          radius: 70,
          strokeWidth: 15,
          label: 'Temperature',
        },
        {
          percentage: calculatePercentage(data.co2),
          color: '#337EFF',
          radius: 70,
          strokeWidth: 15,
          label: 'CO2',
        },
        {
          percentage: calculatePercentage(data.humidity),
          color: '#A0C287',
          radius: 70,
          strokeWidth: 15,
          label: 'Humidity',
        },
      ];

      const reportFormat = [
        {
          title: 'Temperature',
          value: `${data.temperature?.max || 0} ${
            data.temperature?.unit || ''
          }`,
        },
        {
          title: 'CO2',
          value: `${data.co2?.total || 0} ${data.co2?.unit || ''}`,
        },
        {
          title: 'Humidity',
          value: `${data.humidity?.max || 0} ${data.humidity?.unit || ''}`,
        },
        { title: 'Electricity', value: 'Data unavailable' }, // Placeholder
      ];

      setChartData(chartFormat);
      setReportCards(reportFormat);
    } catch (error) {
      console.error('Error fetching measurements:', error);
    }
  };

  const calculatePercentage = (data) => {
    if (!data || !data.max || !data.total) return 0;
    return Math.min((data.max / data.total) * 100, 100);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Consumption Overview</Text>

      <View style={styles.chartContainer}>
        <MonthDropdown
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
        />
        <View style={styles.rowContainer}>
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
            <DonutChart
              percentage={chartData[2]?.percentage || 0}
              color={chartData[2]?.color || '#ccc'}
              radius={chartData[2]?.radius || 70}
              strokeWidth={chartData[2]?.strokeWidth || 15}
              animate={shouldAnimate}
            />
          </View>

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
      </View>

      <View style={styles.subtitleRow}>
        <Text style={styles.subtitle}>Monthly reports</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Reports')}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardGrid}>
        {reportCards.map((report, index) => (
          <ReportCard
            key={index}
            title={report.title}
            value={report.value}
            onPress={() =>
              navigation.navigate('Reports', {
                screen: 'Report',
                params: { reportTitle: report.title },
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
    marginTop: 20,
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
