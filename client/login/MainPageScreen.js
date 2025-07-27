import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from './header';

const MainPageScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.heading}>Welcome to Contact Manager</Text>
        <Text style={styles.subheading}>Manage Everything | Your Smart Business Hub.</Text>

        <TouchableOpacity style={styles.ctaButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.ctaText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MainPageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: "#2575fc",
  },
  heading: {
    fontSize: 54,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#fff',
    textAlign: 'center',
  },
  subheading: {
    fontSize: 22,
    color: '#444',
    textAlign: 'center',
    color: '#fff',
  },
  ctaButton: {
    marginTop: 40,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 4,
    backgroundColor: "transparent",
    boxShadow: '0 0 0 2px #fff inset',
  },
  ctaText: {
    fontSize: 24,
    color: '#fff',
  },
});