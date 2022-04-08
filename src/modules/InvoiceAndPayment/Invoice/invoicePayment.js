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
// import Preference from 'react-native-preference';
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
        // this.props.navigation.state.params.JSON_ListView_Clicked_Item
    }
    showWebView(){
        this.setState({ loading: true })
        let formdata = new FormData();
        formdata.append("std_id", Preference.get('user_id'))
        console.log(Preference.get('user_id'),constants.get_paynow_instruction)
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
        //let data=this.state.invoicesDetail;
        //console.log("data::"+JSON.stringify(data));
        //let instructions=data.fuck;
        //console.log("data2::"+JSON.stringify(instructions));
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
                                //backgroundColor: "#F2F2F2",
                                //backgroundColor: "pink",
                               //height:400
                            }}
                            useWebKit={true}
                            onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
                            ref={(ref) => { this.webview = ref; }}
                            onNavigationStateChange={(event) => {
                                if (event.url !== "www.google.com") {
                                    if(Platform.OS==="android")
                                    {
                                        // this.webview.stopLoading();
                                        //Linking.openURL(event.url);
                                    }else{
                                            //this.webview.stopLoading();
                                            Linking.openURL(event.url);
                                    }
                                
                                }
                            }}
                            //onShouldStartLoadWithRequest={this.openExternalLink}
                            source={{
                                html: '<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body><p>' + this.state.msg + '</p></body></html>',
                                baseUrl: ''
                            }}/>


                            {/* <Text style={{fontSize: 15, color: "#000",marginBottom:20,fontWeight:"bold",}}>{"METHOD 1 & METHOD 2 are preferred \n"}</Text>
                            <Text style={{fontWeight:"bold",fontSize:15}}>{"Method 1"}</Text><Text>{"(PAY BY INTERNET TRANSFER – PAYNOW - Recommended)\n" +
                            "Step 1: Login to your internet banking\n" +
                            "Step 2: Pay the outstanding amount to mobile number 91001235.\n" +
                            "Step 3: Include student’s name, school and level and subject of student clearly in remarks.\n" +
                            "Step 4: Print screen confirmation page and email to admin@pmc.sg. \n" +
                            "All steps must be completed so that the finance will need the information to submit payment manually to your account. \n" +
                        "\n" }</Text>
                            <Text style={{fontWeight:"bold",fontSize:15}}>{"Method 2"}</Text><Text>{"(PAY BY INTERNET TRANSFER – MANUAL)\n" +
                            "Step 1: Login to your internet banking\n" +
                            "Step 2: Pay the outstanding amount to OCBC Savings Account 687-399253-001 - The Physics Cafe Ptd Ltd - Bank Code (7339) - Branch Code (687)\n" +
                            "Step 3: Include student’s name, school and level and subject of student clearly in remarks.\n" +
                            "Step 4: Print screen confirmation page and email to admin@pmc.sg. \n" +
                            "All steps must be completed so that the finance will need the information to submit payment manually to your account. \n" +
                            "\n" }</Text> */}
                       {/* <Text style={{fontWeight:"bold",fontSize:15}}>{"Method 3"}</Text><Text>{"(PAY BY CASH OR CHEQUE BY STUDENT 45 MINS BEFORE LESSON)\n" +
                            "*Gently reminder to whom making payment by CHEQUE, kindly screen shoot the cheque details and whatsapp to mobile number 91001235, 7 days before the lesson, to be verified by our Accounting Department.\n" +
                            "Step 1: Arrive 45 minutes before the lesson starts to make payment by cash or cheque. \n" +
                            "Step 2: Parents should not submit the cheque on behalf of the student as the school only allow entry to registered students.\n" +
                        "\n" }</Text>
                        <Text style={{fontWeight:"bold",fontSize:15}}>{"Method 4"}</Text><Text>{"(MAIL THE CHEQUE)\n" +
                            "*Gently reminder: Please be kindly screen shoot the cheque details and whatsapp to mobile number 91001235, before you posting the cheque, to be verified by our Accounting Department.\n" +
                            "Prepare the cheque according to the invoice and post the cheque to Admission Office at 10 Eunos Road 8 Singapore Post Centre #01-207 S(408600).\n" +
                            "\n" +
                            "Note: \n" +
                            "\n" +
                            "1)All payment or notifications of payment must be received before the first lesson of invoice so that the student will be able to mark their attendance via the automated system. \n" +
                            "\n" +
                            "2)E-Receipt will be issued within 7 working days upon receiving payment. Kindly contact us if receipt is not issued.\n" +
                            "\n" +
                            "3) There are no NETS or Credit Card terminal at the centres."}</Text>*/}
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
        // justifyContent: 'center',
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
