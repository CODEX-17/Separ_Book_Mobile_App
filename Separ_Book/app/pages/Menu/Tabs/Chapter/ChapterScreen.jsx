import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet,
    ScrollView,
    TouchableOpacity

} from 'react-native';
import ViewChapter from './ViewChapter/ViewChapter';


const ChapterScreen = () => {

    const [selectedChapter, setSelectedChapter] = useState(null)

    return (
        <View style={styles.container}>
            {
                selectedChapter ?
                    <ViewChapter/>
                : 
                <>
                    <View style={styles.header}>
                        <Text style={styles.title}>Select Chapter</Text>
                        <Text style={styles.subtitle}>Easily navigate through the sacred writings. Browse and select chapters to explore divine wisdom at your own pace.</Text>
                    </View>
                    <View style={styles.menuList}>
                        <ScrollView>
                            <View style={styles.scroll}>
                            {Array.from({ length: 10 }).map((_, index) => (
                                <TouchableOpacity
                                    style={styles.btn}
                                    key={index}
                                    onPress={() => setSelectedChapter(index)}
                                >   
                                    <Text style={styles.btnTitle}>Chapter</Text>
                                    <Text style={styles.btnNumber}>{index + 1}</Text>
                                </TouchableOpacity>
                            ))}
                            </View>
                        </ScrollView>
                    </View>
                </>
            }
            
          
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontFamily: 'Poppins_700Bold',
        color: '#343434',
        fontSize: 30,
        textAlign: 'center',
    },
    subtitle: {
        fontFamily: 'Poppins_400Regular',
        color: '#343434',
        fontSize: 15,
        textAlign: 'center',
    },
    header: {
        height: '20%',
        width: '100%',
    },
    menuList: {
        width: '100%',
        height: '80%',
    },
    scroll: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap', // Wrap items to next row
        justifyContent: 'space-between',
    },
    btn: {
        backgroundColor: '#0943AF',
        width: '30%', // 3 columns
        aspectRatio: 1, // Keep it square
        height: 80,
        borderRadius: 15,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    btnTitle: {
        fontFamily: 'Poppins_400Regular',
        color: '#343434',
        fontSize: 15,
        textAlign: 'center',
        color: '#fff',
    },
    btnNumber: {
        fontFamily: 'Poppins_700Bold',
        color: '#343434',
        fontSize: 35,
        textAlign: 'center',
        color: '#fff',
    }

})


export default ChapterScreen
