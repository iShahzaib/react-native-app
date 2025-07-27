import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginForm = ({ loginHandler }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    const checkUser = async () => {
      const user = await AsyncStorage.getItem('loggedInUser');
      if (user) {
        const { username } = JSON.parse(user);
        navigation.replace("Welcome", { username });
      }
    };
    checkUser();
  }, []);

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert("Warning", "Username and Password are required.");
      return;
    }

    loginHandler({
      email: username.toLowerCase(),
      password,
      navigate: navigation,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>

      <Text style={styles.label}>User Name</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />

      {/* <Button title="Sign In" onPress={handleLogin} /> */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Register")}
        style={styles.registerLink}
      >
        <Text>
          Don’t have an account? <Text style={styles.linkText}>Register</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginForm;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 60,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
    alignSelf: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#999",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#2185d0',
    paddingVertical: 12,
    borderRadius: 6,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerLink: {
    marginTop: 15,
    alignItems: "center",
  },
  linkText: {
    color: "blue",
    fontWeight: "bold",
  },
});