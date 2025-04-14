import { BottomNavigationProvider } from './context/BottomNavigationContext';
import { ChapterContext, ChapterContextProvider } from './context/ChapterContex';
import { SettingContextProvider } from './context/SettingContext'
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { useContext, useEffect } from 'react';
import { Stack } from 'expo-router';
import { getStoreData, storeData } from './Utils/storage';
import { cancelAllNotification,  listenForNotificationResponse,  NotifDailyTypeProps,  scheduleNotificationDaily } from './Utils/notification';
import { separ as verseList } from './data/chapters';
import { Minus } from 'lucide-react-native';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  let [loaded, error] = useFonts({
    "Poppins-Bold": require('../assets/fonts/Poppins-Bold.ttf'),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
  });

  const chapterContext = useContext(ChapterContext)

  if (!chapterContext) {
    return null
  }

  //Schedule notification for daily verse
  const randomVersePick = () => {
    return Math.floor(Math.random() * verseList.length)
  }

  useEffect(() => {

    // listenForNotificationResponse()

    // const sheduleNotifications = async () => {

    //   const ramdomIndexDayTime = randomVersePick()
    //   const ramdomIndexNightTime = randomVersePick()

    //   const currentVerseDayTime = verseList[ramdomIndexDayTime]
    //   const currentVerseNightTime = verseList[ramdomIndexNightTime]

    //   const dayTimedata: NotifDailyTypeProps = {
    //     name: 'daily-verse-dayTime',
    //     content: {
    //       title: 'Daily Verse Day Time',
    //       body: `
    //         Chapter: ${currentVerseDayTime.chapter} verse: ${currentVerseDayTime.verse}
    //         ${currentVerseDayTime.content}
    //       `,
    //       data: {
    //         screen: 'view-chapter',
    //         verseID: ramdomIndexDayTime
    //       }
    //     },
    //     trigger: {
    //       hour: 7,
    //       minute: 0,
    //     },
    //     identifier: 'daily-verse-dayTime',
    //   }

    //   const nightTimedata: NotifDailyTypeProps = {
    //     name: 'daily-verse-nightTime',
    //     content: {
    //       title: 'Daily Verse Night Time',
    //       body: `
    //         Chapter: ${currentVerseNightTime.chapter} verse: ${currentVerseNightTime.verse}
    //         ${currentVerseNightTime.content}
    //       `,
    //       data: {
    //         screen: 'view-chapter',
    //         verseID: ramdomIndexNightTime
    //       }
    //     },
    //     trigger: {
    //       hour: 22,
    //       minute: 46,
    //     },
    //     identifier: 'daily-verse-nightTime',
    //   }
      
    //   await cancelAllNotification()

    //   scheduleNotificationDaily(dayTimedata)
    //   scheduleNotificationDaily(nightTimedata)
     
    // }

    // sheduleNotifications()

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
            <Stack.Screen 
              name="(home)/modal.tsx"
              options={{
                headerShown: true,
                presentation: 'modal'
              }}
            />
          </Stack>
        </ChapterContextProvider>
      </SettingContextProvider>
    </BottomNavigationProvider>
  )
}
