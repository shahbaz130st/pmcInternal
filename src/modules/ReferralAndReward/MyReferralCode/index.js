import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    Text,
    View,
    TouchableOpacity,
    ScrollView, Linking,
    SafeAreaView, Alert,
} from 'react-native';
// import Preference from 'react-native-preference';
import * as colors from '../../../styles/colors';
import * as sizes from '../../../styles/sizes';
import commonStyles from '../../../styles/commonStyles';
import Header from '../../../components/Header';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { constants } from "../../../Utils/constants";
import Preference from "react-native-preference";
import ProgressBar from '../../../components/ProgressBar';
import { WebView } from 'react-native-webview';

export default class MyReferralCode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            showEarnReward: false,
            myRefferralCode: "",
        }
    }

    componentDidMount() {
        this.getRefferal()
    }

    getRefferal() {
        this.setState({ loading: true })
        let formdata = new FormData();
        formdata.append("student_id", Preference.get('user_id'))
        fetch(constants.refferalReward, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: formdata
        }).then(response => response.json())
            .then(response => {
                this.setState({ loading: false })
                console.log("refferalReward---->", "-" + JSON.stringify(response));
                if (response.code == 200) {
                    this.setState({
                        myRefferralCode: response.data,
                        msg: "My refferal code for PMC.SG is " + response.data,
                        description: response?.message?.referall_message
                    })
                } else {
                    Alert.alert("Server Error!", "Please try again.")
                }
            })
            .catch(error => {
                this.setState({ loading: false })
                console.log('student_id', Preference.get('user_id'))
                console.log('onMyCourseTabResponseError:', error);

            });
    }

    leftAction() {
        this.props.navigation.goBack();
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
                <Header
                    headerText={
                        <Text style={[commonStyles.textStyle, { fontSize: sizes.extraMediumLarge }]}>
                            {"REFERRAL & REWARD"}
                        </Text>
                    }
                    leftAction={this.leftAction.bind(this)}
                    leftIcon={require('../../../assets/icons/back.png')}
                    navigation={this.props.navigation}
                />
                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps='handled'
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    //contentContainerStyle={{height: '100%'}}
                    style={{ flex: 1, width: "100%" }}>
                    <View style={{ height: '100%', alignItems: 'center' }}>
                        <View style={{ width: "100%", height: 100, alignItems: "center" }}>
                            <Image source={require("../../../assets/images/refferalreward.png")}
                                style={{ height: 100, resizeMode: "contain" }} />
                        </View>

                        {this.state.description && (
                            <View style={{ width: "90%" }}>
                                <WebView
                                    originWhitelist={['*']}
                                    style={{
                                        width: '100%',
                                        // backgroundColor: "#F2F2F2",
                                        height: 250
                                    }}
                                    useWebKit={true}
                                    onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}

                                    //onShouldStartLoadWithRequest={this.openExternalLink}
                                    source={{
                                        html: '<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body><p>' + this.state.description + '</p></body></html>',
                                        baseUrl: ''
                                    }} />
                                <TouchableOpacity style={{ alignItems: "flex-end" }} onPress={()=>{this.props.navigation.navigate("MyReferralCodeWebViewDisplay")}}>
                                    <Text>
                                        Read more
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* <View style={styles.groupStyle}>
                            <Text style={{
                                color: "#DA7A00",
                                fontSize: 20,
                                textAlign: 'center',
                            }}>{'SPECIAL MARCH / APRIL PROMOTION (1 MAR TO 30 APR)'}</Text>
                        </View>

                        <View style={styles.groupStyle}>
                            <Text style={{
                                color: "grey",
                                fontSize: 18,
                                textAlign: 'center',
                            }}>{'Earn $20 PMC currency now! Refer a Friend using your unique code. Both you and your friend will receive $10 PMC Currency each. $10 will be given instantly upon online registration with your referral code. We all love win-win situations, so why not treat and help a friend out who is in need of an extra boost in Physics, Math & Chemistry ! '}</Text>
                        </View> */}

                        <View style={styles.groupStyle}>
                            <Text style={{
                                color: "#000",
                                fontSize: 20,
                                textAlign: 'center',
                                fontWeight: "bold",
                                marginTop: 10
                            }}>{'YOUR REFERRAL CODE'}</Text>
                        </View>
                        <View style={{
                            borderWidth: 5,
                            borderColor: "#DADADA",
                            alignItems: 'center',
                        }}>
                            <Text style={{
                                color: "#000",
                                fontSize: 30,
                                textAlign: 'center',
                                fontWeight: "bold",
                                margin: 15
                            }}>{this.state.myRefferralCode}</Text>
                        </View>

                        <View style={styles.groupStyle}>
                            <Text style={{
                                color: "#79B3BE",
                                fontSize: 20,
                                textAlign: 'center',
                                fontWeight: "bold",
                                marginTop: 10
                            }}>{'SHARE'}</Text>
                        </View>

                        <View style={styles.groupStyle}>
                            <TouchableOpacity onPress={() => {
                                //Linking.openURL("whatsapp://send?text='this.state.msg'")
                                Linking.openURL('whatsapp://send?text=' + this.state.msg).then((data) => {
                                    console.log('WhatsApp Opened');
                                }).catch(() => {
                                    alert('Make sure Whatsapp installed on your device');
                                });
                            }}>
                                <Image source={require("../../../assets/images/social/whatsapp.png")}
                                    style={{ height: 40, resizeMode: "contain" }} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => Linking.openURL("https://www.facebook.com/sharer.php?u=http://thephysicscafe.com")}>
                                <Image source={require("../../../assets/images/social/fb.png")}
                                    style={{ height: 40, resizeMode: "contain" }} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => Linking.openURL('https://www.linkedin.com/shareArticle?mini=true&url=http://thephysicscafe.com')}>
                                <Image source={require("../../../assets/images/social/in.png")}
                                    style={{ height: 40, resizeMode: "contain" }} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => Linking.openURL('https://twitter.com/share?url=http://thephysicscafe.com&text=Sign%20up%20a%20class%20in%20PMC%20now%20with%20my%20Referral%20Code%20%22Jane_NJC%22%20to%20redeem%20exciting%20rewards.%20Sign%20Up%20now')}>
                                <Image source={require("../../../assets/images/social/twitter.png")}
                                    style={{ height: 40, resizeMode: "contain" }} />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity onPress={() => this.setState({ showEarnReward: !this.state.showEarnReward })}
                            style={{
                                height: 50,
                                borderRadius: 30,
                                backgroundColor: "#74C5FC",
                                marginTop: 20
                            }}>
                            <Text style={{
                                color: "#fff",
                                fontSize: 20,
                                textAlign: 'center',
                                fontWeight: "bold",
                                marginTop: 10, marginStart: 15, marginEnd: 15,
                            }}>{'How Invite Work'}</Text>
                        </TouchableOpacity>


                        {this.state.showEarnReward && <View style={{
                            width: "90%",
                            alignItems: "center",
                            backgroundColor: "#F2F2F2",
                            borderRadius: 20,
                            marginTop: 20,
                            marginBottom: 20
                        }}>
                            <Text style={{
                                color: "#79B3BE",
                                fontSize: 20,
                                textAlign: 'center',
                                fontWeight: "bold",
                                marginTop: 10
                            }}>{'How to Earn Reward Points?'}</Text>
                            <Image source={require("../../../assets/images/icon1.png")}
                                style={{ height: 70, resizeMode: "contain" }} />
                            <Text style={{
                                color: "#000",
                                fontSize: 20,
                                textAlign: 'center',
                                fontWeight: "bold",
                                marginTop: 10
                            }}>{'Step 1'}</Text>

                            <Text style={{
                                color: "#000",
                                fontSize: 17,
                                textAlign: 'center',
                                marginTop: 10
                            }}>{'Copy “Your Referral Code”'}</Text>


                            <Image source={require("../../../assets/images/icon2.png")}
                                style={{ height: 70, resizeMode: "contain" }} />
                            <Text style={{
                                color: "#000",
                                fontSize: 20,
                                textAlign: 'center',
                                fontWeight: "bold",
                                marginTop: 10
                            }}>{'Step 2'}</Text>

                            <Text style={{
                                color: "#000",
                                fontSize: 17,
                                textAlign: 'center',
                                marginTop: 10
                            }}>{'Share “Your Referral Code” to your friends'}</Text>


                            <Image source={require("../../../assets/images/icon3.png")}
                                style={{ height: 70, resizeMode: "contain" }} />
                            <Text style={{
                                color: "#000",
                                fontSize: 20,
                                textAlign: 'center',
                                fontWeight: "bold",
                                marginTop: 10
                            }}>{'Step 3'}</Text>

                            <Text style={{
                                color: "#000",
                                fontSize: 17,
                                textAlign: 'center',
                                marginTop: 10,
                                marginBottom: 20
                            }}>{'Once successful referred friend, you’ll automatically earn points'}</Text>


                        </View>}

                        <View style={styles.groupStyle}>
                            <Text style={{
                                color: "#000",
                                fontSize: 20,
                                textAlign: 'center',
                                fontWeight: "bold",
                                marginTop: 10
                            }}>{'You can redeem your rewards here'}</Text>
                        </View>

                        <TouchableOpacity onPress={() => this.props.navigation.push("MyRewardPoint")}
                            style={{

                                height: 50,
                                borderRadius: 30,
                                backgroundColor: "#74C5FC",
                                marginTop: 20
                            }}>
                            <Text style={{
                                color: "#fff",
                                fontSize: 20,
                                textAlign: 'center',
                                fontWeight: "bold",
                                marginTop: 10, marginStart: 15, marginEnd: 15,
                            }}>{'My Reward Points'}</Text>
                        </TouchableOpacity>

                    </View>

                </KeyboardAwareScrollView>
                {/* <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={commonStyles.textStyle}>{"Not Designed Yet!"}</Text>
                </View>*/}
                <ProgressBar visible={this.state.loading} />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    groupStyle: {
        width: '90%',
        marginTop: 10,
        justifyContent: 'space-around',
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonImageStyle: {
        width: 120,
        height: 80,
        alignItems: 'center'
    }
});
