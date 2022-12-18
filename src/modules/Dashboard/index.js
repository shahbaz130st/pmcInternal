import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Linking
} from 'react-native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { NavigationActions, StackActions } from "react-navigation";
// import Preference from 'react-native-preference';
import * as colors from '../../styles/colors';
import * as sizes from '../../styles/sizes';
import commonStyles from '../../styles/commonStyles';
import Header from '../../components/Header';
import Preference from "react-native-preference";
import { constants } from "../../Utils/constants";

export default class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            pendingDues: "",
            referralPoints: 0,
            headingText: ""
        }
    }

    componentDidMount() {
        this.getPendingDues()
        this.getReferralPoints()
    }

    getReferralPoints() {
        let formdata = new FormData();
        formdata.append("student_id", Preference.get('user_id'))
        fetch(constants.rewardPoint, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: formdata
        }).then(response => response.json()).then(response => {
            console.log("refrel error reward", response)
            this.setState({ headingText: response?.message })
            if (response.data?.student_point?.total_point) {
                this.setState({
                    referralPoints: response.data?.student_point?.total_point || 0
                })
            }
        }).catch(error => { });
    }

    getPendingDues() {
        this.setState({ loading: true })
        let formdata = new FormData();
        formdata.append("student_id", Preference.get('user_id'))
        fetch(constants.home, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: formdata
        }).then(response => response.json())
            .then(response => {
                this.setState({ loading: false })
                console.log("getPendingDuesResponse-->", "-" + JSON.stringify(response));
                if (response.code === 200) {
                    this.setState({
                        pendingDues: response.data.total_balance

                    }, () => {
                        this.forceUpdate()
                    })

                } else {

                }
            })
            .catch(error => {
                this.setState({ loading: false })
                console.log('ResponseError:', error);

            });
    }

    leftAction() {
        this.props.navigation.openDrawer();
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
                <Header
                    headerText={
                        <Text style={[commonStyles.textStyle, { fontSize: sizes.extraLarge, color: colors.tintColor, fontWeight: 'bold' }]}>
                            {"PMC"}<Text style={{ color: colors.black }}>{"PORTAL"}</Text>
                        </Text>
                    }
                    leftAction={this.leftAction.bind(this)}
                    leftIcon={require('../../assets/icons/menu.png')}
                    navigation={this.props.navigation}
                />
                <KeyboardAwareScrollView
                    innerRef={ref => { this.scroll = ref }}
                    keyboardShouldPersistTaps='handled'
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    // contentContainerStyle={{height: '100%'}}
                    style={{ flex: 1, width: "100%" }}>
                    <View style={{ height: '100%', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <View style={styles.groupStyle}>
                            <Text style={{ color: "red", fontSize: 16, textAlign: 'center', }}>{this.state.headingText/* 'Join PMC Combo (Physics + Maths + Chemistry) to enjoy additional discount.' */}</Text>
                        </View>
                        <TouchableOpacity style={{
                            width: "90%",
                            borderWidth: 5,
                            borderRadius: 15,
                            borderColor: "#FFD057",
                            alignItems: 'center',
                            marginTop: 20
                        }} onPress={() => {
                            // MyRewardPoint
                            this.props.navigation.navigate('MyRewardPoint')
                        }}>
                            <Text style={{
                                color: "#000",
                                fontSize: 20,
                                textAlign: 'center',
                                fontWeight: "bold",
                                marginTop: 10,
                                marginHorizontal: 10
                            }}>{'YOUR PMC CURRENCY'}</Text>

                            <Text style={{
                                color: "black",
                                fontSize: 17,
                                textAlign: 'center',
                                marginTop: 10,
                                marginHorizontal: 10
                            }}>
                                {'Do well in your class quiz and '}

                                <Text
                                    style={{
                                        color: "#0080ff",
                                        textDecorationColor: '#0080ff',
                                        textDecorationStyle: 'solid',
                                        textDecorationLine: 'underline',
                                    }}
                                    onPress={() => {
                                        this.props.navigation.navigate('MyReferralCode')
                                    }}
                                >{'refer friends'}</Text>
                                {' to earn more PMC currency'}
                            </Text>

                            <Text style={{
                                color: "#1994DA",
                                fontSize: 40,
                                textAlign: 'center',
                                fontWeight: "bold",

                                marginTop: 10
                            }}>{this.state.referralPoints}</Text>
                        </TouchableOpacity>
                        <View style={styles.groupStyle}>
                            <TouchableOpacity
                                style={styles.buttonImageStyle}
                                onPress={() => {
                                    this.props.navigation.navigate("Invoice")
                                }}>
                                <Image
                                    style={commonStyles.imageStyle}
                                    source={require('../../assets/icons/doller.png')}
                                />
                                <Text style={[commonStyles.textStyle, { width: 170 }]}>{'Outstanding Amount \n$ ' + this.state.pendingDues}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.buttonImageStyle}
                                onPress={() => {
                                    this.props.navigation.navigate("MyStudentCard")
                                }}>
                                <Image
                                    style={commonStyles.imageStyle}
                                    source={require('../../assets/icons/studentcard.png')}
                                />
                                <Text style={commonStyles.textStyle}>{'Student Card'}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.groupStyle}>
                            <TouchableOpacity
                                style={styles.buttonImageStyle}
                                onPress={() => {
                                    this.props.navigation.navigate("RequestForMakeup")
                                }}>
                                <Image
                                    style={commonStyles.imageStyle}
                                    source={require('../../assets/icons/makeupclass.png')}
                                />
                                <Text style={commonStyles.textStyle}>{'Make Up Class'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.buttonImageStyle}
                                onPress={() => {
                                    this.props.navigation.navigate("Announcements")
                                }}>
                                <Image
                                    style={commonStyles.imageStyle}
                                    source={require('../../assets/icons/announcement.png')}
                                />
                                <Text style={[commonStyles.textStyle, { width: 170 }]}>{'Announcements'}</Text>
                            </TouchableOpacity>

                        </View>

                        <View style={styles.groupStyle}>
                            <TouchableOpacity
                                style={styles.buttonImageStyle}
                                onPress={() => {
                                    this.props.navigation.navigate("MyRewardPoint");
                                }}>
                                <Image
                                    style={commonStyles.imageStyle}
                                    source={require('../../assets/icons/refreral.png')}
                                />
                                <Text style={commonStyles.textStyle}>{'Referral & Rewards'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.buttonImageStyle}
                                onPress={() => {
                                    this.props.navigation.navigate("AcademicResult")
                                }}>
                                <Image
                                    style={commonStyles.imageStyle}
                                    source={require('../../assets/icons/result.png')}
                                />
                                <Text style={commonStyles.textStyle}>{'Academic Result'}</Text>
                            </TouchableOpacity>

                        </View>

                        <View style={[styles.groupStyle, { marginBottom: 50 }]}>

                            <TouchableOpacity
                                style={styles.buttonImageStyle}
                                onPress={() => {
                                    this.props.navigation.navigate("MyProfile")
                                }}>
                                <Image
                                    style={commonStyles.imageStyle}
                                    source={require('../../assets/icons/me.png')}
                                />
                                <Text style={commonStyles.textStyle}>{'Me'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.buttonImageStyle, { height: 111 }]}
                                onPress={() => {
                                    Linking.openURL("https://wa.me/message/YGCH2EUFWDEVI1")
                                    /*  this.props.navigation.navigate("MyProfile") */
                                }}>
                                <Image
                                    style={[commonStyles.imageStyle]}
                                    source={require('../../assets/icons/liveChat.png')}
                                />
                                <Text style={commonStyles.textStyle}>{'Student Services RM'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
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
        //backgroundColor:"yellow"
    },
    buttonImageStyle: {
        width: 120,
        height: 100,
        alignItems: 'center'
    }
});
