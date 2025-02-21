import {  useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import WelcomeScreen from './WelcomeScreen';
import OnBoardScreen from './pages/OnBoardScreen/OnBoardScreen';
import MenuLayout from './pages/Menu/MenuLayout'

const Stack = createNativeStackNavigator();

export default function RootLayout() {

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
      <Stack.Navigator initialRouteName='welcome'>
        <Stack.Screen
          name="welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="onboard"
          component={OnBoardScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="menu"
          component={MenuLayout}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
  )
}
