import React, { FC, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BottomNavigationContext } from '../context/BottomNavigationContext';
import Entypo from 'react-native-vector-icons/Entypo';
import Animated, { 
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withRepeat,
} from 'react-native-reanimated';
import { Moon, Sun } from 'lucide-react-native';
import { SettingContext } from '../context/SettingContext';
import COLORS from '../constants/colors';
import { ChevronLeft, Music4  } from 'lucide-react-native';
import { Setting } from '../types/interfaces';
import { useRouter } from 'expo-router';

// Define the type for the props
interface HeaderProps {
    setModalVisible: (visible: boolean) => void;
}

const Header: FC<HeaderProps> = ({ setModalVisible }) => {

    const router = useRouter()

    const bottomNavigationContext = useContext(BottomNavigationContext)
    const settingContext = useContext(SettingContext)
    
    if (!bottomNavigationContext || !settingContext) {
        return false
    }

    const { bottomNavigation, setBottomNavigation } = bottomNavigationContext
    const { objSetting, handleChangeSetting } = settingContext

    const themeColors = objSetting.theme === 'dark' ? COLORS.dark : COLORS.light;

    const progress = useSharedValue(0)
    const rotate = useSharedValue(0)
    const position = useSharedValue(-100)

    const rotateStyleAnimation = useAnimatedStyle(() => {
        return {
            opacity: progress.value,
            transform: [{ rotate: `${rotate.value}deg` }]
        }
    },[])

    const translateXAnimation = useAnimatedStyle(() => {
        return {
            opacity: progress.value,
            transform: [{ translateX: position.value }],
        }
    })

    const rotateAnimation = () => {
        progress.value = withSpring(1, { duration: 300 })
        rotate.value = withSpring(100, { duration: 5000, stiffness: 200, })
    }

    const translateAnimation = () => {
        position.value = withSpring(1, { duration: 300 })
        position.value = withSpring(0, { duration: 3000, stiffness: 200, })
    }

    const handleTheme = () => {
        const newTheme: Setting = {...objSetting, theme: objSetting.theme === 'dark' ? 'light' : 'dark' }
        handleChangeSetting(newTheme)
    };

    useEffect(() => {
        rotateAnimation()
        translateAnimation()
    },[])

    return (
        <View style={styles.container}>
            <Animated.View style={translateXAnimation}>
                <ChevronLeft  
                    color={themeColors.secondaryText}
                    size={25}
                />
             </Animated.View>
            <Text style={[styles.text, { color: themeColors.primary }]}>{bottomNavigation}</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                    >
                            
                        <Music4 color={themeColors.secondaryText} size={25} /> :
            
                    </TouchableOpacity>
                <Animated.View style={[rotateStyleAnimation]}>
                    <TouchableOpacity
                        onPress={handleTheme}
                    >
                        {
                            objSetting.theme === 'dark' ? 
                                <Sun color={themeColors.secondaryText} size={25} /> :
                                <Moon color={themeColors.secondaryText} size={25} />
                        }
                    </TouchableOpacity>
                    
                </Animated.View>
            </View>
             
             
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 4,
        paddingLeft: 20,
        paddingRight: 20,
    },
    text:{
        fontSize: 20,
        fontFamily: 'Poppins-Bold',
        color: '#0943AF',
    }
});


export default Header;
