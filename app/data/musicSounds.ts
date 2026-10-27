const SOUND_ASSETS = [
  {
    filename: "relaxing.mp3",
    source: require("../../assets/sound/relaxing.mp3"),
  },
  {
    filename: "cleared.mp3",
    source: require("../../assets/sound/cleared.mp3"),
  },
  {
    filename: "meditaion.mp3",
    source: require("../../assets/sound/meditaion.mp3"),
  },
  {
    filename: "healing.mp3",
    source: require("../../assets/sound/healing.mp3"),
  },
] as const;

const getSoundName = (filename: string) =>
  filename
    .replace(/\.[^/.]+$/, "")
    .replace(/^./, (character) => character.toUpperCase());

export const MUSIC_SOUNDS = SOUND_ASSETS.map((sound) => ({
  ...sound,
  id: sound.filename.replace(/\.[^/.]+$/, ""),
  name: getSoundName(sound.filename),
  description: sound.filename,
}));
