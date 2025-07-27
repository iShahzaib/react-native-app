import { View, StyleSheet } from 'react-native';
import Header from './login/header';
import { SafeAreaView } from 'react-native-safe-area-context';

const Layout = ({ children }) => {
    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.container}>
                <Header />
                <View style={styles.content}>
                    {children}
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Layout;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#2185d0', // match your background
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        margin: 16,
    },
});