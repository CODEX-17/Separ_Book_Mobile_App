// lib/navigation.ts
import { router } from 'expo-router';

export function navigateToViewChapter(verseID: number) {
  router.push({
    pathname: '/view-chapter',
    params: { verseID: verseID },
  });
}
