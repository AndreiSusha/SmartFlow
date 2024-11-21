import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import ReportsScreen from '../screens/ReportsScreen';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import Test from '../screens/test';

const Tab = createBottomTabNavigator();

const MyTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Reports') {
          iconName = focused ? 'clipboard' : 'clipboard-outline';
        } else if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Settings') {
          iconName = focused ? 'settings' : 'settings-outline';
        }
        // else if (route.name === 'Test') {
        //   iconName = focused ? 'Test' : 'settings-outline';
        // }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#53B6C7',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    })}
  >
    <Tab.Screen name="Reports" component={ReportsScreen} />
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      initialParams={{ role: 'admin' }}
    />
    <Tab.Screen name="Settings" component={SettingsScreen} />

    {/* <Tab.Screen name="Test" component={Test} /> */}
  </Tab.Navigator>
);

export default MyTabs;
