import React from "react";
import ReportsScreen from "../screens/Reports/ReportsScreen";
import ReportDetails from "../screens/Reports/ReportDetails";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const ReportsNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerBackTitle: ""}}>
      <Stack.Screen name="ReportsOverview" component={ReportsScreen}/>
      <Stack.Screen name="Report" component={ReportDetails} />
    </Stack.Navigator>
  );
};

export default ReportsNavigator;
