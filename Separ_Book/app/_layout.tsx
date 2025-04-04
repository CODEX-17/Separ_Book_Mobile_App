import { BottomNavigationProvider } from './context/BottomNavigationContext';
import { ChapterContextProvider } from './context/ChapterContex';
import { SettingContextProvider } from './context/SettingContext'
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { getStoreData, storeData } from './Utils/storage';
import { listenForNotificationResponse, scheduleNotificationDaily } from './Utils/notification';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const today = new Date(); 
  const morningTime = new Date(today.setHours(7, 0, 0, 0)).toLocaleTimeString() // Set time to 7:00 AM
  const eveningTime = new Date(today.setHours(19, 0, 0, 0)).toLocaleTimeString() // Set time to 7:00 PM

  const morningTimeStringSched = '7:00:00 AM'
  const eveningTimeStringSched = '7:00:00 PM'

  let [loaded, error] = useFonts({
    "Poppins-Bold": require('../assets/fonts/Poppins-Bold.ttf'),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
  });

  interface NotificationSchedule {
    name: ('daily-verse-dayTime' | 'daily-verse-nightTime')[];
  }

  type NotificationScheduleName = 'daily-verse-dayTime' | 'daily-verse-nightTime'


  //Schedule notification for daily verse
  const scheduleNotification = async(name: NotificationScheduleName) => {
    try {
      scheduleNotificationDaily(
        name, 
        { 
          title: 'Daily Verse', 
          body: 'Time to read your daily verse', 
        }, 
        { 
          hour: 7, 
          minute: 0 
        },
        name
      )

      //Insert schedule data to AsyncStorage
      const scheduleData: NotificationSchedule = { 
        name: [name]
      }

      await storeData('NOTIFICATION', scheduleData)

    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }

  useEffect(() => {

    const getSheduleData = async () => {

      listenForNotificationResponse()

      const schedule = await getStoreData('NOTIFICATION')
      
      if (!schedule) {
        scheduleNotification('daily-verse-dayTime')
        scheduleNotification('daily-verse-nightTime')
        return
      }

      // Check if the schedule for daily verse notifications for dayTime is already set
      if (!schedule.name.includes('daily-verse-dayTime')) {
        scheduleNotification('daily-verse-dayTime')
      }

       // Check if the schedule for daily verse notifications for nightTime is already set
      if (!schedule.name.includes('daily-verse-nightTime')) {
        scheduleNotification('daily-verse-nightTime')
      }

    }

    getSheduleData()

  },[])

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <BottomNavigationProvider>
      <SettingContextProvider>
        <ChapterContextProvider>
          <Stack screenOptions={{ headerShown: false, keyboardHandlingEnabled: true }}>
            <Stack.Screen name="index"/>
            <Stack.Screen name="onboard"/>
            <Stack.Screen name="ask-name"/>
            <Stack.Screen name="(home)"/>
            <Stack.Screen name="view-chapter"/>
            <Stack.Screen name="setting"/>
            <Stack.Screen name="(home)/(renders)/feast"/>
          </Stack>
        </ChapterContextProvider>
      </SettingContextProvider>
    </BottomNavigationProvider>
  )
}
