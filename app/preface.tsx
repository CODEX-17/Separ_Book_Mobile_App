import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import COLORS from "./constants/colors";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useRouter } from "expo-router";

const Preface = () => {
  const [contentIndex, setContentIndex] = useState<number>(0);
  const router = useRouter();
  const contentList = [
    {
      title: "Preface",
      description: `Ang salitang “SEPAR” ay hango sa salitang Hebreo na “SEFER” at sa ancient Aramaic Hebrew na “SEPHAR” na ang ibig sabihin ay “AKLAT” o “BOOK”; ang Banal na Aklat na ito ay tinatawag na SEPAR NI YAHUWEH sapagkat ang mga mensaheng nilalaman nito ay mga dalisay na salita ng Dakilang Maylikha na si YAHUWEH, na Kanyang ipinasulat sa Kanyang Sugong Propeta sa kapanahunan na si Datu Aliyahu sa pamamagitan ng patnubay at kaisahan ng Banal na Espiritu o Ruach HaQudesh, at nabuo ang aklat na ito sa loob ng pitong taon; ang Dakilang Maylikha ay hindi nagbabago ng Kanyang pamamaraan sapagkat sa bawat kapanahunan Siya ay nagpapahayag ng Kanyang kalooban sa mga taong Kanyang pinili sa pamamagitan ng Kanyang mga Propeta—minsan ay tuwirang ipinapahayag at minsan naman ay ipinasusulat upang iparating sa mga pinili; sa bawat panahon ay may mga Tunay na Mananamba ang Dakilang Maylikha na Kanyang pinapatnubayan sa pamamagitan ng Kanyang Dalisay na Salita na ipinahahayag ng Kanyang Sugong Propeta; sa ating panahon ay mahalaga ang bagong pahayag ng mga Mensahe ng Dakilang Maylikha sapagkat ang ilang sinaunang mensahe na nasulat sa Biblia ay nadungisan ng mga huwad na relihiyon sa pamamagitan ng maling pagsasalin ng mga Bible translator na nagbunga ng mga kontradiksyon at maling aral na nagpaligaw sa maraming tao, kaya’t bagaman may ilang katotohanan pa ring nananatili sa Biblia na dapat suriin at ipaliwanag ng Sugong Propeta sa kapanahunan, naririto ngayon ang “Mga Dalisay na Salita ng Alyon YAHUWEH” na ibinibigay Niya sa Kanyang mga Pinili na may takot sa Kanya at sumasamba sa Kanyang Banal na Pangalan YHWH, na ipinasulat sa Kanyang Sugong Propeta; ang Banal na Separ ni YHWH ang siyang pinakadakilang Liwanag at Gabay ng Kanyang mga Tunay na Mananamba sa ikaliliwanag at ikatatatag ng kanilang pananampalataya tungo sa ganap na kalooban ng Alyon YAHUWEH at sa buhay na pag-asa na makapasok sa Paraiso ng Langit; MAPALAD ANG MGA NANINIWALA AT NAGSASAGAWA NG MGA NAKASULAT SA AKLAT NA ITO SAPAGKAT MALAPIT NA ANG PAGDATING AT PAGPAPAHAYAG SA MGA KALANGITAN NG DAKILANG MAYLIKHA NA SI YAHUWEH AT NG KANYANG SUGONG MESSIAH YAHUSHUA. YADAH! OHAYAH!`,
    },
    {
      title: "Babala",
      description: `
1.) Ang Banal na Aklat na ito ay hindi ipinagbibili, at hindi pinahihintulutan ang sinuman na ito’y gayahin o ipa-xerox nang walang pahintulot sa pamunuan ng Atyaryahu Yahwism Tribe, ang maaaring magkaroon ng Aklat na ito ay ang mga naitalagang mga Kohen, mga Elder at mga malalago sa spiritual na mga membro ng Atyaryahu lamang, sila ang mga naatasan na magsa-salin, mangaral at magpaliwanag ng mga mensahe na nilalaman ng Aklat na ito sa mga mananamba ng Alyon YAHUWEH, ang mga mensahe sa Aklat na ito ay maaaring e-print sa papel o i-tarap at ilagya sa mga dingding upang maging paalala sa mga mananamba ng Alyon YAHUWEH.

2.) Ipinagbabawal sa mga hindi kaanib ng Atyaryahu na magkaroon ng kopya ng Aklat na ito. Ang ano mang pag-angkin ng sinuman na may dumaon o may roon din silang kopya ng Aklat na ito, ay ituturing na huwad at pang-gagaya lamang, at maaari silang kasuhan o kumpiskahin ang nasabing libro.

Ang Banal na Aklat na ito ay hindi para sa lahat ng tao, kundi ito’y para lamang sa mga may Takot sa Dakilang Maylikha at nagmamahal at sumasamba sa kanyang Banal na Pangalan YAHUWEH.

Ang Banal na Aklat na ito ay katuparan ng propesiya sa MALAKIAS 3:16 at ISAIAS 34:16`,
    },
  ];

  return (
    <View style={styles.container}>
      <Text allowFontScaling={false} style={styles.title}>
        {contentList[contentIndex].title}
      </Text>
      <Text allowFontScaling={false} style={styles.description}>
        {contentList[contentIndex].description}
      </Text>
      <View style={{ flexDirection: "row", gap: 10 }}>
        {contentIndex > 0 && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => setContentIndex((prev) => prev - 1)}
          >
            <Icon name="navigate-before" color={COLORS.white} size={20} />
            <Text
              allowFontScaling={false}
              style={{
                fontSize: 12,
                color: COLORS.white,
                fontFamily: "Poppins-Bold",
              }}
            >
              Prev
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (contentIndex === contentList.length - 1) {
              router.push("/onboard");
            } else {
              setContentIndex((prev) => prev + 1);
            }
          }}
        >
          <Text
            allowFontScaling={false}
            style={{
              fontSize: 12,
              color: COLORS.white,
              fontFamily: "Poppins-Bold",
            }}
          >
            {contentIndex === contentList.length ? "Finish" : "Next"}
          </Text>
          <Icon name="navigate-next" color={COLORS.white} size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
  },
  description: {
    fontSize: 10,
    color: COLORS.black,
    fontFamily: "Poppins-Regular",
    textAlign: "justify",
  },
  button: {
    width: 100,
    height: 40,
    flexDirection: "row",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.blue,
    marginTop: 20,
  },
});

export default Preface;
