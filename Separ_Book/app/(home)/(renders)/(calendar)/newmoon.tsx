import React, { useContext, useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { newMoon } from '../../../Utils/newMoonCalculation'
import COLORS from '@/app/constants/colors'
import LottieView from 'lottie-react-native';
import { SettingContext } from '@/app/context/SettingContext';
import { feast as feastlList } from '../../../data/feastDateList'
import { convertDateFormatIntoString } from '../../../Utils/dateUtils'

const NewMoon = () => {

    const dateList = newMoon()
    const currentDate = new Date().getMonth()

    const { objSetting } = useContext(SettingContext)
    const themeColors = objSetting.theme === 'dark' ? COLORS.dark : COLORS.light;

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 2000)

        return () => clearTimeout(timer)
    },[])

    return (
        <View style={styles.container}>
            <View style={{ width: '100%', marginBottom: 20, alignItems: 'center' }}>
                <Text style={[styles.title, { color: themeColors.primaryText }]}>New Moon Date List</Text>
                <Text style={[styles.subtitle, { color: themeColors.secondaryText }]}>View monthly new moon dates to easily determine the exact time for observing the New Moon Sabbath.</Text>
            </View>

                {
                    isLoading ?
                        <View style={{ height: '80%', alignItems: 'center', justifyContent: 'center' }}>
                            <LottieView 
                                source={require('../../../../assets/animation/loading-list-animation.json')} 
                                autoPlay 
                                loop 
                                style={styles.loading}
                            />
                        </View>
                    :

                        <ScrollView
                            style={{ flex: 1, width: '100%' }}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                        >
                            {
                                dateList.map((moon, index) => (
                                    <View 
                                        key={index} 
                                        style={[
                                            styles.card, 
                                            { backgroundColor: themeColors.card, borderColor: themeColors.border }, 
                                            index === currentDate && 
                                                { backgroundColor: themeColors.activeCard, borderColor: themeColors.border }
                                        ]}>
                                        <Text style={[styles.textDate, { color: themeColors.primaryText }]}>{moon.date}</Text>
                                        <Text style={[styles.textTime, { color: themeColors.secondaryText }]}>{moon.time}</Text>
                                        {index === currentDate && <Text style={[styles.textTime, { color: themeColors.secondaryText }]}>(current new moon)</Text>}
                                    </View>
                                ))
                            }
                            
                        </ScrollView>
                }
            
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'trasparent',
        padding: 20,
    },
    card: {
        width: '100%',
        height: 100,
        flexDirection: 'column',
        justifyContent: 'center',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        borderWidth: 1,
        marginBottom: 10,
    },
    textDate: {
        fontSize: 20,
        fontFamily: 'Poppins-Bold',
    },
    textTime: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
    },
    title: {
        fontSize: 20,
        fontFamily: 'Poppins-Bold',
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        textAlign: 'center',
    },
    loading: {
        width: 300,
        height: 300,
        alignSelf: 'center',
    }
})


export default NewMoon
