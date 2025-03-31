import React, { useEffect, useRef, useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import { Undo2, Share2, ImageDown } from 'lucide-react-native';
import * as Sharing from 'expo-sharing';

interface ScreenShotProps {
    selectedVerse: {
        chapter: number;
        verse: number;
        content: string;
    };
    setIsShowPreview: (value: boolean) => void;
}

const ScreenShot: React.FC<ScreenShotProps> = ({ selectedVerse, setIsShowPreview }) => {

    const imageRef = useRef(null)
    const [imageUri, setImageUri] = useState<string | null>(null)
    const [status, requestPermission] = MediaLibrary.usePermissions()

    if (status === null) {
        requestPermission();
    }

    useEffect(() => {

        const convertingVerseIntoImage = async () => {
            try {
                // Wait for the view to render completely
                await new Promise((resolve) => setTimeout(resolve, 500))
    
                if (!imageRef.current) {
                    console.log("imageRef is not yet available")
                    return
                }
    
                const localUri = await captureRef(imageRef, {
                    height: 440,
                    quality: 1,
                    format: 'png',
                })
    
                if (localUri) {
                    setImageUri(localUri)
                    alert('Image captured successfully!')
                }
            } catch (error) {
                console.error("Error capturing image:", error)
            }
        }

        convertingVerseIntoImage()

    },[])

    const onSaveImageAsync = async () => {
        try {
            if (imageUri) {
                await MediaLibrary.saveToLibraryAsync(imageUri);
            } else {
                alert("No image available to save.");
            }
            alert('Saved!')
        } catch (e) {
            console.log(e);
        }
    }

    const handleShare = async () => {
        
        if (!imageUri) {
            alert("No image available to share.");
            return
        }

        try {
            await Sharing.shareAsync(imageUri, {
                dialogTitle: "Share Verse Image",
                mimeType: "image/png",
            })
        } catch (error) {
            console.error("Error sharing:", error)
        }
    }

    return (
        <View style={styles.container}>
            <View 
                style={styles.display} 
                ref={imageRef} 
                collapsable={false}
            >
                <View style={{ flexDirection: 'column' }}>
                    <Text style={styles.chapter}>{`Chapter ${selectedVerse?.chapter}`}</Text>
                    <Text style={styles.verse}>{`Verse ${selectedVerse?.verse}`}</Text>
                </View>
                
                <Text style={styles.contentText}>{selectedVerse?.content}</Text>

                    {/* {
                        selectedVerse?.content.length  > 400 ?
                            <ScrollView style={{ padding: 10 }}> 
                                <Text style={[styles.contentText, { fontSize: 30 }]}>{selectedVerse?.content}</Text>
                            </ScrollView> 
                        :
                            
                    } */}

            </View>
            <View style={styles.menu}>
                 <TouchableOpacity
                    onPress={() => setIsShowPreview(false)}
                >
                    <Undo2 color="#003092" size={25} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={onSaveImageAsync}
                >
                    <ImageDown color="#003092" size={25} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleShare} 
                >
                    <Share2 color="#003092" size={25} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,

         // Shadow for iOS
         shadowColor: '#000',
         shadowOffset: { width: 2, height: 10 },
         shadowOpacity: 0.1,
         shadowRadius: 4,
 
         // Shadow for Android
         elevation: 1,

    },
    chapter: {
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
    contentText: {
        fontFamily: 'Poppins-Regular',
        color: '#343434',
        fontSize: 15,
        textAlign: 'center',
    },
    displayContent: { 
        height: '79%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    display: {
        height: '90%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        backgroundColor: '#fff',
        paddingLeft: 30,
        paddingRight: 30,
    },
    menu: {
        flexDirection: 'row',
        height: '10%',
        width: '100%',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
        paddingLeft: 30,
        paddingRight: 30,
    },
});

export default ScreenShot;
