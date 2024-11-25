import { View, StyleSheet, Text } from "react-native";
import React from "react";
import { Bar, CartesianChart } from "victory-native";
import { LinearGradient, useFont } from "@shopify/react-native-skia";
import { vec } from "react-native-redash";

const DATA = Array.from({ length: 6 }, (_, i) => ({
  day: i + 1, 
  highTmp: 40 + 30 * Math.random(),
}));

const ReportDetails = () => {


  const font = useFont(require('../../assets/fonts/Urbanist-Bold.ttf'), 12);


  if (!font) {
    return <View><Text style={{color: 'white'}}>Loading...</Text></View>;  
  }


  return (
    <View style={{ flex: 1, paddingTop: 30 }}>
      <View style={[styles.block, { height: 300 }]}>
        <CartesianChart
        frame={{ x: 0, y: 0, width: 200, height: 200, lineWidth: 0 }}
          data={DATA}
          xKey={"day"}
          yKeys={["highTmp"]}
          padding={5}
          //   domain={{ y: [0, 100] }}  // Y-axis scaling
          domainPadding={{ left: 50, right: 50, top: 30 }}
          axisOptions={{
            font, // Ensure the loaded font is passed in
            tickCount: { x: DATA.length, y: 4 }, // Set x tickCount to match data points
            labelColor: "#667085", // visibility
            lineColor: "#515050", // axis lines

            labelOffset: 5, // label position 

            formatYLabel: (value) => `${value}°`, // formatting for Y-axis
          }}
          xAxis={{
            labelColor: "#667085",
            font,
            formatXLabel: (value) => {
              const date = new Date(2024, value - 1);
              return date.toLocaleString("default", { month: "short" });
            },
            lineColor: "white",
            tickCount: 6,
          }}
        >
          {({ points, chartBounds }) => {
            return (
              <>
                <Bar
                  points={points.highTmp}
                  chartBounds={chartBounds}
                  animate={{ type: "timing", duration: 1000 }}
                  barWidth={20}
                  roundedCorners={{
                    topLeft: 10,
                    topRight: 10,
                  }}
                >
                  <LinearGradient
                    start={vec.create(0, 0)}
                    end={vec.create(0, 400)}
                    colors={["#53B6C7"]}
                  />
                </Bar>
              </>
            );
          }}
        </CartesianChart>
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
    gap: 20,
  },
});

export default ReportDetails;
