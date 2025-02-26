import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


const ViewChapter = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.chapter}>Chapter 1</Text>
            <Text style={styles.verse}>Verse 2</Text>

            <Text style={styles.content}>Lorem ipsum dolor sit amet consectetur adipisicing elit. A totam neque quis similique aut minus et quae nisi atque officiis?</Text>
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
    chapter: {
        fontFamily: 'Poppins_700Bold',
        color: '#343434',
        fontSize: 40,
        textAlign: 'center',
    },
    verse: {
        fontFamily: 'Poppins_400Regular',
        color: '#343434',
        fontSize: 20,
        textAlign: 'center',
    },
    content: {
        fontFamily: 'Poppins_400Regular',
        color: '#343434',
        fontSize: 30,
        textAlign: 'center',
        marginTop: 20,
    },
});

export default ViewChapter;
