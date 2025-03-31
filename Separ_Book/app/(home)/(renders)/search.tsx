import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Search } from 'lucide-react-native';
import LottieView from 'lottie-react-native';
import { shortenText } from '../../Utils/textUtils'
import { separ as chapterList } from '@/app/data/chapters';
import Fuse from 'fuse.js';
import { ChapterContext } from '@/app/context/ChapterContex';
import { useRouter } from 'expo-router';
import { getChapter } from '@/app/Utils/getChapter';
import { SettingContext } from '@/app/context/SettingContext';
import COLORS from '@/app/constants/colors';

const MyComponent = () => {

    type Verse = {
        chapter: number;
        verse: number;
        content: string;
    }

    const [text, setText] = useState('')
    const [resultList, setResultList] = useState<Verse[] | []>([])
    const [loading, setLoading] = useState(false);

    const { objSetting } = useContext(SettingContext)
    const themeColors = objSetting.theme === 'dark' ? COLORS.dark : COLORS.light;
    
    const router = useRouter()

    const { setCurrentChapter } = useContext(ChapterContext) 

    const fuseOptions = {
        // isCaseSensitive: false,
        includeScore: true,
        // ignoreDiacritics: false,
        shouldSort: true,
        includeMatches: true,
        findAllMatches: true,
        // minMatchCharLength: 1,
        // location: 0,
        threshold: 0.4,
        // distance: 100,
        // useExtendedSearch: false,
        // ignoreLocation: false,
        // ignoreFieldNorm: false,
        // fieldNormWeight: 1,
        keys: ["content"]
    }

    const fuse = new Fuse(chapterList, fuseOptions)

    const handleSearch = (text: string) => {
        setResultList([])
        setText(text)
        setLoading(true)
        const result = fuse.search(text).map(res => res.item)
        setTimeout(() => {
            setLoading(false)
            setResultList(result)
        }, 1000)
       
    }

    const handleSelectVerse = (chapter: number, verse: number) => {

        const result = getChapter(chapter, verse)

        if (result) {
            setCurrentChapter(result.index)
            router.push("/view-chapter")
        } else {
            console.error("Result is null")
        }

    }

    return (
        <View style={styles.container}>
            <View style={[styles.inputContainer, { backgroundColor: themeColors.card }]}>
                <Search 
                    size={20}
                    color={themeColors.primary}
                />
                <TextInput
                    style={[styles.input, { color: themeColors.primaryText }]}
                    onChangeText={handleSearch}
                    placeholder="Search"
                    placeholderTextColor="#ccc"
                    value={text}
                />
            </View>
            <Text style={[styles.label, { color: themeColors.primaryText }]}>Search Result: {resultList.length}</Text>
            <ScrollView style={styles.cardList}>
                {
                    resultList.length > 0 ? (
                        resultList.map((data, index) => (
                            <TouchableOpacity
                                onPress={() => handleSelectVerse(data.chapter, data.verse)}
                            >
                                <View 
                                    style={[styles.card, { backgroundColor: themeColors.card, borderColor: themeColors.border }]} 
                                    key={index}
                                >
                                    <Text style={[styles.chapterText, { color: themeColors.primaryText }]}>{`Chapter ${data.chapter}`}</Text>
                                    <Text style={[styles.verseText, { color: themeColors.secondaryText }]}>{`Verse ${data.verse}`}</Text>
                                    <Text style={[styles.verseContent, { color: themeColors.secondaryText }]}>{shortenText(data.content, 25)}</Text>
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        loading ? (
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <LottieView 
                                    source={require('../../../assets/animation/searching-loading-animation.json')} 
                                    autoPlay 
                                    loop 
                                    style={styles.searchLoading}
                                />
                            </View>
                        ) : (
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={[styles.verseText, { color: themeColors.primaryText }]}>No Result</Text>
                            </View>
                            
                        )
                    )
                }
               
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: 'transparent',
        padding: 40,
    },
    inputContainer: {
        width: '100%',
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F3F3F3',
        borderRadius: 10,
        marginBottom: 20,
        paddingLeft: 10,
        paddingRight: 10,
    },
    input: {
        width: '90%',
        height: '100%',
        paddingLeft: 10,
        backgroundColor: 'transparent',
        borderRadius: 5,
        borderWidth: 0,
        borderColor: '#ccc',
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
    },
    label: {
        fontFamily: 'Poppins-Bold',
        color: '#343434',
        fontSize: 15,
        textAlign: 'left',
        width: '100%',
        marginBottom: 10,
    },
    cardList: {
        flex: 1,
        paddingBottom: 20,
        width: '100%',
    },
    card: {
        width: '100%',
        padding: 10,
        flexDirection: 'column',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 10,
    },
    chapterText: {
        fontFamily: 'Poppins-Bold',
        color: '#343434',
        fontSize: 20,
        textAlign: 'left',
    },
    verseText: {
        fontFamily: 'Poppins-Regular',
        color: '#343434',
        fontSize: 15,
        textAlign: 'left',
    },
    verseContent: {
        fontFamily: 'Poppins-Regular',
        color: '#343434',
        fontSize: 15,
        textAlign: 'left',
    },
    searchLoading: {
        width: 250,
        height: 250,
    }
});

export default MyComponent;
