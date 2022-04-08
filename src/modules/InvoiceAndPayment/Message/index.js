import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
} from 'react-native';
// import Preference from 'react-native-preference';
import * as colors from '../../../styles/colors';
import * as sizes from '../../../styles/sizes';
import commonStyles from '../../../styles/commonStyles';
import Header from '../../../components/Header';

export default class Message extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        }
    }

    leftAction(){
        this.props.navigation.goBack();
    }

    render() {
        return (
            <SafeAreaView style={{flex: 1, backgroundColor:colors.white}}>
                <Header
                    headerText={
                        <Text style={[commonStyles.textStyle,{fontSize: sizes.extraMediumLarge}]}>
                            {"MESSAGE"}
                        </Text>
                    }
                    leftAction={this.leftAction.bind(this)}
                    leftIcon={require('../../../assets/icons/back.png')}
                    navigation={this.props.navigation}
                />
                <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={commonStyles.textStyle}>{"Not Designed Yet!"}</Text>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    groupStyle:{
        marginTop:40,
        width: '90%', 
        justifyContent: 'space-around',
        flexDirection: 'row', 
        alignItems: 'center',
    },
    buttonImageStyle:{
        width: 120,
        height: 80,
        alignItems: 'center'
    }
});
