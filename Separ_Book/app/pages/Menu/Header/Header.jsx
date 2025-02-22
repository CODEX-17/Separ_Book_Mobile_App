import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { BottomNavigationContext } from '../../../context/BottomNavigationContext';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, { 
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withRepeat,
} from 'react-native-reanimated';



const Header = () => {

    const { bottomNavigation, setBottomNavigation } = useContext(BottomNavigationContext)

    const progress = useSharedValue(0)
    const rotate = useSharedValue(0)

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: progress.value,
            transform: [{ rotate: `${rotate.value}deg` }]
        }
    },[])

    const handleAnimate = () => {
        progress.value = withSpring(1)
        rotate.value = withRepeat(withSpring(rotate.value + 20,{ duration: 500 }), -1)
    }
 
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{bottomNavigation}</Text>
            <Animated.View style={animatedStyle}>
                <Icon 
                    name="settings" 
                    color="#343434" 
                    size={25}
                />
             </Animated.View>
             <Pressable
                onPressIn={handleAnimate} onPressOut={handleAnimate}
             >
                 <Text>rotate</Text>
             </Pressable>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text:{
        fontSize: 30,
        fontFamily: 'Poppins_700Bold',
        color: '#0943AF'
    }
});


export default Header;
