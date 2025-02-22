import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BottomNavigationContext } from '../../../context/BottomNavigationContext';

const Header = () => {

    const { bottomNavigation, setBottomNavigation } = useContext(BottomNavigationContext)

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{bottomNavigation}</Text>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
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
