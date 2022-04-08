import {
    StyleSheet,
    Dimensions
} from 'react-native';
const {height, width} = Dimensions.get('window');
import * as colors from './colors';
import * as sizes from './sizes';

export default commonStyles = StyleSheet.create({
    shedowAndElivation:{
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
    },
    mainContainer: {
        flex: 1,
        height: height,
        backgroundColor: "#fff",
        alignItems: 'center',
        justifyContent: "center",
    },
    navigationButtonsContainer:{
        width: '80%',
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    navigationButton:{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
        borderRadius: 10,
        height: sizes.buttonHeight,
        width: '100%',
        marginTop: 20
    },
    navigationButtonText: {
        fontSize: sizes.large,
        color: colors.tintColor,
        fontWeight: 'bold'
    },
    textStyle:{
        color: '#000',
        fontSize: sizes.medium,
        textAlign: 'center',
        fontSize:13,
    },
    forminputContainer: {
        width: "80%",
        height: 55,
        borderBottomColor: '#fff',
        borderBottomWidth: 0.5,
        justifyContent: 'center',
    },
    inputText: {
        fontSize: 14,
        color: '#fff',
        width: '90%',
        height: 40,
    },
    imageStyle:{
        resizeMode: 'contain',
        width: "100%",
        height: "100%",
    }
});
