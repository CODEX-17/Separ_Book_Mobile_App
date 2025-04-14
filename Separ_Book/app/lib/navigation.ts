// lib/navigation.ts
import { router } from 'expo-router';
import { DataParams } from '../Utils/notification';

export function navigateToViewChapter(verseID: number) {
  router.push({
    pathname: '/view-chapter',
    params: { verseID: verseID },
  });
}
