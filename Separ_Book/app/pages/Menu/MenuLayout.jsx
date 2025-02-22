import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNavigation from './BottomNavigation/BottomNavigation';
import Header from './Header/Header';



const Menu = () => {
    return (
        
            <View style={styles.container}>
                <SafeAreaView style={[styles.safeArea, { flex: 1 }]}>
                    <View style={styles.header}>
                        <Header/>
                    </View>
                    <View style={styles.content}>
                        <Text>Content</Text>
                    </View>
                    <View style={styles.bottonNavigation}>
                        <BottomNavigation/>
                    </View>
                </SafeAreaView>
            </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    safeArea: {
        height: '100%',
        width: '100%',
    },
    header: {
        backgroundColor: 'green',
        height: '10%',
        width: '100%',
    },
    content: {
        width: '100%',
        height: '80%',
    },
    bottonNavigation: {
        width: '100%',
        height: '10%',
    }
});


export default Menu;
