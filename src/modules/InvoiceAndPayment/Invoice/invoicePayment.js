import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
    Text,
    View,
    TouchableOpacity,
    ScrollView,Linking,
    SafeAreaView, FlatList, Dimensions,
} from 'react-native';
import * as colors from '../../../styles/colors';
import * as sizes from '../../../styles/sizes';
import commonStyles from '../../../styles/commonStyles';
import Header from '../../../components/Header';
import ProgressBar from "../../../components/ProgressBar";
import AvatarComponent from "../../../components/AvatarComponent";
import Preference from "react-native-preference";
import {constants} from "../../../Utils/constants";
import moment from "moment";
import {WebView} from "react-native-webview";
const {height, width} = Dimensions.get('window');
export default class Invoice extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            msg:""
        }
    }
    componentDidMount() {
        this.showWebView()
    }
    showWebView(){
        this.setState({ loading: true })
        let formdata = new FormData();
        formdata.append("std_id", Preference.get('user_id'))
        fetch(constants.get_paynow_instruction, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: formdata
        }).then(response => response.json())
            .then(response => {
                this.setState({ loading: false })
                if (response.code === 200) {
                  this.setState({msg:response.data})
                } else {

                }
            })
            .catch(error => {
                this.setState({ loading: false })
                console.log('ResponseError:', error);

            });
    }

    

    leftAction() {
        this.props.navigation.goBack();
    }

    render() {
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
                <Header
                    headerText={
                        <Text style={[commonStyles.textStyle, {fontSize: sizes.extraMediumLarge}]}>
                            {"MAKE PAYMENT"}
                        </Text>
                    }
                    leftAction={this.leftAction.bind(this)}
                    leftIcon={require('../../../assets/icons/back.png')}
                    navigation={this.props.navigation}
                />
                    <View style={{width: '100%',height:height-50,backgroundColor:"red"}}>
                    

                        <WebView
                            originWhitelist={['*']}
                            style={{
                                flexGrow:1,
                                width: '100%',
                            }}
                            useWebKit={true}
                            onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
                            ref={(ref) => { this.webview = ref; }}
                            onNavigationStateChange={(event) => {
                                if (event.url !== "www.google.com") {
                                    if(Platform.OS==="android")
                                    {
                                    }else{
                                            Linking.openURL(event.url);
                                    }
                                
                                }
                            }}
                            source={{
                                html: '<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body><p>' + this.state.msg + '</p></body></html>',
                                baseUrl: ''
                            }}/>
                    </View>
                
                <ProgressBar visible={this.state.loading}/>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    groupStyle: {
        marginTop: 40,
        width: '90%',
        justifyContent: 'space-around',
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonImageStyle: {
        width: 120,
        height: 80,
        alignItems: 'center'
    },
    itemContainerStyle: {
        flexDirection: 'row',
        borderRadius: 20,
        padding: 25,
        borderLeftColor: '#77cc31',
        backgroundColor: colors.white,
        borderLeftWidth: 5,
        alignItems: 'center',
        width: '94%'
    },
    buttonStyle: {
        width: '80%',
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        marginTop: 10
    }
});
