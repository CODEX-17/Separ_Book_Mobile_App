import React from 'react';
import { View, Image, StyleSheet, Text, ImageBackground } from 'react-native';
import CustomizeButton from './components/CustomizeButton';
import Icon from 'react-native-vector-icons/MaterialIcons';


const WelcomeScreen = ({ navigation }) => {
  return (
    <ImageBackground 
      source={require("../assets/images/bg-blue.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      
      <View style={styles.container}>
        <View style={styles.content}>
          <Image
            style={styles.image}
            source={require('../assets/images/react-logo.png')}
          />

          <CustomizeButton 
            title={'Explore'} 
            icons={<Icon name="navigate-next" color="#003092" size={25}/>}
            onPress={() => navigation.navigate('onboard')}
            width={250}
            styleButton={[{ borderRadius: 50, backgroundColor: '#fff' }]}
            styleText={{ color: '#003092' }}
          />
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.text}>@All Right Reserved 2025</Text>
        </View>

      </View>
    </ImageBackground>
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
   fontFamily: 'Poppins_400Regular'
  },
  footer: {
    height: 40,
  }
});

export default WelcomeScreen;
