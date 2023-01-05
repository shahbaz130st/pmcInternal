import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    Text,
    SafeAreaView,
    Linking
} from 'react-native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { NavigationActions, StackActions } from "react-navigation";
import * as colors from '../styles/colors';
import * as sizes from '../styles/sizes';
import commonStyles from '../styles/commonStyles';
import { constants } from '../Utils/constants'
import Preference from 'react-native-preference';

const resetActionToLogin = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Login' })],
});
const resetActionToDashboard = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'AppDrawerNavigator' })],
});
export default class Drawer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            isShowCourseTab: false,
            isShowCallMakeUp: false,
            isShowRefferalTab: false,
            isShowInvoiceTab: false,
            accounts: [],
            idCardQRCodeImage: require('../assets/images/qr_code.png')
        }
    }
    componentDidMount() {
        let accounts = Preference.get('accounts')
        try {
            accounts = JSON.parse(accounts)
        } catch (error) {
            accounts = []
        }

        this.setState({
            accounts
        })
    }

    renderDrawerItem(routeName, iconSource, title) {
        return (
            <TouchableOpacity
                style={styles.groupStyle}
                onPress={() => {
                    if (title == 'MyCourse') {
                        this.setState({ isShowCourseTab: !this.state.isShowCourseTab })
                    }
                    else if (routeName == "CallMakeup") {
                        this.setState({ isShowCallMakeUp: !this.state.isShowCallMakeUp })
                    }
                    else if (routeName == 'RegisterToWatchDigitalLesson') {
                        Linking.openURL('http://www.edutv.sg')
                    } else {
                        if (title == 'Referral and Reward') {
                            this.setState({ isShowRefferalTab: !this.state.isShowRefferalTab })
                        } else {
                                this.setState({ isShowInvoiceTab: false, isShowRefferalTab: false, isShowCourseTab: false,isShowCallMakeUp:false })
                                this.props.navigation.navigate(routeName)
                        }
                    }
                }}>
                <Image
                    style={styles.buttonImageStyle}
                    source={iconSource}
                />
                <Text style={[commonStyles.textStyle, { marginLeft: 10, width: '75%' }]}>{title}</Text>
                <Image
                    style={styles.arrowStyle}
                    source={
                        (this.state.isShowCourseTab && title == 'MyCourse') ?
                            require('../assets/icons/down_arrow.png')
                            :
                            require('../assets/icons/arrow.png')}
                />
            </TouchableOpacity>
        )
    }

    renderCourseMenuItem() {
        return (
            <View style={{ width: '90%', alignItems: 'flex-end', }}>
                <View style={styles.courseGroupStyle}>
                    {this.renderDrawerItem(
                        "MyCourse",
                        require('../assets/icons/blue_dot.png'),
                        "Course"
                    )}
                    {this.renderDrawerItem(
                        "Timetable",
                        require('../assets/icons/blue_dot.png'),
                        "Calender"
                    )}
                </View>
            </View>
        )
    }

    renderCallMakeupMenuItem() {
        return (
            <View style={{ width: '90%', alignItems: 'flex-end', }}>
                <View style={styles.courseGroupStyle}>
                    {this.renderDrawerItem(
                        "RequestForMakeup",
                        require('../assets/icons/blue_dot.png'),
                        "Request for makeup"
                    )}
                    {this.renderDrawerItem(
                        "MakeupHistory",
                        require('../assets/icons/blue_dot.png'),
                        "Edit makeup"
                    )}
                    {this.renderDrawerItem(
                        "RegisterToWatchDigitalLesson",
                        require('../assets/icons/blue_dot.png'),
                        "Register To Watch Digital Lesson"
                    )}
                </View>
            </View>
        )
    }

    renderRefferalMenuItem() {
        return (
            <View style={{ width: '90%', alignItems: 'flex-end', }}>
                <View style={styles.courseGroupStyle}>
                    {this.renderDrawerItem(
                        "MyReferralCode",
                        require('../assets/icons/blue_dot.png'),
                        "My Referral Code"
                    )}
                    {this.renderDrawerItem(
                        "MyRewardPoint",
                        require('../assets/icons/blue_dot.png'),
                        "My Reward Point"
                    )}
                    {this.renderDrawerItem(
                        "PointTransaction",
                        require('../assets/icons/blue_dot.png'),
                        "Point Transaction"
                    )}
                </View>
            </View>
        )
    }

    renderInvoiceMenuItem() {
        return (
            <View style={{ width: '90%', alignItems: 'flex-end', }}>
                <View style={styles.courseGroupStyle}>
                    {this.renderDrawerItem(
                        "Invoice",
                        require('../assets/icons/blue_dot.png'),
                        "Invoice"
                    )}
                </View>
            </View>
        )
    }

    onAccountPress = (account, index) => {
        if (account.active) {
            this.props.navigation.navigate("MyProfile")
        } else {
            const accounts = this.state.accounts
            for (let i = 0; i < accounts.length; i++) {
                accounts[i].active = false;
            }
            accounts[index].active = true
            this.updateSelectAccount(accounts[index])
            Preference.set('accounts', JSON.stringify(accounts))
            this.props.navigation.dispatch(resetActionToDashboard);
        }
    }

    removeAccount = () => {
        const accounts = this.state.accounts
        const activeIndex = accounts.findIndex(account => account.active)
        if (activeIndex >= 0) {
            accounts.splice(activeIndex, 1)
        }
        accounts[0].active = true
        this.updateSelectAccount(accounts[0])
        Preference.set('accounts', JSON.stringify(accounts))
        this.props.navigation.dispatch(resetActionToDashboard);
    }

    updateSelectAccount = (account) => {
        Preference.set('user_id', account.id);
        Preference.set('user_name', account.name);
        Preference.set('qr_code', account.qr_code);
        Preference.set('user_image', account.img);
    }

    userLogout = () => {
        const {
            accounts
        } = this.state
        let userId = 0
        for (let i = 0; i < accounts.length; i++) {
            if (accounts[i].active) {
                userId = accounts[i].id
                break;
            }
        }

        let formdata = new FormData();
        formdata.append("student_id", userId)
        formdata.append("device_id", Preference.get("device_id"))
        fetch(constants.logout, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: formdata
        }).then(response => response.json())
            .then(response => {
                if (response.code === 200) {
                    if (accounts.length > 1) {
                        this.removeAccount()
                    } else {
                        Preference.clear();
                        this.props.navigation.dispatch(resetActionToLogin);
                    }
                } else {
                    alert(response.msg)
                }
            })
            .catch(error => {
                console.log('ResponseError:', error);
            });
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAwareScrollView
                    innerRef={ref => {
                        this.scroll = ref
                    }}
                    keyboardShouldPersistTaps='handled'
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ height: '100%' }}
                    style={{ flex: 1, width: "100%" }}>
                    <View style={{ height: '100%', justifyContent: 'flex-start', alignItems: 'center' }}>
                        {this.state.accounts.map((account, index) => {
                            return (
                                <TouchableOpacity
                                    style={[
                                        styles.groupStyle,
                                        {
                                            marginTop: index == 0 ? 13 : 5,
                                            marginBottom: 8
                                        },
                                        account.active && {
                                            borderColor: account.active ? 'green' : 'yellow',
                                            borderWidth: 2,
                                            backgroundColor: 'yellow',
                                        }
                                    ]}
                                    onPress={() => this.onAccountPress(account, index)}>
                                    <Image
                                        style={[styles.qrcodeStyle, { height: '90%', marginLeft: 10 }]}
                                        source={{ uri: constants.image_Url + account.img }}
                                    />
                                    <Text style={[commonStyles.textStyle, { marginLeft: 10 }]}>
                                        {account.name}<Text style={{ fontSize: sizes.small }}>{'\nStudent Id: 00' + account.id}</Text>
                                    </Text>
                                    <Image
                                        style={styles.qrcodeStyle}
                                        source={this.state.idCardQRCodeImage}
                                    />
                                    {account.active && (
                                        <Image
                                            style={styles.arrowStyle}
                                            source={require('../assets/icons/arrow.png')}
                                        />
                                    )}
                                </TouchableOpacity>
                            )
                        })}
                        {this.state.accounts.length < 2 && (
                            <TouchableOpacity
                                style={styles.groupStyle}
                                onPress={() => {
                                    this.props.navigation.navigate('Login', {
                                        newAccount: true
                                    })
                                }}>
                                <Image
                                    style={styles.buttonImageStyle}
                                    source={require('../assets/icons/add.png')}
                                />
                                <Text style={[commonStyles.textStyle, { marginLeft: 10, width: '75%' }]}>{"Add Account"}</Text>

                            </TouchableOpacity>
                        )}
                        {/*{this.renderDrawerItem(
                            "",
                            require('../assets/icons/dashboard.png'),
                            "Dashboard"
                        )}*/}
                        {this.renderDrawerItem(
                            "Announcements",
                            require('../assets/icons/attendance_time.png'),
                            "Announcement"
                        )}
                        {this.renderDrawerItem(
                            "MyCourse",
                            require('../assets/icons/my_course_file.png'),
                            "MyCourse"
                        )}
                        {this.state.isShowCourseTab && this.renderCourseMenuItem()}
                        {this.renderDrawerItem(
                            "CallMakeup",
                            require('../assets/icons/phone.jpeg'),
                            "Makeup"
                        )}
                        {this.state.isShowCallMakeUp && this.renderCallMakeupMenuItem()}

                        {this.renderDrawerItem(
                            "Referral",
                            require('../assets/icons/rewards.png'),
                            "Referral and Reward"
                        )}
                        {this.state.isShowRefferalTab && this.renderRefferalMenuItem()}

                        {this.renderDrawerItem(
                            "AcademicResult",
                            require('../assets/icons/academic_detail.png'),
                            "Academic Result"
                        )}
                        {this.renderDrawerItem(
                            "Invoice",
                            require('../assets/icons/invoice.png'),
                            "Invoice and Payment"
                        )}

                        <TouchableOpacity
                            style={styles.groupStyle}
                            onPress={() => {
                                this.userLogout();
                            }}>
                            <Image
                                style={styles.buttonImageStyle}
                                source={require('../assets/icons/logout.png')}
                            />
                            <Text style={[commonStyles.textStyle, { marginLeft: 10, textAlign: "center" }]}>{'Logout'}</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    groupStyle: {
        width: '90%',
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        padding: 10,
    },
    courseGroupStyle: {
        alignItems: 'flex-end',
        width: '100%',
    },
    buttonImageStyle: {
        resizeMode: 'contain',
        width: 25,
        height: 25,
        marginLeft: 5,
    },
    arrowStyle: {
        resizeMode: 'contain',
        width: 15,
        height: 15,
        position: 'absolute',
        right: 10
    },
    qrcodeStyle: {
        resizeMode: 'contain',
        width: 30,
        height: 30,
        marginLeft: 15
    }
});
