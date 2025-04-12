import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet,TouchableOpacity, TextInput, Platform } from 'react-native';
import { X, Plus, Minus, } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SettingContext } from './context/SettingContext';


const Setting = () => {

    const router = useRouter()
    const settingContext = useContext(SettingContext)
        
    if (!settingContext) return false
        
    const { objSetting, handleChangeSetting } = settingContext

    const handleChangeFontSize = (value: number) => {
        
        if (isNaN(value) || value < 10 || value > 100) return;

        const updatedSettings = { ...objSetting, fontSize: value }
        handleChangeSetting(updatedSettings)
    }

    return (
        <View style={styles.container}>
            <SafeAreaView style={{ flex: 1, paddingTop: Platform.OS === 'android' ? 25 : 0 }}>
                <View style={styles.header}>
                    <Text style={styles.title}>Setting</Text>
                    <TouchableOpacity
                        onPress={() => router.dismiss(1)}
                    >
                        <X color="#003092" size={25} />
                    </TouchableOpacity>
                </View>
                <View style={styles.content}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Text style={[styles.title, { fontSize: 20 }]}>Font Size</Text>
                        <TouchableOpacity
                            onPress={() => handleChangeFontSize(objSetting.fontSize + 1)}
                        >
                            <Plus color="#003092" size={25} />
                        </TouchableOpacity>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => {
                                if (text === "") return handleChangeFontSize(10)
                                const parsedValue = parseInt(text, 10);
                                if (!isNaN(parsedValue)) handleChangeFontSize(parsedValue);
                            }}
                            value={objSetting.fontSize.toString()}
                            keyboardType="numeric"
                        />
                        <TouchableOpacity
                        onPress={() => handleChangeFontSize(objSetting.fontSize - 1)}
                        >
                            <Minus color="#003092" size={25} />
                        </TouchableOpacity>
                    </View>
                    
                </View>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 40,

        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,

        // Shadow for Android
        elevation: 1,
    },
    content: {
        flex: 1,
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 20,
    },
    input: {
        height: 40,
        width: '30%',
        margin: 12,
        borderWidth: 1,
        padding: 10,
        color: '#343434',
        borderRadius: 10,
        fontSize: 15,
        textAlign: 'center',
    },
    title: {
        fontFamily: 'Poppins-Bold',
        color: '#343434',
        fontSize: 30,
        textAlign: 'center',
    },
    verse: {
        fontFamily: 'Poppins-Regular',
        color: '#343434',
        fontSize: 15,
        textAlign: 'center',
    },
})

export default Setting;
