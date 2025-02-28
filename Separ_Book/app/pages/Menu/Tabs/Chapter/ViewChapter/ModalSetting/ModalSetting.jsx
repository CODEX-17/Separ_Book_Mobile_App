import React from 'react';
import { View, Text, StyleSheet,TouchableOpacity, TextInput } from 'react-native';
import { X, Plus, Minus, } from 'lucide-react-native';

const Setting = ({ fontSize, setFontSize, setIsShowSetting }) => {

    console.log(fontSize)

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Setting</Text>
                <TouchableOpacity
                    onPress={() => setIsShowSetting(false)}
                >
                    <X color="#003092" size={25} />
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Text style={[styles.title, { fontSize: 20 }]}>Font Size</Text>
                    <TouchableOpacity
                        onPress={() => setFontSize((old) => old + 1)}
                    >
                        <Plus color="#003092" size={25} />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => {
                            let newSize = parseInt(text) || 10 // Convert text to number, default to 10 if empty
                            if (newSize < 10) newSize = 10 // Ensure minimum value is 10
                            setFontSize(newSize)
                        }}
                        value={fontSize.toString()}  // Ensure it's a string
                        keyboardType="numeric"
                    />
                    <TouchableOpacity
                        onPress={() => setFontSize(fontSize - 1)}
                    >
                        <Minus color="#003092" size={25} />
                    </TouchableOpacity>
                </View>
                
            </View>
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
        fontSize: 20,
        textAlign: 'center',
    },
    title: {
        fontFamily: 'Poppins_700Bold',
        color: '#343434',
        fontSize: 30,
        textAlign: 'center',
    },
    verse: {
        fontFamily: 'Poppins_400Regular',
        color: '#343434',
        fontSize: 15,
        textAlign: 'center',
    },
})

export default Setting;
