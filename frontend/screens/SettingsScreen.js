import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons";

export default function SettingsScreen() {

  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <Image
          source={require("../assets/Ellipse136.png")}
          style={styles.profileImage}
        />
        <View>
          <Text style={styles.profileName}>Kostas Viltrakis</Text>
          <Text style={styles.profileEmail}>kostas@info.com</Text>
        </View>
      </View>

      {/* Settings Options */}
      <View style={styles.settingsContainer}>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate("UserManagement")}>
          <View style={styles.iconContainer}>
            <Ionicons name="people-outline" size={24} color="#A0C287" />
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>User Management</Text>
            <Text style={styles.optionSubtitle}>Manage Users</Text>
          </View>
          <View style={styles.arrowContainer}>
            <MaterialIcons name="chevron-right" size={24} color="#777" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="location-on" size={24} color="#A0C287" />
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Asset Management</Text>
            <Text style={styles.optionSubtitle}>Manage Locations</Text>
          </View>
          <View style={styles.arrowContainer}>
            <MaterialIcons name="chevron-right" size={24} color="#777" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <View style={styles.iconContainer}>
            <FontAwesome5 name="lock" size={24} color="#A0C287" />
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Password</Text>
            <Text style={styles.optionSubtitle}>Change Password</Text>
          </View>
          <View style={styles.arrowContainer}>
            <MaterialIcons name="chevron-right" size={24} color="#777" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="email" size={24} color="#A0C287" />
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Email</Text>
            <Text style={styles.optionSubtitle}>Change Email</Text>
          </View>
          <View style={styles.arrowContainer}>
            <MaterialIcons name="chevron-right" size={24} color="#777" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="logout" size={20} color="#fff" />
        </View>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 20,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  profileEmail: {
    fontSize: 14,
    color: "#777",
  },
  settingsContainer: {
    marginTop: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 1,
    justifyContent: "space-between",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 30,
  },
  optionTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  arrowContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  optionSubtitle: {
    fontSize: 14,
    color: "#777",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D9534F",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});