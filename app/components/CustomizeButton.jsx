//import liraries
import React from 'react';
import { Text,Pressable, StyleSheet } from 'react-native';


const CustomizeButton = ({ title, icons, onPress, width, styleButton, styleText}) => {
    return (
        <Pressable 
            style={({ pressed }) => [
                styles.button,
                { width },
                pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] },
                styleButton // Click effect
            ]}
            onPress={onPress}
   
        >   
            <Text style={[styles.buttonText, styleText]}>{title}</Text>
            {icons}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 5,
        height: 50,
        width: '100%',
        backgroundColor: '#003092',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontFamily: 'Poppins-Bold',
        fontSize: 20,
        color: '#fff',
    }
})

export default CustomizeButton;
