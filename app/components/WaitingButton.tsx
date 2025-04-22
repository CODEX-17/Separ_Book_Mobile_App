import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const WaitingButton = () => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.btn}>
                <Text style={styles.btnText}>Wait for Verse</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20, // Adds spacing
    },
    btn: {
        width: 150,
        height: 50,
        backgroundColor: '#003092', // Deep blue color
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10, // Rounded corners
    },
    btnText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default WaitingButton;
