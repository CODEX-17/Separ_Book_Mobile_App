import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from './header';
import { BottomNavigationContext } from '../context/BottomNavigationContext';
import ChapterScreen from './(renders)/chapter';
import Navigation from './navigation';
import RandomPick from './(renders)/random';
import Search from './(renders)/search';
import { SettingContext } from '../context/SettingContext';
import COLORS from '../constants/colors';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSpring, withTiming} from 'react-native-reanimated';
import Calendar from './(renders)/(calendar)/newmoon';

const HomeLayout = () => {

    const { bottomNavigation } = useContext(BottomNavigationContext)
    const { objSetting } = useContext(SettingContext)

    const renderTab = () => {
        switch (bottomNavigation) {
            case 'Home':
                return <ChapterScreen/>
            case 'Chapters':
                return <ChapterScreen/>
            case 'Search':
                return <Search/>
            case 'Calendar':
                return <Calendar/>
            case 'Random':
                return <RandomPick/>
            case 'Default':
                return <ChapterScreen/>;
            default:
                return <Text>No tab selected</Text>; // Fallback UI
        }
    }

    const themeColors = objSetting.theme === 'dark' ? COLORS.dark : COLORS.light;

    const fadeAnim = useSharedValue(0);

    // Animated style for background fade effect
    const backgroundAnimation = useAnimatedStyle(() => ({
        opacity: fadeAnim.value,
        backgroundColor: themeColors.background,
    }));

    useEffect(() => {
        fadeAnim.value = 0
        fadeAnim.value = withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) });
    },[objSetting.theme])

    return (
        <Animated.View style={[styles.container, backgroundAnimation]}>
            <SafeAreaView style={[styles.safeArea, { flex: 1 }]}>
                <View style={styles.header}>
                    <Header/>
                </View>
                <View style={styles.content}>
                    {renderTab()}
                </View>
                <View style={styles.bottonNavigation}>
                    <Navigation/>
                </View>
            </SafeAreaView>
        </Animated.View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    safeArea: {
        height: '100%',
        width: '100%',
        backgroundColor: 'transparent',
    },
    header: {
        height: '10%',
        width: '100%',
        backgroundColor: 'transparent',
    },
    content: {
        width: '100%',
        height: '80%',
    },
    bottonNavigation: {
        flex: 1,
        elevation: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    }
});


export default HomeLayout;
