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
  unitName,
  aggrType,
}) => {
  const [unit, setUnit] = useState(unitName);

  const font = useFont(require("../../../assets/fonts/Urbanist-Bold.ttf"), 11);

  const { state } = useChartPressState({
    x: 0,
    y: { [unit]: 0 },
  });

  let data = [];
  let xKey = "";
  let xTickCount = 0;
  let formatXLabel;
  let tickValues = [];

  if (period === "last_week") {
    data = weekly_data;

    xKey = "date";
    xTickCount = data.length;
    formatXLabel = (value) => {
      const date = new Date(value);
      return date.toLocaleString("default", { weekday: "short" });
    };
    tickValues = data.map((d) => d[xKey]);
  } else if (period === "last_3_months") {
    data = monthly_data;
    xKey = "date";
    xTickCount = data.length;
    formatXLabel = (value) => {
      const date = new Date(value);
      return date.toLocaleDateString("default", {
        month: "numeric",
        day: "numeric",
      });
    };

    tickValues = data.filter((_, index) => index % 2 === 0).map((d) => d[xKey]);
  } else if (period === "past_year") {
    data = yearly_data;
    console.log("yearly_data: ", yearly_data);
    xKey = "date";
    xTickCount = data.length;
    formatXLabel = (value) => {
      const date = new Date(value);
      return date.toLocaleString("default", { month: "narrow" });
    };
    tickValues = data.map((d) => d[xKey]);
  }

  const yKey = unit === unitName ? "value" : "cost";

  const formatYLabel = (value) =>
    unit === unitName
      ? `${value.toFixed(0)}${unitName}`
      : `€${value.toFixed(2)}`;

  const activeXItem = useDerivedValue(() => {
    const xValue = state.x.value.value;
    const index = data.findIndex((item) => item[xKey] === xValue);
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

  const formatNumber = (value) => {
    if (aggrType === "average") {
      return value.toFixed(2);
    }
    return value.toFixed(0);
  };

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

  const getHeaderTitle = (dataItem, currentPeriod, isBarSelected) => {
    if (!dataItem) return "";

    if (isBarSelected) {
      if (currentPeriod === "last_week") {
        const daysFull = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        const date = new Date(dataItem[xKey]);
        return daysFull[date.getDay()];
      } else if (currentPeriod === "last_3_months") {
        const weeksAgo = data.length - safeDisplayIndex - 1;
        console.log("dataItem", dataItem);
        if (weeksAgo === 0) return "This Week";
        if (weeksAgo === 1) return "Previous Week";
        return `${weeksAgo} Weeks Ago`;
      } else if (currentPeriod === "past_year") {
        const monthsFull = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        const date = new Date(dataItem[xKey]);
        return monthsFull[date.getMonth()];
      }
    } else {
      if (currentPeriod === "last_week") {
        return "Today";
      } else if (currentPeriod === "last_3_months") {
        return "This Week";
      } else if (currentPeriod === "past_year") {
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
            {safeDisplayData ? formatNumber(safeDisplayData[yKey]) : "0.00"}{" "}
            <Text style={styles.headerUnit}>{unit}</Text>
          </Text>
        </View>
        <View style={[styles.customSwitch, { marginTop: 15 }]}>
          <TouchableOpacity
            style={[
              styles.switchOption,
              unit === unitName && styles.activeSwitchOption,
            ]}
            onPress={() => setUnit(unitName)}
          >
            <Text
              style={[
                styles.switchText,
                unit === unitName && styles.activeSwitchText,
              ]}
            >
              {unitName}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.switchOption,
              unit === "€" && styles.activeSwitchOption,
            ]}
            onPress={() => setUnit("€")}
          >
            <Text
              style={[
                styles.switchText,
                unit === "€" && styles.activeSwitchText,
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
          tickValues: tickValues,
        }}
      >
        {({ points, chartBounds }) =>
          points[yKey].map((point, index) => {
            const isActiveBar = displayIndex === index;
            return (
              <Bar
                key={index}
                points={[point]}
                chartBounds={chartBounds}
                animate={{ type: "timing", duration: 1000 }}
                barWidth={15}
                roundedCorners={{ topLeft: 4, topRight: 4 }}
                color={isActiveBar ? "#A0C287" : "#53B6C7"}
              />
            );
          })
        }
      </CartesianChart>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, period === "last_week" && styles.activeButton]}
          onPress={() => {
            state.x.value.value = 0;
            setPeriod("last_week");
          }}
        >
          <Text
            style={[
              styles.buttonText,
              period === "last_week" && styles.activeButtonText,
            ]}
          >
            Week
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            period === "last_3_months" && styles.activeButton,
          ]}
          onPress={() => {
            state.x.value.value = 0;
            setPeriod("last_3_months");
          }}
        >
          <Text
            style={[
              styles.buttonText,
              period === "last_3_months" && styles.activeButtonText,
            ]}
          >
            Last 3 months
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, period === "past_year" && styles.activeButton]}
          onPress={() => {
            state.x.value.value = 0;
            setPeriod("past_year");
          }}
        >
          <Text
            style={[
              styles.buttonText,
              period === "past_year" && styles.activeButtonText,
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
