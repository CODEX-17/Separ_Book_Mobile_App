import { separ as chapters } from '../data/chapters'

export const getChapter = (chapter, verse) => {

    const selectedIndex = chapters.findIndex((data) => data.chapter === chapter && data.verse === verse)

    const result = chapters.filter((data) => data.chapter == chapter && data.verse == verse)

    return result ? { index:selectedIndex, content: result[0] } : null
}