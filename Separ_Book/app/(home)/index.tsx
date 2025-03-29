import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from './header';
import { BottomNavigationContext } from '../context/BottomNavigationContext';
import ChapterScreen from './(renders)/chapter';
import Navigation from './navigation';
import RandomPick from './(renders)/random';
import Search from './(renders)/search';

const HomeLayout = () => {

    const { bottomNavigation } = useContext(BottomNavigationContext)

    const renderTab = () => {
        switch (bottomNavigation) {
            case 'Home':
            case 'Chapters':
                return <ChapterScreen/>
            case 'Search':
                return <Search/>
            case 'Random':
                return <RandomPick/>
            case 'Default':
                return <ChapterScreen/>;
            default:
                return <Text>No tab selected</Text>; // Fallback UI
        }
    };

    return (
        
            <View style={styles.container}>
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
            </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        flex: 1,
        backgroundColor: '#fff',
        elevation: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,

    }
});


export default HomeLayout;
