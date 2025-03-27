import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { BottomNavigationContext } from '../context/BottomNavigationContext';
import Icon from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
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

    useEffect(() => {
        rotateAnimation()
        translateAnimation()
    },[])

    return (
        <View style={styles.container}>
            <Animated.View style={translateXAnimation}>
                <Entypo 
                    name="menu" 
                    color="#343434" 
                    size={25}
                />
             </Animated.View>
            <Text style={styles.text}>{bottomNavigation}</Text>
            <Animated.View style={[rotateStyleAnimation]}>
                <Icon 
                    name="settings" 
                    color="#343434" 
                    size={25}
                />
             </Animated.View>
             
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
        backgroundColor: '#fff',
        elevation: 4,
        paddingLeft: 10,
        paddingRight: 10,
    },
    text:{
        fontSize: 20,
        fontFamily: 'Poppins-Bold',
        color: '#0943AF',
    }
});


export default Header;
