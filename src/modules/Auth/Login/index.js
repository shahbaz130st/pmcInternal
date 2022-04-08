import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    SafeAreaView,
    TouchableOpacity, Platform,
    Keyboard
} from 'react-native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { NavigationActions, StackActions } from "react-navigation";
import NetInfo from "@react-native-community/netinfo";
import * as colors from '../../../styles/colors';
import * as sizes from '../../../styles/sizes';
import commonStyles from '../../../styles/commonStyles';
import ProgressBar from '../../../components/ProgressBar';
import FloatingLabel from '../../../components/FloatingLabelInput';
import Preference from 'react-native-preference';
import { constants } from '../../../Utils/constants'
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import firebase from "react-native-firebase";
const { height, width } = Dimensions.get('window');
const resetActionToHome = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'AppDrawerNavigator' })],
});
let fcmToken = "";
export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            email: '',
            mobileNo: '',
            email: '',
            mobileNo: '',
            isConnected: false,
            newAccount: false,
        }
    }

    componentDidMount() {
        const { params } = this.props.navigation.state
        console.log('params', params)
        if (params?.newAccount) {
            this.setState({
                newAccount: true
            })
        }
        this.checkInternet();
        this.checkPermission();
        this.CheckDevicePermissions();
    }

    CheckDevicePermissions = () => {
        if (Platform.OS === "android") {
            request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then((result) => {
                if (result === RESULTS.GRANTED) {
                    request(PERMISSIONS.ANDROID.CAMERA).then((result) => {
                        if (result === RESULTS.GRANTED) {
                            // request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((result) => {
                            //     if (result === RESULTS.GRANTED) {
                            //         request(PERMISSIONS.ANDROID.RECORD_AUDIO).then((result) => { });
                            //     }
                            // });
                        }
                    });
                }
            });
        } else {
            request(PERMISSIONS.IOS.CAMERA).then((result) => {
                if (result === RESULTS.GRANTED) {
                    request(PERMISSIONS.IOS.MEDIA_LIBRARY).then((result) => {
                        if (result === RESULTS.GRANTED) {
                            request(PERMISSIONS.IOS.MICROPHONE).then((result) => {
                                if (result === RESULTS.GRANTED) {
                                    request(PERMISSIONS.IOS.PHOTO_LIBRARY).then((result) => {
                                        if (result === RESULTS.GRANTED) {
                                            //request(PERMISSIONS.ANDROID.RECORD_AUDIO).then((result) => {});
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });

        }
    }


    async checkPermission() {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            console.log("fcmToken getting");
            this.getToken();
        } else {
            this.requestPermission();
        }
    }

    async getToken() {
        console.log("fcmToken getting inside");
        //fcmToken = await Preference.get('fcmToken');
        console.log("fcmToken getting inside", JSON.stringify(fcmToken));
        if (!fcmToken) {
            fcmToken = await firebase.messaging().getToken();
            console.log("fcmToken getting inside Got", JSON.stringify(fcmToken));
            if (fcmToken) {
                // user has a device token
                //this.setDevice();
                console.log("fcmToken: ", fcmToken);
                //Preference.set('fcmToken', fcmToken);
            }
        }
    }

    async requestPermission() {
        try {
            await firebase.messaging().requestPermission();
            // User has authorised
            this.getToken();
        } catch (error) {
            // User has rejected permissions
            //Alert.alert("Warning!","")
            console.log('permission rejected');
        }
    }


    checkInternet() {
        const subscribe = NetInfo.addEventListener(state => {
            //console.log("subscribe Connection type", state.type);
            //console.log("subscribe Is connected? ", state.isConnected);
            this.setState({ isConnected: state.isConnected })
        });
        subscribe();
    }

    validateForm() {
        if (this.state.email === '') {
            alert("Student Email field is required");
            return false;
        } else if (this.state.mobileNo === "") {
            alert("Mobile no field is required");
            return false;
        } else {
            return true;
        }
    }

    addAccount = (user) => {
        const account = {
            id: user.id,
            name: user.name,
            qr_code: user.qr_code,
            img: user.img,
            active: true
        }

        let accounts = []
        try {
            accounts = JSON.parse(Preference.get('accounts'))
            for (let i = 0; i < accounts.length; i++) {
                accounts[i].active = false
            }
        } catch (error) { accounts = [] }
        // account.name = account.name + ' - ' + accounts.length;
        let accountLoggedin = false
        for (let i = 0; i < accounts.length; i++) {
            if (accounts[i].id == user.id) {
                accounts[i] = account
                accountLoggedin = true
            }
        }
        if (!accountLoggedin) {
            accounts.push(account)
        }
        Preference.set('accounts', JSON.stringify(accounts))
    }

    onLoginPressed() {
        if (!this.validateForm()) {
            return false;
        } else {
            if (this.state.isConnected) {
                this.setState({ loading: true })

                let formdata = new FormData();
                formdata.append("email", this.state.email)
                formdata.append("phone_no", this.state.mobileNo)
                formdata.append("device_id", fcmToken)
                console.log("form: " + JSON.stringify(formdata))
                fetch(constants.Login, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        // 'Content-Type': 'multipart/form-data',
                    },
                    body: formdata
                    // body: JSON.stringify({
                    //     email: this.state.email,
                    //     phone_no: this.state.mobileNo,
                    //     device_id: fcmToken
                    // })
                }).then(response => response.json())
                    .then(response => {
                        this.setState({ loading: false })
                        console.log("VerifyCouponApiResponse-->", "-" + JSON.stringify(response));
                        if (response.code === 200) {
                            Preference.set('isLoggedIn', true);
                            Preference.set('device_id', fcmToken);

                            Preference.set('user_id', response.data.id);
                            Preference.set('user_name', response.data.name);
                            Preference.set('qr_code', response.data.qr_code);
                            Preference.set('user_image', response.data.img);

                            this.addAccount(response.data)

                            this.props.navigation.dispatch(resetActionToHome)
                        } else {
                            alert(response.msg)
                        }

                    })
                    .catch(error => {
                        this.setState({ loading: false })
                        console.log('ResponseError:', error);
                    });
            } else { alert('Please check your internet connection.') }
        }
        Keyboard.dismiss();
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={commonStyles.mainContainer}>
                    <KeyboardAwareScrollView
                        innerRef={ref => { this.scroll = ref }}
                        keyboardShouldPersistTaps='handled'
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ height: '100%' }}
                        style={{ flex: 1, width: "100%" }}>
                        <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}>

                            <View style={[commonStyles.shedowAndElivation, { width: "100%", height: 88, alignItems: 'center', justifyContent: 'center' }]}>
                                <Text style={[commonStyles.textStyle, { fontSize: sizes.extraLarge, color: colors.tintColor, fontWeight: 'bold' }]}>
                                    {"PMC"}<Text style={{ color: colors.black }}>{"STUDENT"}</Text>
                                </Text>
                                <Text style={[commonStyles.textStyle, { fontSize: sizes.extraSmall }]}>{"PARENT PORTAL"}</Text>
                            </View>
                            {this.state.newAccount && (
                                <TouchableOpacity
                                    style={{
                                        position: 'absolute',
                                        left: 10,
                                        top: 20
                                    }}
                                    onPress={() => this.props.navigation.goBack()}
                                >
                                    <Image
                                        source={require('../../../assets/icons/back.png')}
                                        style={{
                                            margin: 10,
                                            width: 20,
                                            height: 20,
                                            tintColor: 'black',
                                            resizeMode: 'contain'
                                        }}
                                    />
                                </TouchableOpacity>
                            )}
                            <Image
                                source={require('../../../assets/images/social/img.jpg')}
                                style={{ resizeMode: 'cover', width: '100%', height: 200 }}
                            />
                            <View style={{ flex: 1, width: '100%', alignItems: 'center', backgroundColor: colors.tintColor }}>
                                <View style={{ width: '90%', justifyContent: 'center', alignItems: 'center' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
                                        <Image
                                            source={require('../../../assets/icons/email.png')}
                                            style={{ resizeMode: 'contain', width: 25, height: 25, marginRight: 10, marginTop: 25 }}
                                        />
                                        <FloatingLabel
                                            value={this.state.email}
                                            autoCapitalize={'none'}
                                            inputStyle={[commonStyles.inputText, {}]}
                                            onChangeText={(text) => {
                                                this.setState({ email: text })
                                            }}
                                            style={commonStyles.forminputContainer}
                                        >STUDENT EMAIL</FloatingLabel>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image
                                            source={require('../../../assets/icons/lock.png')}
                                            style={{ resizeMode: 'contain', width: 25, height: 25, marginRight: 10, marginTop: 25 }}
                                        />
                                        <FloatingLabel
                                            value={this.state.mobileNo}
                                            inputStyle={[commonStyles.inputText, {}]}
                                            onChangeText={(text) => {
                                                this.setState({ mobileNo: text })
                                            }}
                                            style={commonStyles.forminputContainer}
                                        >MOBILE NO</FloatingLabel>
                                    </View>
                                    <View style={[commonStyles.navigationButtonsContainer, commonStyles.shedowAndElivation]}>
                                        <TouchableOpacity
                                            style={commonStyles.navigationButton}
                                            onPress={() => {
                                                this.onLoginPressed();
                                                // this.props.navigation.dispatch(resetActionToHome)
                                            }}>
                                            <Text style={commonStyles.navigationButtonText}>SIGN IN</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {/* <View style={{flex:1, justifyContent: 'flex-end'}}>
                                    <Text style={[{color: colors.white,fontSize: sizes.small, marginBottom:5}]}>{"Copyright \u00A9 2017 Developed by XYZ"}</Text>
                                </View> */}
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                </View>
                <ProgressBar visible={this.state.loading} />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({

});
