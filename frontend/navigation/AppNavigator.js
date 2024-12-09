import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TabNavigator from "./TabNavigator";
import AddAssetNavigator from "./AddAssetNavigator";

const RootStack = createStackNavigator();

const AppNavigator = () => {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Main" component={TabNavigator} />
      <RootStack.Screen
        name="AddAssetNavigator"
        component={AddAssetNavigator}
      />
    </RootStack.Navigator>
  );
};

export default AppNavigator;
