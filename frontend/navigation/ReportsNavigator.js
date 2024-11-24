import { View, Text } from "react-native";
import React from "react";
import ReportsScreen from "../screens/Reports/ReportsScreen";
import ReportDetails from "../screens/Reports/ReportDetails";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const ReportsNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Reports" component={ReportsScreen} />
      <Stack.Screen name="Report" component={ReportDetails} />
    </Stack.Navigator>
  );
};

export default ReportsNavigator;
