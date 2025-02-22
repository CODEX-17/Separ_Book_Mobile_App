import React, { useContext, useState } from 'react';
import { View, Pressable, Text, StyleSheet, Image } from 'react-native';
import { BottomNavigationContext } from '../../../context/BottomNavigationContext';


const BottomNavigation = () => {


    const { bottomNavigation, setBottomNavigation } = useContext(BottomNavigationContext)

    const buttonList = [
        {
            title: 'Home',
            iconPath: require('../../../../assets/images/icons/home.png'),
        },
        {
            title: 'Chapters',
            iconPath: require('../../../../assets/images/icons/book.png'),
        },
        {
            title: 'Search',
            iconPath: require('../../../../assets/images/icons/search.png'),
        },
        {
            title: 'New Moon',
            iconPath: require('../../../../assets/images/icons/moon.png'),
        },
        {
            title: 'Random',
            iconPath: require('../../../../assets/images/icons/random.png'),
        },

    ]

    const handleNavigation = (title) => {
        setBottomNavigation(title)
    }

    return (
        <View style={styles.container}>
            <View style={styles.navList}>
                {
                    buttonList.map((btn, index) => (
                        <Pressable 
                            style={({ pressed }) => [
                                bottomNavigation === btn?.title ? styles.buttonActive : styles.button,
                                pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] },
                            ]}
                            key={index}
                            onPress={() => handleNavigation(btn?.title)}
                        >
                            <Image 
                                source={btn?.iconPath}
                                style={{ width: 20, tintColor: bottomNavigation === btn?.title ? '#0943AF': '#343434' }}
                            />
                            <Text style={[styles.buttonText, { color: bottomNavigation === btn?.title ? '#0943AF': '#343434' }]}>{btn?.title}</Text>
                        </Pressable>
                    ))
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
        backgroundColor: '#fff',
        height: '100%',
        width: '100%',
        padding: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.1,
        shadowRadius: 4,

        // Shadow for Android
        elevation: 5,
    },
    navList: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    buttonActive: {
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#BDD4FF',
        borderRadius: 10,
        height: 60,
        gap: 5,
    },
    button: {
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        height: 60,
        gap: 5,
    },
    buttonText: {
        fontSize: 15,
        textAlign: 'center',
        padding: 0,
        margin: 0,
        fontFamily: 'Poppins_700Bold',
        color: '#343434',
    }
});


export default BottomNavigation;
