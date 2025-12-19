import React, { createContext, ReactNode, useState } from "react";

export interface ChapterContextType {
  currentChapter: number | null;
  setCurrentChapter: React.Dispatch<React.SetStateAction<number | null>>;
}

interface ChapterContextProviderType {
  children: ReactNode;
}

export const ChapterContext = createContext<ChapterContextType | null>(null);

export const ChapterContextProvider: React.FC<ChapterContextProviderType> = ({
  children,
}) => {
  const [currentChapter, setCurrentChapter] = useState<number | null>(null);

  return (
    <ChapterContext.Provider value={{ currentChapter, setCurrentChapter }}>
      {children}
    </ChapterContext.Provider>
  );
};
