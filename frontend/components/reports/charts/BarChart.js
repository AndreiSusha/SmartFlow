import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { CartesianChart, Bar, useChartPressState } from "victory-native";
import { useFont } from "@shopify/react-native-skia";
import * as Haptics from "expo-haptics";
import {
  useAnimatedReaction,
  useDerivedValue,
  runOnJS,
} from "react-native-reanimated";

const BarChart = ({
  weekly_data,
  monthly_data,
  yearly_data,
  period,
  setPeriod,
}) => {
  const [unit, setUnit] = useState("kWh");
  const font = useFont(require("../../../assets/fonts/Urbanist-Bold.ttf"), 11);

  const { state } = useChartPressState({
    x: 0,
    y: { [unit]: 0 },
  });

  let data = [];
  let xKey = "";
  let xTickCount = 0;
  let formatXLabel;

  switch (period) {
    case "weekly":
      data = weekly_data;
      xKey = "day";
      xTickCount = 7;
      formatXLabel = (value) => {
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        return days[(value - 1) % 7];
      };
      break;
    case "monthly":
      data = monthly_data;
      xKey = "weekIndex";
      xTickCount = data.length;
      const weekLabelMap = {};
      data.forEach((item) => {
        weekLabelMap[item.weekIndex] = item.weekLabel;
      });
      formatXLabel = (value) => {
        return value % 2 === 1 ? weekLabelMap[value] : "";
      };
      break;
    case "yearly":
      data = yearly_data;
      xKey = "month";
      xTickCount = 12;
      formatXLabel = (value) => {
        const date = new Date(0, value);
        return date.toLocaleString("default", { month: "narrow" });
      };
      break;
    default:
      break;
  }

  const yKey = unit === "kWh" ? "kWh" : "cost";

  const formatYLabel = (value) => {
    return unit === "kWh" ? `${value.toFixed(0)}kWh` : `€${value.toFixed(2)}`;
  };

  const activeXItem = useDerivedValue(() => {
    const xValue = state.x.value.value;
    const index = data.findIndex((item) => item[xKey] === Math.round(xValue));
    return index >= 0 ? index : null;
  });

  const [displayIndex, setDisplayIndex] = useState(
    data.length > 0 ? data.length - 1 : null
  );
  const [displayData, setDisplayData] = useState(
    data.length > 0 ? data[data.length - 1] : null
  );

  useAnimatedReaction(
    () => activeXItem.value,
    (current, previous) => {
      if (current !== null && current !== previous) {
        runOnJS(setDisplayIndex)(current);
        runOnJS(setDisplayData)(data[current]);
        runOnJS(Haptics.selectionAsync)();
      }
    }
  );

  useEffect(() => {
    if (data.length > 0) {
      setDisplayIndex(data.length - 1);
      setDisplayData(data[data.length - 1]);
    } else {
      setDisplayIndex(null);
      setDisplayData(null);
    }
  }, [data]);

  if (!font) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const safeDisplayIndex =
    displayIndex !== null && displayIndex >= 0 && displayIndex < data.length
      ? displayIndex
      : data.length - 1;
  const safeDisplayData = data.length > 0 ? data[safeDisplayIndex] : null;

  const getHeaderTitle = (dataItem, period, isBarSelected) => {
    if (!dataItem) {
      return "";
    }

    if (isBarSelected) {
      if (period === "weekly") {
        const days = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        const dayIndex = dataItem[xKey] - 1;
        const dayName = days[dayIndex % 7];
        return dayName;
      } else if (period === "monthly") {
        const weeksAgo = data.length - dataItem[xKey];
        if (weeksAgo === 0) return "This Week";
        else if (weeksAgo === 1) return "Previous Week";
        else return `${weeksAgo} Weeks Ago`;
      } else if (period === "yearly") {
        const date = new Date(0, dataItem[xKey]);
        return date.toLocaleString("default", { month: "long" });
      }
    } else {
      if (period === "weekly") {
        return "Today";
      } else if (period === "monthly") {
        return "This Week";
      } else if (period === "yearly") {
        const date = new Date(0, dataItem[xKey]);
        return date.toLocaleString("default", { month: "long" });
      }
    }
    return "";
  };

  return (
    <View style={[styles.block, { height: 450 }]}>
      <View style={styles.headerContainer}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>
              {getHeaderTitle(safeDisplayData, period, displayIndex !== null)}
            </Text>
            <Text style={styles.headerValue}>
              {safeDisplayData ? safeDisplayData[yKey].toFixed(2) : "0.00"}{" "}
              <Text style={styles.headerUnit}>{unit}</Text>
            </Text>
          </View>
        <View style={[styles.customSwitch, { marginTop: 15 }]}>
          <TouchableOpacity
            style={[
              styles.switchOption,
              unit === "kWh" && styles.activeSwitchOption,
            ]}
            onPress={() => setUnit("kWh")}
          >
            <Text
              style={[
                styles.switchText,
                unit === "kWh" && styles.activeSwitchText,
              ]}
            >
              kWh
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.switchOption,
              unit === "Euros" && styles.activeSwitchOption,
            ]}
            onPress={() => setUnit("Euros")}
          >
            <Text
              style={[
                styles.switchText,
                unit === "Euros" && styles.activeSwitchText,
              ]}
            >
              €
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <CartesianChart
        chartPressState={state}
        frame={{ lineWidth: 0 }}
        data={data}
        xKey={xKey}
        yKeys={[yKey]}
        padding={{ top: 30, left: 10, right: 10 }}
        domainPadding={{ left: 15, right: 15, top: 30 }}
        axisOptions={{
          font,
          tickCount: { x: xTickCount, y: 4 },
          labelColor: "#667085",
          lineColor: "#515050",
          labelOffset: 5,
          formatYLabel: formatYLabel,
        }}
        xAxis={{
          labelColor: "#667085",
          font,
          formatXLabel: formatXLabel,
          lineColor: "white",
          tickCount: xTickCount,
        }}
      >
        {({ points, chartBounds }) => {
          return points[yKey].map((point, index) => {
            const isActiveBar = displayIndex === index;

            return (
              <Bar
                key={index}
                points={[point]}
                chartBounds={chartBounds}
                animate={{ type: "timing", duration: 1000 }}
                barWidth={15}
                roundedCorners={{
                  topLeft: 4,
                  topRight: 4,
                }}
                color={isActiveBar ? "#A0C287" : "#53B6C7"}
              />
            );
          });
        }}
      </CartesianChart>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, period === "weekly" && styles.activeButton]}
          onPress={() => {
            state.x.value.value = 0;
            setPeriod("weekly");
          }}
        >
          <Text
            style={[
              styles.buttonText,
              period === "weekly" && styles.activeButtonText,
            ]}
          >
            Week
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, period === "monthly" && styles.activeButton]}
          onPress={() => {
            state.x.value.value = 0;
            setPeriod("monthly");
          }}
        >
          <Text
            style={[
              styles.buttonText,
              period === "monthly" && styles.activeButtonText,
            ]}
          >
            Last 3 months
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, period === "yearly" && styles.activeButton]}
          onPress={() => {
            state.x.value.value = 0;
            setPeriod("yearly");
          }}
        >
          <Text
            style={[
              styles.buttonText,
              period === "yearly" && styles.activeButtonText,
            ]}
          >
            Year
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  block: {
    marginHorizontal: 20,
    padding: 14,
    paddingTop: 10,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 450,
  },
  loadingText: {
    color: "black",
    fontSize: 16,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerLeft: {
    flex: 1,
    flexDirection: "row",
    gap: 5
  },
  headerTextContainer: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 6,
    paddingLeft: 10,
  },
  headerTitle: {
    fontSize: 30,
    color: "#A0C287",
    marginBottom: -6,
  },
  headerValue: {
    fontSize: 25,
  },
  headerUnit: {
    fontSize: 14,
  },
  customSwitch: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#A0C287",
    borderRadius: 5,
    overflow: "hidden",
    height: 35,
  },
  switchOption: {
    paddingVertical: 6,
    paddingHorizontal: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  activeSwitchOption: {
    backgroundColor: "#A0C287",
  },
  switchText: {
    fontSize: 14,
    color: "#000",
  },
  activeSwitchText: {
    color: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: "#53B6C7",
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
  },
  activeButtonText: {
    color: "#fff",
  },
});

export default BarChart;
