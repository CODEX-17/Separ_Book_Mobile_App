import React, { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import Icon from "react-native-vector-icons/Feather";
import COLORS from "@/app/constants/colors";
import { SettingContext } from "@/app/context/SettingContext";
import { MUSIC_SOUNDS } from "@/app/data/musicSounds";

const Music = () => {
  const settingContext = useContext(SettingContext);
  const [previewSoundId, setPreviewSoundId] = useState<string | null>(null);

  if (!settingContext) return null;

  const { objSetting, handleChangeSetting } = settingContext;
  const themeColors = objSetting.theme === "dark" ? COLORS.dark : COLORS.light;
  const selectedSoundId = objSetting.musicSound ?? MUSIC_SOUNDS[0].id;
  const selectedSound =
    MUSIC_SOUNDS.find((sound) => sound.id === selectedSoundId) ??
    MUSIC_SOUNDS[0];
  const previewSound =
    MUSIC_SOUNDS.find((sound) => sound.id === previewSoundId) ?? null;
  const player = useAudioPlayer(previewSound?.source ?? null);
  const playerStatus = useAudioPlayerStatus(player);

  useEffect(() => {
    if (!previewSoundId) return;
    player.loop = true;
    player.play();
    return () => {
      player.pause();
    };
  }, [player, previewSoundId]);

  const handleSelectSound = (soundId: string) => {
    handleChangeSetting({ ...objSetting, musicSound: soundId });
  };

  const handlePreview = (soundId: string) => {
    if (previewSoundId === soundId && playerStatus.playing) {
      player.pause();
      return;
    }

    setPreviewSoundId(soundId);
    if (previewSoundId === soundId) {
      player.play();
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.heading}>
        <View
          style={[styles.headingIcon, { backgroundColor: themeColors.primary }]}
        >
          <Icon name="music" size={22} color={COLORS.white} />
        </View>
        <View style={styles.headingText}>
          <Text
            allowFontScaling={false}
            style={[styles.title, { color: themeColors.primaryText }]}
          >
            Available Sounds
          </Text>
          <Text
            allowFontScaling={false}
            style={[styles.subtitle, { color: themeColors.secondaryText }]}
          >
            Pumili ng tunog na gagamitin sa music control.
          </Text>
        </View>
      </View>

      {MUSIC_SOUNDS.map((sound) => {
        const isSelected = selectedSound.id === sound.id;
        const isPlaying = previewSoundId === sound.id && playerStatus.playing;

        return (
          <View
            key={sound.id}
            style={[
              styles.soundCard,
              {
                backgroundColor: themeColors.card,
                borderColor: isSelected
                  ? themeColors.primary
                  : themeColors.border,
              },
            ]}
          >
            <View
              style={[
                styles.soundIcon,
                { backgroundColor: themeColors.activeCard },
              ]}
            >
              <Icon name="headphones" size={21} color={themeColors.primary} />
            </View>
            <View style={styles.soundInfo}>
              <Text
                allowFontScaling={false}
                style={[styles.soundName, { color: themeColors.primaryText }]}
              >
                {sound.name}
              </Text>
              <Text
                allowFontScaling={false}
                style={[
                  styles.soundDescription,
                  { color: themeColors.secondaryText },
                ]}
              >
                {sound.description}
              </Text>
              {isSelected && (
                <View style={styles.selectedLabel}>
                  <Icon name="check-circle" size={13} color={themeColors.primary} />
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.selectedText,
                      { color: themeColors.primary },
                    ]}
                  >
                    Selected · Napili
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.soundActions}>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={isPlaying ? "Pause sound preview" : "Preview sound"}
                onPress={() => handlePreview(sound.id)}
                style={[
                  styles.iconButton,
                  { borderColor: themeColors.border },
                ]}
              >
                <Icon
                  name={isPlaying ? "pause" : "play"}
                  size={17}
                  color={themeColors.primary}
                />
              </TouchableOpacity>
              {!isSelected && (
                <TouchableOpacity
                  accessibilityRole="button"
                  onPress={() => handleSelectSound(sound.id)}
                  style={[
                    styles.selectButton,
                    { backgroundColor: themeColors.primary },
                  ]}
                >
                  <Text
                    allowFontScaling={false}
                    style={styles.selectButtonText}
                  >
                    Use
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    gap: 14,
  },
  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 18,
  },
  headingIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
  headingText: {
    flex: 1,
  },
  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
  },
  subtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 2,
  },
  soundCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 14,
    gap: 11,
    marginBottom: 2,
  },
  soundIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  soundInfo: {
    flex: 1,
  },
  soundName: {
    fontFamily: "Poppins-Bold",
    fontSize: 15,
  },
  soundDescription: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    marginTop: 1,
  },
  selectedLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 5,
  },
  selectedText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 10,
  },
  soundActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  selectButton: {
    borderRadius: 18,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  selectButtonText: {
    color: COLORS.white,
    fontFamily: "Poppins-Bold",
    fontSize: 11,
  },
});

export default Music;
