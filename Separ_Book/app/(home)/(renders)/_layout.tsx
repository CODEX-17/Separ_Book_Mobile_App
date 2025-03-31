import { Stack } from "expo-router";
import { View } from "lucide-react-native";
import { KeyboardState } from "react-native-reanimated";


export default function RenderLayout () {
    return (
        <View style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: false, keyboardHandlingEnabled: true }}>
                <Stack.Screen name='chapter' />
                <Stack.Screen name='view-chapter' />
                <Stack.Screen name='random' />
                <Stack.Screen name='search' />
                <Stack.Screen name='newmoon'/>
            </Stack>
        </View>
    )
}