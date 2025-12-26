import { ranks } from "../data/ranking";

export const findingRankStatus = (userLevel: any) => {
  // Default to the lowest rank
  let currentRank = ranks[0];

  for (const rank of ranks) {
    if (userLevel >= rank.level) {
      currentRank = rank;
    } else {
      break;
    }
  }

  return currentRank.title;
};

export const rankMapping = (rankStatus: string) => {
  if (!rankStatus) return null;

  const rankImages: Record<string, any> = {
    Newcomer: require("../../assets/images/ranks/ranks1.png"),
    Seeker: require("../../assets/images/ranks/ranks2.png"),
    Listener: require("../../assets/images/ranks/ranks3.png"),
    Learner: require("../../assets/images/ranks/ranks4.png"),
    Reader: require("../../assets/images/ranks/ranks5.png"),
    Follower: require("../../assets/images/ranks/ranks6.png"),
    Disciple: require("../../assets/images/ranks/ranks7.png"),
    Messenger: require("../../assets/images/ranks/ranks8.png"),
    Scribe: require("../../assets/images/ranks/ranks9.png"),
    Believer: require("../../assets/images/ranks/ranks10.png"),
    Preacher: require("../../assets/images/ranks/ranks11.png"),
    Elder: require("../../assets/images/ranks/ranks12.png"),
    Shepherd: require("../../assets/images/ranks/ranks13.png"),
    Guardian: require("../../assets/images/ranks/ranks14.png"),
    Sage: require("../../assets/images/ranks/ranks15.png"), // Wisdom Bearer
    Wordmaster: require("../../assets/images/ranks/ranks16.png"), // Master of the Word
    Luminary: require("../../assets/images/ranks/ranks17.png"), // Light Bringer
    Covenantor: require("../../assets/images/ranks/ranks18.png"), // Covenant Keeper
    Theologian: require("../../assets/images/ranks/ranks19.png"), // Divine Scholar
    Herald: require("../../assets/images/ranks/ranks20.png"), // Heaven’s Herald
    Witness: require("../../assets/images/ranks/ranks21.png"), // Eternal Witness
  };

  return rankImages[rankStatus];
};
