import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const Header = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const isLoginPage = route.name === 'Login';

    return (
        <View style={styles.headerContainer}>
            <View style={styles.logoContainer}>
                <Image source={require('../assets/nouser.jpg')} style={styles.logo} />
                <TouchableOpacity onPress={() => navigation.navigate("Home")}                >
                    <Text style={styles.title}>Contact Manager</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate(isLoginPage ? 'Register' : 'Login')}
            >
                <Text style={styles.buttonText}>{isLoginPage ? 'Register' : 'Sign In'}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    headerContainer: {
        paddingBottom: 10,
        paddingHorizontal: 24,
        backgroundColor: '#2185d0',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    title: {
        fontSize: 24,
        marginLeft: 10,
        fontWeight: 'bold',
        color: '#fff',
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 4,
        backgroundColor: "transparent",
        boxShadow: '0 0 0 2px #fff inset',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});