import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const RegistrationForm = React.memo(({ registrationHandler }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [profilePicture, setProfilePicture] = useState('');

    const navigation = useNavigation();

    const showWarning = (msg) => {
        Alert.alert('Warning', msg);
    };

    const register = async () => {
        if (!username || !password || !email) {
            showWarning('All the fields are mandatory, except profile picture.');
            return;
        }

        const response = await registrationHandler({
            username,
            password,
            email: email.toLowerCase(),
            profilepicture: profilePicture,
        });

        if (response === 'success') {
            navigation.navigate('Login');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Registration</Text>

            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                style={styles.input}
                placeholder="Profile Picture (URL)"
                value={profilePicture}
                onChangeText={setProfilePicture}
            />

            <TouchableOpacity style={styles.button} onPress={register}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.link}>Already have an account? Sign In</Text>
            </TouchableOpacity>
        </View>
    );
});

export default RegistrationForm;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        marginTop: 40,
        backgroundColor: '#fff',
        flex: 1,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#2185d0',
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 6,
        marginBottom: 15,
        paddingHorizontal: 10,
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
    link: {
        marginTop: 15,
        color: '#2185d0',
        textAlign: 'center',
    },
});