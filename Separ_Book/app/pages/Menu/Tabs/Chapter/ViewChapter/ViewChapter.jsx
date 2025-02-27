import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ChapterContext } from '../../../../../context/ChapterContex';


const ViewChapter = () => {

    const { currentChapter } = useContext(ChapterContext)

    console.log(currentChapter)

    return (
        <View style={styles.container}>
            <Text style={styles.chapter}>{`Chapter ${currentChapter?.chapter}`}</Text>
            <Text style={styles.verse}>{`Verse ${currentChapter?.verse}`}</Text>
            <Text style={styles.content}>{currentChapter?.content}</Text>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
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
        fontSize: 20,
        textAlign: 'center',
        marginTop: 20,
    },
});

export default ViewChapter;
