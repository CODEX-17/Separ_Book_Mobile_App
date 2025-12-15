import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { feast as feastlList } from "../../../data/feastDateList";
import { convertDateFormatIntoString } from "../../../Utils/dateUtils";

const Feast = () => {
  const [selectedMenu, setSelectedMenu] = useState(null);

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }}>
        {feastlList &&
          feastlList.map((item, index) => (
            <View key={index}>
              <Text allowFontScaling={false}>{item.name}</Text>
              {item.date && (
                <Text allowFontScaling={false}>
                  {convertDateFormatIntoString(item.dateSting)}
                </Text>
              )}
              {item.dateFrom && (
                <>
                  <Text allowFontScaling={false}>
                    {convertDateFormatIntoString(item.dateStringFrom)}
                  </Text>
                  <Text allowFontScaling={false}>
                    {convertDateFormatIntoString(item.dateStringTo)}
                  </Text>
                </>
              )}
            </View>
          ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
  },
});

export default Feast;
