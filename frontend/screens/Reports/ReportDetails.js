import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { CartesianChart, Bar } from "victory-native";
import { LinearGradient, useFont } from "@shopify/react-native-skia";
import { vec } from "react-native-redash";

const ReportDetails = () => {
  const [period, setPeriod] = useState("weekly"); // Default period
  const [unit, setUnit] = useState("kWh"); // "kWh" or "Euros"
  const font = useFont(require("../../assets/fonts/Urbanist-Bold.ttf"), 12);

  if (!font) {
    return (
      <View>
        <Text style={{ color: "black" }}>Loading...</Text>
      </View>
    );
  }

  const DATA_WEEKLY = Array.from({ length: 7 }, (_, i) => ({
    day: i + 1,
    kWh: Math.random() * 10 + 5,
    cost: (Math.random() * 10 + 5) * 0.2, 
  }));

  const DATA_MONTHLY = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    kWh: Math.random() * 300 + 100, 
    cost: (Math.random() * 300 + 100) * 0.2, 
  }));

  const DATA_YEARLY = Array.from({ length: 5 }, (_, i) => ({
    year: 2020 + i,
    kWh: Math.random() * 3000 + 1000, 
    cost: (Math.random() * 3000 + 1000) * 0.2, 
  }));

  // Select data based on the selected period
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
      xKey = "month";
      xTickCount = 12;
      formatXLabel = (value) => {
        const date = new Date(2024, value - 1);
        return date.toLocaleString("default", { month: "narrow" });
      };
      break;
    case "yearly":
      data = DATA_YEARLY;
      xKey = "year";
      xTickCount = 5;
      formatXLabel = (value) => value.toString();
      break;
    default:
      break;
  }

  // Determine yKey based on the selected unit
  const yKey = unit === "kWh" ? "kWh" : "cost";

  // Format y-axis labels
  const formatYLabel = (value) => {
    return unit === "kWh" ? `${value.toFixed(0)}kWh` : `€${value.toFixed(2)}`;
  };

  // Chart title based on the selected unit
  const chartTitle = unit === "kWh" ? "Energy Consumption (kWh)" : "Energy Cost (€)";

  return (
    <View style={{ flex: 1, paddingTop: 30 }}>
      {/* Unit Toggle Buttons */}
      <View style={styles.unitToggleContainer}>
        <TouchableOpacity
          style={[styles.unitButton, unit === "kWh" && styles.activeUnitButton]}
          onPress={() => setUnit("kWh")}
        >
          <Text style={[styles.unitButtonText, unit === "kWh" && styles.activeUnitButtonText]}>
            kWh
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.unitButton, unit === "Euros" && styles.activeUnitButton]}
          onPress={() => setUnit("Euros")}
        >
          <Text style={[styles.unitButtonText, unit === "Euros" && styles.activeUnitButtonText]}>
            Euros
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.block, { height: 400 }]}>
        {/* Chart Title */}
        <Text style={styles.chartTitle}>{chartTitle}</Text>

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
            formatXLabel,
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
        {/* Period Selection Buttons */}
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
              Year
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
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
          </TouchableOpacity> */}
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
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  unitToggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  unitButton: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
    marginHorizontal: 5,
  },
  activeUnitButton: {
    backgroundColor: "#53B6C7",
  },
  unitButtonText: {
    color: "#000",
    fontSize: 14,
  },
  activeUnitButtonText: {
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

export default ReportDetails;