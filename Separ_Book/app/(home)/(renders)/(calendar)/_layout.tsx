import { Stack } from "expo-router";
import { View } from "lucide-react-native";
import { KeyboardState } from "react-native-reanimated";


export default function CalendarLayout () {
    return (
        <View style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name='/newmoon'/>
                <Stack.Screen name='/feast'/>
            </Stack>
        </View>
    )
}