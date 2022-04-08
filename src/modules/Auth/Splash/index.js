import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import * as colors from '../../../styles/colors';
import * as sizes from '../../../styles/sizes';
import commonStyles from '../../../styles/commonStyles';
import { NavigationActions, StackActions } from "react-navigation";
import Preference from 'react-native-preference';
const resetActionToLogin = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Login' })],
});
const resetActionToHome = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'AppDrawerNavigator' })],
});

export default class Splash extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,

            isConnected: false,
        }
    }

    componentDidMount() {
        setTimeout(() => {
            if(Preference.get("isLoggedIn") )
                this.props.navigation.dispatch(resetActionToHome)
            else
            this.props.navigation.dispatch(resetActionToLogin)
        }, 2000);
    }

    render() {
        return (
            <View style={commonStyles.mainContainer}>
                <View style={{ width: "100%", height: "100%", alignItems: 'center', justifyContent: 'center', backgroundColor: colors.tintColor }}>
                    <Text style={[commonStyles.textStyle, { color: colors.orange, fontSize: sizes.extraExtraLarge, fontWeight: 'bold' }]}>
                        {"PMC"}<Text style={{ color: colors.white }}>{"STUDENT"}</Text>
                    </Text>
                    <Text style={[commonStyles.textStyle, { color: colors.white, fontSize: sizes.medium }]}>{"PARENT PORTAL"}</Text>
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({

});
