import React from 'react';
import { Text } from 'react-native';


const CustomizeText = ({ content, fontSize, fontWeight }) => {

    const fontFamily = fontWeight === 'bold' ? 'Poppins_700Bold' : 'Poppins_400Regular'

    return ( 
        <Text 
            style={[
                { 
                    fontSize: fontSize || 10, 
                    fontFamily,  
                    textAlign: 'center',
                }
            ]}>{content}</Text>);
}

export default CustomizeText;
