import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native'

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
});

type Content = {
  title: string,
  body: string,
}

type Trigger = {
  hour: number,
  minute: number,
}

export const scheduleNotification = async (content: Content, trigger: Trigger) => {
    
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('dailyReminders', {
        name: 'Daily Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    await Notifications.cancelAllScheduledNotificationsAsync(); // Clear previous schedules

    await Notifications.scheduleNotificationAsync({
      content,
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: trigger.hour,
        minute: trigger.minute,
      },
    });
}

