import React, { useState, useContext, useRef } from 'react';
import { 
    View, 
    Text, 
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import { separ as chapters } from '../../data/chapters'
import AntDesign from 'react-native-vector-icons/AntDesign';
import LottieView from 'lottie-react-native';
import { ChapterContext } from '../../context/ChapterContex';
import { useRouter } from 'expo-router';

const ChapterScreen = () => {

    const router = useRouter()

    const scrollViewRef = useRef<ScrollView>(null);

    const { currentChapter, setCurrentChapter } = useContext(ChapterContext)
    const chapterList = [...new Set(chapters.map(data => data.chapter))]
    const [selectedChapter, setSelectedChapter] = useState<number | null>(null)
    const [verseList, setVerseList] = useState<number[] | null>(null) 

    const [loading, setLoading] = useState(false)

    console.log(chapterList)

    const handleSelect = (data: number) => {
        console.log(data)
        setLoading(true)
        setSelectedChapter(data)
       
        setVerseList(() => {
            return chapters
            .filter((chp) => chp.chapter === data)
            .map((data) => data.verse)
        })

        setTimeout(() => {
            setLoading(false)
        }, 1000)
        
    }

    const handleSelectVerse = (data: number) => {
        setLoading(true)
        const chapter = selectedChapter
        const verse = data
        if (chapter && verse) {
            setCurrentChapter({
                chapter,
                verse,
            })
            setTimeout(() => {
                setLoading(false)
            }, 1000)
            router.push("/view-chapter")
        }
        
        
    }   

    const scrollToBottom = () => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{selectedChapter ? 'Select Verse': 'Select Chapter'}</Text>
                <Text style={styles.subtitle}>
                    {
                        selectedChapter ? `Chapter ${selectedChapter}` : 'Easily navigate through the sacred writings. Browse and select chapters to explore divine wisdom at your own pace.'
                    }
                </Text>
                <View 
                    style={{ 
                        width: '100%', 
                        flexDirection: 'row', 
                        justifyContent: 'space-between', 
                        marginTop: 20,
                    }}
                >
                    <TouchableOpacity 
                        style={{ flexDirection: 'row', gap: 5 }}
                        onPress={() => {setVerseList(null), setSelectedChapter(null)}}
                    >
                        <AntDesign name="back" color="#003092" size={20}/>
                        <Text style={{ fontSize: 15 }}>{`Back`}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={{ flexDirection: 'row', gap: 5 }}
                        onPress={scrollToBottom}
                    >
                        <Text style={{ fontSize: 15 }}>{`Scroll to End`}</Text>
                        <AntDesign name="down" color="#003092" size={20}/>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.menuList}>
                {
                    loading ? 
                    <View 
                        style={{ 
                            flex: 1, 
                            display: "flex", 
                            alignItems: 'center', 
                            justifyContent: 'center' 
                        }}
                    >
                        <LottieView 
                            source={require('../../../assets/animation/loader.json')} 
                            autoPlay 
                            loop 
                            style={styles.lottie}
                        />
                    </View>
                    :
                    <ScrollView ref={scrollViewRef}>
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
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontFamily: 'Poppins-Bold',
        color: '#343434',
        fontSize: 25,
        textAlign: 'center',
    },
    subtitle: {
        fontFamily: 'Poppins-Regular',
        color: '#343434',
        fontSize: 12,
        textAlign: 'center',
    },
    header: {
        height: 'auto',
        width: '100%',
        paddingBottom: 20,
    },
    menuList: {
        width: '100%',
        height: '80%',
    },
    scroll: {
        width: '100%',
        height: '100%',
        // justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap', // Wrap items to next row
        justifyContent: 'space-between',
        paddingBottom: 20,
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
        fontFamily: 'Poppins-Regular',
        color: '#fff',
        fontSize: 15,
        textAlign: 'center',
    },
    btnNumber: {
        fontFamily: 'Poppins-Bold',
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
