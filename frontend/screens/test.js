import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';

const Test = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from the backend
    axios
      .get('http://192.168.0.103:3000/notes') // Replace with your backend's IP or domain
      .then((response) => {
        setNotes(response.data); // Update state with fetched notes
        setLoading(false); // Stop the loader
      })
      .catch((error) => {
        console.error('Error fetching notes:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notes</Text>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.note}>
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.contents}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  note: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  title: { fontSize: 18, fontWeight: 'bold' },
});

export default Test;
