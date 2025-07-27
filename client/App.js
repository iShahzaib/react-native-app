import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainPageScreen from './login/MainPageScreen';
import LoginForm from './login/login-form';
import RegistrationForm from './login/registration-form';
import Layout from './layout'; // Header wrapper

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Wrap Login & Register in Layout to show Header */}
        <Stack.Screen name="Home" component={LayoutWrapper(MainPageScreen)} />
        <Stack.Screen name="Login" component={LayoutWrapper(LoginForm)} />
        <Stack.Screen name="Register" component={LayoutWrapper(RegistrationForm)} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Helper HOC to inject Header on every page
const LayoutWrapper = (ScreenComponent) => (props) => (
  <Layout>
    <ScreenComponent {...props} />
  </Layout>
);
