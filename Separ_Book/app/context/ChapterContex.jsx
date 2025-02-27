import { createContext, useState } from "react";

export const ChapterContext = createContext()

export const ChapterContextProvider = ({ children }) => {

    const [currentChapter, setCurrentChapter] = useState(null)

    return(
        <ChapterContext.Provider value={{ currentChapter, setCurrentChapter }}>
            { children }
        </ChapterContext.Provider>
    )
}
