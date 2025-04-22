import React, { useContext, useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { newMoon } from '../../../Utils/newMoonCalculation'
import COLORS from '@/app/constants/colors'
import LottieView from 'lottie-react-native';
import { SettingContext } from '@/app/context/SettingContext';
import { Eclipse, Feather } from 'lucide-react-native';
import { feast as feastlList } from '../../../data/feastDateList'
import { convertDateFormatIntoString } from '../../../Utils/dateUtils'

const Calendar = () => {

    const dateList = newMoon()
    const currentDate = new Date().getMonth()

    const settingContext = useContext(SettingContext)

    if (!settingContext) {
        return null
    }

    const { objSetting } = settingContext

    const themeColors = objSetting.theme === 'dark' ? COLORS.dark : COLORS.light;

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [selectedMenu, setSelectedMenu] = useState<string>('New Moon')

    useEffect(() => {

        setIsLoading(true)

        setTimeout(() => {
            setIsLoading(false)
        }, 3000)

    },[selectedMenu])

    const menuList = [
        { 
            name: 'New Moon', 
            icon: (isActive: boolean) => <Eclipse  color={isActive ? COLORS.white : themeColors.primaryText} size={20}/>,
            description: `1View monthly new moon dates to easily determine the exact time for observing the New Moon Sabbath.`
        },
        { 
            name: 'Feast', 
            icon: (isActive: boolean) => <Feather  color={isActive ? COLORS.white : themeColors.primaryText} size={20}/>,
            description: `View annual biblical feast dates to easily determine the exact time for observing Alyon appointed festivals.`
        },
    ]

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 2000)

        return () => clearTimeout(timer)
    },[])

    return (
        <View style={styles.container}>
            <View style={{ width: '100%', alignItems: 'center', marginBottom: 10 }}>
                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', gap: 20,  marginTop: 10 }}>
                    {
                        menuList.map((item, index) => {
                            const isActive = selectedMenu === item.name
                            return(
                                <TouchableOpacity key={index} onPress={() => setSelectedMenu(item.name)}>
                                    <View 
                                        style={[styles.btnMenu, {
                                            backgroundColor: isActive ? themeColors.highlight : themeColors.card
                                        }]}
                                    >
                                        {item.icon(isActive)}
                                        <Text style={[styles.title, { color:  isActive ? COLORS.white : themeColors.primaryText }]}>{item.name}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }
                   

                </View>
            </View>
            <View style={{ width: '100%', marginBottom: 20, alignItems: 'center' }}>
                <Text style={[styles.title, { color: themeColors.primaryText }]}>{selectedMenu} Date List</Text>
                <Text style={[styles.subtitle, { color: themeColors.secondaryText }]}>{menuList[selectedMenu === 'New Moon' ? 0 : 1].description}</Text>
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

                                selectedMenu === 'Feast' ?

                                feastlList.map((item, index) => {

                                    const date = item.dateStringFrom ? item.dateStringFrom : item.dateSting
                                    const isCurrentFeast = date && (parseInt(date.substring(5,7)) === currentDate - 1 ? true : false)

                                    return(
                                        <View 
                                            key={index} 
                                            style={[
                                                styles.card, 
                                                { backgroundColor: themeColors.card, borderColor: themeColors.border }, 
                                                isCurrentFeast && 
                                                    { backgroundColor: themeColors.activeCard, borderColor: themeColors.border }
                                            ]}>
                                            <Text style={[styles.textDate, { color: themeColors.primaryText }]}>{item.name}</Text>
                                            <Text style={[styles.textTime, { color: themeColors.primaryText }]}>{          
                                                item.dateStringFrom ? 
                                                    `${convertDateFormatIntoString(item.dateStringFrom)} - ${convertDateFormatIntoString(item.dateStringTo)}` 
                                                    : convertDateFormatIntoString(item.dateSting)
                                            }</Text>
                                            {isCurrentFeast && <Text style={[styles.textTime, { color: themeColors.secondaryText }]}>(current new moon)</Text>}
                                        </View>
                                        )
                                })

                                :
                                
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
        backgroundColor: 'transparent',
        paddingTop: 0,
        padding: 20,
    },
    btnMenu: {
        backgroundColor: 'red',
        width: 150,
        height: 40,
        borderRadius: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 10,
    },
    card: {
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        borderWidth: 1,
        marginBottom: 10,
    },
    textDate: {
        fontSize: 15,
        fontFamily: 'Poppins-Bold',
    },
    textTime: {
        fontSize: 13,
        fontFamily: 'Poppins-Regular',
    },
    title: {
        fontSize: 15,
        fontFamily: 'Poppins-Bold',
    },
    subtitle: {
        fontSize: 13,
        fontFamily: 'Poppins-Regular',
        textAlign: 'center',
    },
    loading: {
        width: 300,
        height: 300,
        alignSelf: 'center',
    }
})


export default Calendar
