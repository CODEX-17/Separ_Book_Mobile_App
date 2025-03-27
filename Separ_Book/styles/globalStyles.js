import { StyleSheet } from "react-native";

const boldFont = 'Poppins-Bold'
const regularFont = 'Poppins-Regular'
const primaryColor = '#003092'
const whiteColor = '#fff'

const globalStyles = StyleSheet.create({
    button: {
        borderRadius: 5,
        height: 50,
        width: '100%',
        backgroundColor: primaryColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontFamily: boldFont,
        fontSize: 20,
        color: whiteColor,
    },
})

export default globalStyles