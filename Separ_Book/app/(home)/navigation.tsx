import React, { useContext, useState } from 'react';
import { View, Pressable, Text, StyleSheet, Image, Platform } from 'react-native';
import { BottomNavigationContext } from '../context/BottomNavigationContext';
import { SettingContext } from '../context/SettingContext';
import COLORS from '../constants/colors';
import { House, Book, Search, CalendarDays, Dices } from 'lucide-react-native';

const BottomNavigation = () => {


    const { bottomNavigation, setBottomNavigation }= useContext(BottomNavigationContext)
    const { objSetting } = useContext(SettingContext) 

    const themeColors = objSetting.theme === 'dark' ? COLORS.dark : COLORS.light;

    const buttonList = [
        {
            title: 'Home',
            icon: (isActive: boolean) => <House color={isActive ? themeColors.highlight : themeColors.secondaryText} size={25} />,
        },
        {
            title: 'Chapters',
            icon: (isActive: boolean) => <Book color={isActive ? themeColors.highlight : themeColors.secondaryText} size={25} />,
        },
        {
            title: 'Search',
            icon: (isActive: boolean) => <Search color={isActive ? themeColors.highlight : themeColors.secondaryText} size={25} />,
        },
        {
            title: 'Calendar',
            icon: (isActive: boolean) => <CalendarDays color={isActive ? themeColors.highlight : themeColors.secondaryText} size={25} />,
        },
        {
            title: 'Random',
            icon: (isActive: boolean) => <Dices color={isActive ? themeColors.highlight : themeColors.secondaryText} size={25} />,
        },
    ]

    const handleNavigation = (title: string) => {
        setBottomNavigation(title)
    }

    return (
        <View style={[styles.container, { backgroundColor: themeColors.background, shadowColor: themeColors.border }]}>
            <View style={styles.navList}>
            {
                buttonList.map((btn, index) => {
                    const isActive = bottomNavigation === btn.title;
                    return (
                        <Pressable 
                            style={({ pressed }) => [
                                isActive ? [styles.buttonActive, { backgroundColor: themeColors.card }] : styles.button,
                                pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] },
                            ]}
                            key={index}
                            onPress={() => handleNavigation(btn.title)}
                        >
                            {btn.icon(isActive)}  {/* Pass isActive state here */}
                            <Text style={[styles.buttonText, { color: isActive ? themeColors.highlight : themeColors.secondaryText }]}>
                                {btn.title}
                            </Text>
                        </Pressable>
                    );
                })
            }   
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // paddingTop: 20,
        // paddingBottom: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,

        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.1,
        shadowRadius: 4,

        // Shadow for Android
        elevation: 1,
    },
    navList: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        display: 'flex',
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    buttonActive: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E9F0FF',
        borderRadius: 10,
        height: 60,
        width: 60,
        
    },
    button: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        height: 60,
        width: 60,
        
    },
    buttonText: {
        fontSize: 10,
        textAlign: 'center',
        padding: 0,
        margin: 0,
        fontFamily: 'Poppins-Bold',
        color: '#343434',
    }
});


export default BottomNavigation;
