import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native'
import { getStoreData, storeData } from './storage';
import { NotificationStoreDataType, TabsRoutes } from '../types/type';
import { navigateToViewChapter } from '../lib/navigation';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
});

export type DataParams = {
  screen: string,
  verseID: number,
}

type Content = {
  title: string,
  body: string,
  data: DataParams,
}

type TriggerDaily = {
  hour: number,
  minute: number
}

export interface NotifDailyTypeProps {
  name: string,
  content: Content,
  trigger: TriggerDaily,
  identifier: string,
}

export const cancelAllNotification = async (): Promise<void> => {
  await Notifications.cancelAllScheduledNotificationsAsync()
}


export const scheduleNotificationDaily = async (notifData: NotifDailyTypeProps) => {

    console.log(notifData)

    const schedule: NotificationStoreDataType  = await getStoreData('NOTIFICATION')

    const updatedSchedule = schedule ?? []

    if (!schedule) {
      updatedSchedule.push(notifData.identifier)
    }else {
      updatedSchedule.push(notifData.identifier)
    }

    await storeData('NOTIFICATION', updatedSchedule)
    
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(notifData.name, {
        name: notifData.name,
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    await Notifications.scheduleNotificationAsync({
      content: notifData.content,
      trigger: {
        type:  Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: notifData.trigger.hour,
        minute: notifData.trigger.minute,
      },
    });

}

// export const scheduleNotificationDate = async (name: string, content: Content, date: Date) => {
    
//   if (Platform.OS === 'android') {
//     await Notifications.setNotificationChannelAsync(name, {
//       name,
//       importance: Notifications.AndroidImportance.HIGH,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }

//   await Notifications.scheduleNotificationAsync({
//     content,
//     trigger: {
//       type:  Notifications.SchedulableTriggerInputTypes.DATE,
//       date,
//     },
//   });

// }

// Function to listen for notification responses and remove scheduled time from AsyncStorage

export const listenForNotificationResponse = async () => {

  const schedule: NotificationStoreDataType = await getStoreData('NOTIFICATION')

  if (!schedule) {
    return null
  }
  
  Notifications.addNotificationResponseReceivedListener(async (response) => {

    const data = response.notification.request.content.data

    console.log('Tapped data:', data);

    if (data?.screen === 'view-chapter' && data.verseID) {
      navigateToViewChapter(data.verseID);
    }

    const updatedSchedule = schedule.filter((item) => item !== response.notification.request.identifier)
    
    await storeData('NOTIFICATION', updatedSchedule);

  })

 
}

