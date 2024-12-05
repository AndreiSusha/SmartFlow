import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import ReportCard from '../components/ReportCard';
import DonutChart from '../components/reports/charts/DonutChart';

const HomeScreen = ({ route }) => {
  const isFocused = useIsFocused();
  const [shouldAnimate, setShouldAnimate] = useState(false);

  const chartData = [
    { percentage: 55, color: 'tomato' },
    { percentage: 75, color: 'skyblue' },
    { percentage: 35, color: 'gold' },
    { percentage: 90, color: '#222' },
  ];

  // API functionality
  //   const [chartData, setChartData] = useState([]);
  //   useEffect(() => {
  //   fetchDataFromAPI().then(data => setChartData(data));
  // }, []);

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

      {/* Chart */}
      <View style={styles.chartContainer}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-evenly',
          }}
        >
          {chartData.map((item, index) => (
            <DonutChart
              key={index}
              percentage={item.percentage}
              color={item.color}
              animate={shouldAnimate}
            />
          ))}
        </View>
      </View>

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
    marginBottom: 20,
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
