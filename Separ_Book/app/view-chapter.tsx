import React, { useContext, useEffect, useRef, useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import { ChapterContext } from './context/ChapterContex';
import { getChapter } from './Utils/getChapter';
import { separ as chapterList } from './data/chapters'
import { SkipForward, SkipBack, Undo2, Heart, Share2, ImageDown, Settings } from 'lucide-react-native';
import ScreenShot from './(home)/screen-shot';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import { SettingContext } from './context/SettingContext';


const ViewChapter = () => {

    const router = useRouter()
    const params = useGlobalSearchParams()

    const { currentChapter, setCurrentChapter } = useContext(ChapterContext)
    const { objSetting } = useContext(SettingContext)

    const [selectedVerse, setSelectedVerse] = useState(chapterList[currentChapter])

    const fontSize = objSetting.fontSize

    const [currentIndexChapter, setCurrentIndexChapter] = useState<number | null>(null)
    const [isShowPreview, setIsShowPreview] = useState(false)


  
    useEffect(() => {
        if (!selectedVerse) router.back()
    },[params])

    useEffect(() => {
        if (selectedVerse) {
            console.log(selectedVerse?.content.length)
            console.log(fontSize)
        }
        
    },[selectedVerse])

    const handleSwitchVerse = (type: string) => {

        const index = type === 'next' ? (currentChapter ?? 0) + 1 : (currentChapter ?? 0) - 1

        if (index < 0 || index >= chapterList.length - 1) return; 
        
        setCurrentIndexChapter(index)
        setCurrentChapter(index)
        setSelectedVerse(chapterList[index])
    }

    const handleSave = () => {
        setIsShowPreview(true)
    }

    const handleback = () => {
        if (params.route === 'random') { 
            router.dismiss(2)
        }
        
        router.dismissTo('/(home)')
    }

    return (
        
            <View style={styles.container}>  
                {
                    isShowPreview &&
                    <View style={styles.modal}>
                        <ScreenShot 
                            selectedVerse={selectedVerse}
                            setIsShowPreview={setIsShowPreview}
                        />
                    </View>
                }

                <SafeAreaView>                  
                    <View style={styles.content}>
                        <View style={styles.display}>
                            <View style={styles.header}>
                                <TouchableOpacity
                                    onPress={() => handleback()}
                                >
                                    <Undo2 color="#003092" size={25} />
                                </TouchableOpacity>
                                <View style={{ flexDirection: 'column' }}>
                                    <Text style={styles.chapter}>{`Chapter ${selectedVerse?.chapter}`}</Text>
                                    <Text style={styles.verse}>{`Verse ${selectedVerse?.verse}`}</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => router.push('/setting')}
                                >
                                    <Settings color="#003092" size={25} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.displayContent}>
                                {
                                    selectedVerse && 
                                    selectedVerse.content.length > 400 ?
                                        <ScrollView style={{ padding: 10 }}> 
                                            <Text style={[styles.contentText, { fontSize: objSetting.fontSize }]}>{selectedVerse?.content}</Text>
                                        </ScrollView> 
                                    :
                                        <Text style={[styles.contentText, { fontSize: objSetting.fontSize }]}>{selectedVerse?.content}</Text>
                                }
                            </View>
                        </View>
                        <View style={styles.menu}>
                            
                            <TouchableOpacity
                                onPress={() => handleSwitchVerse('prev')}
                            >
                                <SkipBack color="#003092" size={25} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleSwitchVerse('next')}
                            >
                                <SkipForward color="#003092" size={25} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleSwitchVerse('next')}
                            >
                                <Heart color="#003092" size={25} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleSave}
                            >
                                <ImageDown color="#003092" size={25} />
                            </TouchableOpacity>
                        </View>
                    </View>  
                </SafeAreaView>
            </View>

            
   
    )
}


const styles = StyleSheet.create({
    container: {
        display: 'flex',
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        position: 'relative'
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        padding: 20,
        backgroundColor: '#fff'
    },
    display: { 
        height: '95%', 
        alignItems:'center' 
    },
    header: { 
        flexDirection: 'row', 
        paddingTop: 20, 
        height: 100, 
        width: '100%',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-between',

    },
    displayContent: { 
        height: '79%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    menu: {
        flexDirection: 'row',
        height: '10%',
        width: '100%',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
    },
    chapter: {
        fontFamily: 'Poppins-Bold',
        color: '#343434',
        fontSize: 40,
        textAlign: 'center',
    },
    verse: {
        fontFamily: 'Poppins-Regular',
        color: '#343434',
        fontSize: 20,
        textAlign: 'center',
    },
    contentText: {
        fontFamily: 'Poppins-Regular',
        color: '#343434',
        fontSize: 30,
        textAlign: 'center',
    },
    modal: { 
        width: '80%', 
        height: '80%', 
        position: 'absolute',
        zIndex: 20,
    }
   
});

export default ViewChapter;
