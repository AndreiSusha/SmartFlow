import React, { useEffect, useState,useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg'; // Importing Svg and Path from react-native-svg
import axios from 'axios';
import { useUserContext } from '../../UserContext';
import { useFocusEffect } from '@react-navigation/native';
import BottomSheet from '@components/bottomsheets/BottomSheet';
import ConfirmationModal from '@components/ConfirmationModal';


const UserDetails = ({
  route,
  navigation,
  isModalVisible,
  setModalVisible,
}) => {
  const { userId } = route.params;
  const { userDetails, setUserDetails } = useUserContext();
  const [loading, setLoading] = useState(true);
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const { removeUser } = useUserContext();

  const API_IP = process.env.EXPO_PUBLIC_API_BASE_URL;

  // Function to fetch user details
  const fetchUserDetails = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching details for userId:", userId);
      const response = await axios.get(`${API_IP}user/${userId}`);
      console.log("API Response:", response.data);
  
      if (response.data && response.data.length > 0) {
        setUserDetails(response.data[0]);
      } else {
        console.error('No user details found for userId:', userId);
        setUserDetails(null); // Show a fallback on the current screen
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error("User not found. Staying on the current screen.");
        setUserDetails(null); // Handle gracefully instead of navigating
      } else {
        console.error('Error fetching user details:', error);
      }
    } finally {
      setLoading(false);
    }
  }, [userId, navigation]);

  // Fetch user details when the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchUserDetails();
    }, [fetchUserDetails])
  );
  
 

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!userDetails) {
    return <Text>No user details found</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <Image
          style={styles.Image}
          source={
            userDetails.image
              ? { uri: userDetails.image } // Use the user's image if available
              : require('../../../frontend/assets/images/user_icon.jpg') // Fallback to default image
          }
        />
        <View style={styles.Info}>
          <Text style={styles.name}>{userDetails.username}</Text>
          <Text style={styles.email}>{userDetails.email}</Text>
        </View>
      </View>

      {/* Location Section */}
      <View style={styles.locationContent}>
        <View style={styles.icon}>
          <Ionicons name="location-outline" size={30} color="#000" />
        </View>
        <View style={styles.detail}>
          <Text style={styles.title}>Assigned Location</Text>
          <Text style={styles.details}>{userDetails.asset_name}</Text>
        </View>
      </View>

      {/* Phone Number Section */}
      <View style={styles.phoneNumber}>
        <View style={styles.icon}>
          <Svg
            width="30"
            height="30"
            viewBox="0 0 22 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Path
              d="M16.5 1.5H7C4.79086 1.5 3 3.29086 3 5.5V17.5C3 19.7091 4.79086 21.5 7 21.5H16.5C18.7091 21.5 20.5 19.7091 20.5 17.5V5.5C20.5 3.29086 18.7091 1.5 16.5 1.5Z"
              stroke="black"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <Path
              d="M9.59 13.24C8.961 13.662 7.313 14.522 8.317 15.598C8.807 16.124 9.354 16.5 10.04 16.5H13.96C14.646 16.5 15.193 16.124 15.683 15.598C16.687 14.522 15.039 13.662 14.41 13.241C13.699 12.7582 12.8594 12.5001 12 12.5001C11.1406 12.5001 10.301 12.7582 9.59 13.241M4 5.5H1.5M4 11.5H1.5M4 17.5H1.5M14 8.5C14 9.03043 13.7893 9.53914 13.4142 9.91421C13.0391 10.2893 12.5304 10.5 12 10.5C11.4696 10.5 10.9609 10.2893 10.5858 9.91421C10.2107 9.53914 10 9.03043 10 8.5C10 7.96957 10.2107 7.46086 10.5858 7.08579C10.9609 6.71071 11.4696 6.5 12 6.5C12.5304 6.5 13.0391 6.71071 13.4142 7.08579C13.7893 7.46086 14 7.96957 14 8.5Z"
              stroke="black"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </Svg>
        </View>
        <View style={styles.detail}>
          <Text style={styles.title}>Phone Number</Text>
          <Text style={styles.details}>{userDetails.phone_number}</Text>
        </View>
      </View>

      <View style={styles.SummaryContent}>
        <View style={styles.icon}>
          <Svg
            width="28"
            height="28"
            viewBox="0 0 20 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Path
              d="M4.28585 11H11.4287M4.28585 13.8571H14.2859M4.28585 16.7143H8.57157M18.5716 18.1429V8.14286L11.4287 1H4.28585C3.52809 1 2.80137 1.30102 2.26555 1.83684C1.72973 2.37266 1.42871 3.09938 1.42871 3.85714V18.1429C1.42871 18.9006 1.72973 19.6273 2.26555 20.1632C2.80137 20.699 3.52809 21 4.28585 21H15.7144C16.4722 21 17.1989 20.699 17.7347 20.1632C18.2705 19.6273 18.5716 18.9006 18.5716 18.1429Z"
              stroke="black"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </Svg>
        </View>
        <View style={styles.detail}>
          <Text style={styles.title}>User Summary</Text>
          <Text style={styles.details}>{userDetails.user_summary}</Text>
        </View>
      </View>

      {/* Last Active Section */}
      <View style={styles.ActiveContent}>
        <View style={styles.icon}>
          <Svg
            width="28"
            height="28"
            viewBox="0 0 22 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Path
              d="M11 21.5C16.5228 21.5 21 17.0228 21 11.5C21 5.97715 16.5228 1.5 11 1.5C5.47715 1.5 1 5.97715 1 11.5C1 17.0228 5.47715 21.5 11 21.5Z"
              stroke="black"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <Path
              d="M9.88867 7.05554V12.6111H15.4442"
              stroke="black"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </Svg>
        </View>
        <View style={styles.detail}>
          <Text style={styles.title}>Last Active</Text>
          <Text style={styles.details}>{userDetails.last_active}</Text>
        </View>
      </View>
      
      

    </View>
  );
};

export default UserDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'transparent',
  },
  userInfo: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#CFCACA',
    borderRadius: 16,
    marginBottom: 20,
  },
  Image: {
    width: 80,
    height: 80,
    backgroundColor: '#e0e0e0',
    borderRadius: 40,
    marginRight: 15,
  },
  Info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  email: {
    fontSize: 16,
    color: '#AEAEAE',
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  details: {
    fontSize: 14,
    color: '#000000',
  },

  locationContent: {
    marginBottom: 20,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#CFCACA',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneNumber: {
    marginBottom: 20,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#CFCACA',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  SummaryContent: {
    marginBottom: 20,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#CFCACA',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ActiveContent: {
    marginBottom: 20,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#CFCACA',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  // Details content on the right side, adjusted for all sections with icons
  detail: {
    marginLeft: 15,
    flex: 1,
  },
});
