// import React, { useState, useEffect } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   ScrollView,
// } from 'react-native';
// import { useIsFocused } from '@react-navigation/native';
// import MonthDropdown from '../components/MonthDropdown';
// import ReportCard from '../components/ReportCard';
// import DonutChart from '../components/reports/charts/DonutChart';

// const HomeScreen = ({ navigation }) => {
//   const isFocused = useIsFocused();
//   const [shouldAnimate, setShouldAnimate] = useState(false);
//   const [selectedMonth, setSelectedMonth] = useState(null);

//   const chartData = [
//     { percentage: 55, color: 'tomato', radius: 70, strokeWidth: 25 },
//     { percentage: 75, color: 'skyblue' },
//     { percentage: 35, color: 'gold' },
//     { percentage: 90, color: '#222' },
//   ];

//   // API functionality
//   //   const [chartData, setChartData] = useState([]);
//   //   useEffect(() => {
//   //   fetchDataFromAPI().then(data => setChartData(data));
//   // }, []);

//   useEffect(() => {
//     if (isFocused) {
//       setShouldAnimate(true);
//     } else {
//       setShouldAnimate(false);
//     }
//   }, [isFocused]);

//   const reportCards = [
//     { title: 'Electricity', value: '200 kWh' },
//     { title: 'Water', value: '1500 L' },
//     { title: 'Gas', value: '80 m³' },
//     { title: 'Internet', value: '300 GB' },
//   ];

//   return (
//     <ScrollView style={styles.container}>
//       {/* Title */}
//       <Text style={styles.title}>Consumption Overview</Text>

//       {/* Donut Chart */}
//       <View style={styles.chartContainer}>
//         {/* Month Dropdown */}
//         <MonthDropdown
//           selectedMonth={selectedMonth}
//           setSelectedMonth={setSelectedMonth}
//         />
//         <View style={styles.donutChartContainer}>
//           {chartData.map((item, index) => (
//             <DonutChart
//               key={index}
//               percentage={item.percentage}
//               color={item.color}
//               radius={item.radius}
//               strokeWidth={item.strokeWidth}
//               animate={shouldAnimate}
//             />
//           ))}
//         </View>
//       </View>

//       {/* Reports */}
//       <View style={styles.subtitleRow}>
//         <Text style={styles.subtitle}>Monthly reports</Text>
//         <TouchableOpacity onPress={() => navigation.navigate('Reports')}>
//           <Text style={styles.viewAll}>View All</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Report Cards */}
//       <View style={styles.cardGrid}>
//         {reportCards.map((report, index) => (
//           <ReportCard
//             key={index}
//             title={report.title}
//             value={report.value}
//             onPress={() =>
//               navigation.navigate('Reports', {
//                 screen: 'Report',
//                 params: { reportTitle: report.title },
//               })
//             }
//           />
//         ))}
//       </View>
//     </ScrollView>
//   );
// };

// export default HomeScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     marginTop: 20,
//   },
//   title: {
//     fontSize: 22,
//     fontFamily: 'Inter-SemiBold',
//     color: '#000000',
//     marginBottom: 12,
//   },
//   chartContainer: {
//     width: '90%',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 21.18,
//     padding: 16,
//     marginBottom: 36,
//     alignSelf: 'center',
//     elevation: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     position: 'relative',
//   },
//   donutChartContainer: {
//     flexDirection: 'column',
//     alignItems: 'flex-start',
//   },
//   subtitleRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   subtitle: {
//     fontSize: 15,
//     fontFamily: 'Inter-SemiBold',
//     color: '#000000',
//   },
//   viewAll: {
//     fontSize: 15,
//     fontFamily: 'Inter-Medium',
//     color: '#A0C287',
//   },
//   cardGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     padding: 7,
//   },
// });

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

  const [chartData, setChartData] = useState([
    {
      percentage: 55,
      color: '#53B6C7',
      radius: 60,
      strokeWidth: 15,
      label: 'Electricity',
    },
    {
      percentage: 75,
      color: '#A395E0',
      radius: 60,
      strokeWidth: 15,
      label: 'Water',
    },
    {
      percentage: 35,
      color: '#A0C287',
      radius: 60,
      strokeWidth: 15,
      label: 'Waste Disposal',
    },
  ]);

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

  const reportCards = [
    { title: 'Electricity', value: '200 kWh' },
    { title: 'Water', value: '1500 L' },
    { title: 'Waste', value: '80 kg' },
    { title: 'Internet', value: '300 GB' },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Consumption Overview</Text>

      {/* Donut Chart */}
      <View style={styles.chartContainer}>
        {/* Month Dropdown */}
        <MonthDropdown
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
        />
        <View style={styles.rowContainer}>
          {/* Donut Charts */}
          <View style={styles.donutChartContainer}>
            {chartData.map((item, index) => (
              <View key={index}>
                <DonutChart
                  key={index}
                  percentage={item.percentage}
                  color={item.color}
                  radius={item.radius}
                  strokeWidth={item.strokeWidth}
                  animate={shouldAnimate}
                />
              </View>
            ))}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  donutChartContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  legendContainer: {
    alignSelf: 'flex-end',
    marginTop: 'auto',
    marginRight: 16,
    justifyContent: 'flex-start',
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
