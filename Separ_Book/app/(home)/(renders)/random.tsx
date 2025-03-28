import LottieView from 'lottie-react-native';
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import COLORS from '../../constants/colors'
import Animated, { 
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withDelay,
    withRepeat,
    withTiming,
 } from 'react-native-reanimated';
import { ChapterContext } from '@/app/context/ChapterContex';
import { separ as versesList } from '@/app/data/chapters';
import { useRouter } from 'expo-router';





const RandomPick = () => {

    const [btnTextContent, setBtnTextContent] = useState('')
    const [display, setDisplay] = useState('prayer')

    const router = useRouter()

    const { currentChapter, setCurrentChapter } = useContext(ChapterContext)  

    ////Animation

    //button animation
    const color = useSharedValue(COLORS.lightGray)
    const progress = useSharedValue(0.5)
    //btnFont Animation
    const fontColor = useSharedValue(COLORS.white)

    //prayerContainer Animation
    const prayerProgress = useSharedValue(0)
    const prayerPositionY = useSharedValue(100)
    const prayerScale = useSharedValue(1)

    //prayerContainer Animation
    const pickingProgress = useSharedValue(0)
    const pickingPositionY = useSharedValue(0)
    const pickingScale = useSharedValue(0)

    const btnColorAnimation = useAnimatedStyle(() => ({
        opacity: progress.value,
        backgroundColor: color.value
    }))

    const btnTextAnimation = useAnimatedStyle(() => ({
        color: fontColor.value
    }))

    const prayerContainerAnimation = useAnimatedStyle(() => ({
        opacity: prayerProgress.value,
        transform: [
            { scale: prayerScale.value },
            { translateY: prayerPositionY.value }
        ],
    }))

    const pickingContainerAnimation = useAnimatedStyle(() => ({
        opacity: pickingProgress.value,
        transform: [
            { scale: pickingScale.value },
            { translateY: pickingPositionY.value }
        ],
    }))

    //Animation useEffect
    useEffect(() => {

        console.log(currentChapter)

        let count = 1

        prayerProgress.value = withSpring(1, { damping: 10, stiffness: 364 })
        prayerPositionY.value = withSpring(0, { damping: 10, stiffness: 364 })

        const btnCounting = setInterval(() => {
            setBtnTextContent(`waiting ${count} ...`)
            count ++
        }, 500)

        progress.value = withRepeat(
            withTiming(1, { duration: 800 }), // Fade in/out in 1s
            -1, // Infinite loop
            true // Reverse animation (fades in and out)
        )

        setTimeout(() => {
            progress.value = withTiming(1, { duration: 0 })
            fontColor.value = withSpring(COLORS.white, { damping: 10, stiffness: 364 })
            color.value = withSpring(COLORS.blue, { damping: 10, stiffness: 364 })
            clearInterval(btnCounting)
            setBtnTextContent('Im Ready!')
        }, 3000)
    },[])


    const handleReady = () => {

        prayerScale.value = withSpring(0, { damping: 10, stiffness: 364 });

        setTimeout(() => {
            setDisplay('picking');

            setTimeout(() => {

                pickingProgress.value = withSpring(1, { damping: 10, stiffness: 364 })
                pickingScale.value = withSpring(1, { damping: 10, stiffness: 364 })

                setTimeout(() => {

                    pickingScale.value = withSpring(0, { damping: 10, stiffness: 364 })

                    const ramdomIndex = Math.floor(Math.random() * versesList.length)
        
                    if (ramdomIndex) {
                        setCurrentChapter(ramdomIndex)
                        router.setParams({ route: 'random' })
                        router.push('/view-chapter')
                    }
                }, 3000);
            }, 50)
            
        }, 3000)
        

    }

    return (
        <View style={styles.container}>
            
            {
                display === 'prayer' &&
                <Animated.View style={[styles.prayContainer, prayerContainerAnimation]}>
                    <Text style={styles.titlePray}>PRAY FIRST</Text>
                    <LottieView 
                        source={require('../../../assets/animation/pray-animation.json')} 
                        autoPlay 
                        loop 
                        style={styles.prayLottie}
                    />     
                    <Text style={styles.subtitlePray}>
                        Remember to pray to Alyon YHWH, seeking His guidance to reveal the perfect message or verse for you.
                    </Text>
                    <Animated.View style={[styles.btn, btnColorAnimation]}>
                        <TouchableOpacity
                            disabled={btnTextContent === 'Im Ready!' ? false : true}
                            onPress={() => handleReady()}
                        >
                            <Animated.Text style={[styles.btnText, btnTextAnimation]}>{btnTextContent}</Animated.Text>
                        </TouchableOpacity>
                    </Animated.View>
                </Animated.View>

                ||

                display === 'picking' &&
                <View style={[styles.loadingContainer, pickingContainerAnimation]}>
                    <LottieView 
                        source={require('../../../assets/animation/book-animation.json')} 
                        autoPlay 
                        loop 
                        style={styles.bookLottie}
                    />
                    <Text style={styles.loadingText}>Waiting for a Divinely Chosen Verse...</Text>
                </View>
            }
            
            

            
            
          
            
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    titlePray: {
        fontSize: 20,
        fontFamily: 'Poppins-Bold',
        color: COLORS.blue,
    },
    subtitlePray: {
        fontSize: 15,
        fontFamily: 'Poppins-Regular',
        textAlign: 'center',
    },
    prayContainer: {
        width: '80%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btn: {
        width: 150,
        height: 40,
        backgroundColor: COLORS.blue,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        marginTop: 20,
    },
    btnText: {
        color: 'white',
        fontSize: 13,
        fontWeight: 'bold',
    },
    prayLottie: {
        width: 250,
        height: 200,
    },
    loadingText: {
        fontFamily: 'Poppins-Bold',
        marginTop: -40,
        fontSize: 12,
    },
    bookLottie: {
        width: 200,
        height: 200,
    },
});


export default RandomPick;
