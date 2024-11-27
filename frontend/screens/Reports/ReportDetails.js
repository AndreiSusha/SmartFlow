import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { CartesianChart, Bar } from "victory-native";
import { LinearGradient, useFont } from "@shopify/react-native-skia";
import { vec } from "react-native-redash";
import ElectricitySvg from "../../assets/svg/Electricity.svg";

const ReportDetails = () => {
  const [period, setPeriod] = useState("weekly");
  const [unit, setUnit] = useState("kWh");
  const font = useFont(require("../../assets/fonts/Urbanist-Bold.ttf"), 11);

  if (!font) {
    return (
      <View>
        <Text style={{ color: "black" }}>Loading...</Text>
      </View>
    );
  }

  const getWeekStartDate = (date) => {
    const currentDate = new Date(date);
    const dayOfWeek = currentDate.getDay();
    const difference = currentDate.getDate() - dayOfWeek;
    return new Date(currentDate.setDate(difference));
  };

  const today = new Date();
  const DATA_MONTHLY = Array.from({ length: 13 }, (_, i) => {
    const weekStartDate = new Date(today);
    weekStartDate.setDate(weekStartDate.getDate() - (12 - i) * 7);
    const weekLabel = weekStartDate.toLocaleDateString("default", {
      month: "numeric",
      day: "numeric",
    });
    return {
      weekIndex: i + 1,
      weekLabel,
      kWh: Math.random() * 70 + 30,
      cost: (Math.random() * 70 + 30) * 0.2,
    };
  });

  const DATA_WEEKLY = Array.from({ length: 7 }, (_, i) => ({
    day: i + 1,
    kWh: Math.random() * 10 + 5,
    cost: (Math.random() * 10 + 5) * 0.2,
  }));

  const DATA_YEARLY = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    kWh: Math.random() * 300 + 100,
    cost: (Math.random() * 300 + 100) * 0.2,
  }));

  let data = [];
  let xKey = "";
  let xTickCount = 0;
  let formatXLabel;

  switch (period) {
    case "weekly":
      data = DATA_WEEKLY;
      xKey = "day";
      xTickCount = 7;
      formatXLabel = (value) => {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return days[(value - 1) % 7];
      };
      break;
    case "monthly":
      data = DATA_MONTHLY;
      xKey = "weekIndex";
      xTickCount = DATA_MONTHLY.length;
      const weekLabelMap = {};
      data.forEach((item) => {
        weekLabelMap[item.weekIndex] = item.weekLabel;
      });
      formatXLabel = (value) => {
        return value % 2 === 1 ? weekLabelMap[value] : "";
      };
      break;
    case "yearly":
      data = DATA_YEARLY;
      xKey = "month";
      xTickCount = 12;
      formatXLabel = (value) => {
        const date = new Date(0, value - 1);
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

  const chartTitle =
    unit === "kWh" ? "Energy Consumption (kWh)" : "Energy Cost (€)";

  return (
    <View style={{ flex: 1, paddingTop: 30 }}>
      <View style={[styles.block, { height: 400 }]}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {/* <View >
            <ElectricitySvg width="50" height="100" />
          </View> */}
          <View style={styles.customSwitch}>
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
          {({ points, chartBounds }) => (
            <>
              <Bar
                points={points[yKey]}
                chartBounds={chartBounds}
                animate={{ type: "timing", duration: 1000 }}
                barWidth={15}
                roundedCorners={{
                  topLeft: 4,
                  topRight: 4,
                }}
              >
                <LinearGradient
                  start={vec.create(0, 0)}
                  end={vec.create(0, 400)}
                  colors={["#53B6C7"]}
                />
              </Bar>
            </>
          )}
        </CartesianChart>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, period === "weekly" && styles.activeButton]}
            onPress={() => setPeriod("weekly")}
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
            onPress={() => setPeriod("monthly")}
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
            onPress={() => setPeriod("yearly")}
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
    </View>
  );
};

const styles = StyleSheet.create({
  block: {
    marginHorizontal: 20,
    padding: 14,
    backgroundColor: "#ffffff",
    borderRadius: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  customSwitch: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#A0C287",
    borderRadius: 5,
    overflow: "hidden",
  },
  switchOption: {
    paddingVertical: 6,
    paddingHorizontal: 13,
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

export default ReportDetails;
