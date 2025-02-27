import React, { useState, useContext } from 'react';
import { 
    View, 
    Text, 
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import { separ as chapters } from '../../../../data/chapters'
import { ChapterContext } from '../../../../context/ChapterContex';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LottieView from 'lottie-react-native';

const ChapterScreen = ({ navigation }) => {

    const { currentChapter, setCurrentChapter } = useContext(ChapterContext)
    const chapterList = [...new Set(chapters.map(data => data.chapter))]
    const [selectedChapter, setSelectedChapter] = useState(null)
    const [verseList, setVerseList] = useState(null) 

    const [loading, setLoading] = useState(false)

    const handleSelect = (data) => {
        setLoading(true)
        setSelectedChapter(data)
       
        setVerseList(() => {
            return chapters.filter((chap) => chap.chapter == data)
            .map((data) => data.verse)
        })

        setTimeout(() => {
            setLoading(false)
        }, 1000)
        
    }

    const handleSelectVerse = (data) => {
        setLoading(true)
        const chapter = selectedChapter
        const verse = data
        const result = chapters.filter((data) => data.chapter == chapter && data.verse == verse)
        if (result) {
            setCurrentChapter(result[0])
            setTimeout(() => {
                setLoading(false)
            }, 1000)
            navigation.navigate("view")
        }
        
        
    }   

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{selectedChapter ? 'Select Verse': 'Select Chapter'}</Text>
                {
                    selectedChapter ?
                    <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                        <TouchableOpacity 
                            style={{ flexDirection: 'row', gap: 5 }}
                            onPress={() => {setVerseList(null), setSelectedChapter(null)}}
                        >
                            <AntDesign name="back" color="#003092" size={20}/>
                            <Text style={{ fontSize: 20 }}>{`Back`}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={{ flexDirection: 'row', gap: 5 }}
                        >
                            <Text style={{ fontSize: 20 }}>{`Scroll to End`}</Text>
                            <AntDesign name="down" color="#003092" size={20}/>
                        </TouchableOpacity>
                    </View>
                    :
                    <Text style={styles.subtitle}>Easily navigate through the sacred writings. Browse and select chapters to explore divine wisdom at your own pace.</Text>
                }
            </View>
            <View style={styles.menuList}>
                {
                    loading ? 
                    <View style={{ width: '100%', height: '100%', display: "flex", alignItems: 'center', justifyContent: 'center' }}>
                        <LottieView 
                            source={require('../../../../../assets/loader.json')} 
                            autoPlay 
                            loop 
                            style={styles.lottie}
                        />
                    </View>
                    :
                    <ScrollView>
                        <View style={styles.scroll}>
                        {
                            verseList ?
                                verseList.map((data, index) => (
                                    <TouchableOpacity
                                        style={styles.btn}
                                        key={index}
                                        onPress={() => handleSelectVerse(data)}
                                    >   
                                        <Text style={styles.btnTitle}>{selectedChapter ? 'Verse': 'Chapter'}</Text>
                                        <Text style={styles.btnNumber}>{data}</Text>
                                    </TouchableOpacity>
                                )) 
                            : 
                                chapterList.map((data, index) => (
                                    <TouchableOpacity
                                        style={styles.btn}
                                        key={index}
                                        onPress={() => handleSelect(data)}
                                    >   
                                        <Text style={styles.btnTitle}>{selectedChapter ? 'Verse': 'Chapter'}</Text>
                                        <Text style={styles.btnNumber}>{data}</Text>
                                    </TouchableOpacity>
                                ))
                        }
                        </View>
                    </ScrollView>
                }
                
            </View>
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
        fontSize: 35,
        textAlign: 'center',
        color: '#fff',
    },
    box: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderColor: 'red',
        borderWidth: 10,
        backgroundColor: '#fff'
    },
    lottie: {
        width: 300,
        height: 300,
    },

})


export default ChapterScreen
