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
import * as colors from '../../../styles/colors';
import * as sizes from '../../../styles/sizes';
import commonStyles from '../../../styles/commonStyles';
import Header from '../../../components/Header';
import { constants } from "../../../Utils/constants";
import Preference from "react-native-preference";
import { WebView } from 'react-native-webview';

export default class MyReferralCodeWebViewDisplay extends Component {
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
                {this.state.description && (
                    <WebView
                        originWhitelist={['*']}
                        style={[
                            {
                                flex: 1,
                                flexGrow: 1
                            },
                        ]}
                        containerStyle={{
                            flexGrow: 1,
                        }}
                        useWebKit={true}
                        source={{
                            html: '<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body><p>' + this.state.description + '</p></body></html>'
                        }} />
                )}
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
