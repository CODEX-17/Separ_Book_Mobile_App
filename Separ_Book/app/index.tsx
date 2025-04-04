import React, { useContext, useEffect } from 'react';
import { View, Image, StyleSheet, Text, ImageBackground } from 'react-native';
import CustomizeButton from './components/CustomizeButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SettingContext } from './context/SettingContext';
import COLORS from './constants/colors';


const WelcomeScreen = () => {

  const router = useRouter()

  const { objSetting } = useContext(SettingContext)
  const themeColors = objSetting.theme === 'dark' ? COLORS.dark : COLORS.light;

  const fadeAnim = useSharedValue(0);

  // Animated style for background fade effect
  const backgroundAnimation = useAnimatedStyle(() => ({
      opacity: fadeAnim.value,
      backgroundColor: themeColors.background,
  }));

  useEffect(() => {
      fadeAnim.value = 0
      fadeAnim.value = withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) });
  },[objSetting.theme])

  return (
    <Animated.View style={[styles.container, backgroundAnimation]}>
      <ImageBackground 
        source={require("../assets/images/bg-blue.jpg")}
        style={styles.background}
        resizeMode="cover"
      >
          <View style={styles.content}>
            <Image
              style={styles.image}
              source={require('../assets/images/white-logo-icon.png')}
            />

            <CustomizeButton 
              title={'Explore'} 
              icons={<Icon name="navigate-next" color="#003092" size={25}/>}
              onPress={() => router.push('/onboard')}
              width={250}
              styleButton={[{ borderRadius: 50, backgroundColor: '#fff' }]}
              styleText={{ color: '#003092' }}
            />
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.text}>@All Right Reserved 2025</Text>
          </View>
      </ImageBackground>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '90%',
    gap: 50,
  },  
  text: {
   color: '#fff',
   fontFamily: 'Poppins-Regular'
  },
  footer: {
    height: 40,
  },
  image: {
    width: 200,
    height: 200,
  }
});

export default WelcomeScreen;
