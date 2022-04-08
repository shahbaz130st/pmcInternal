import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    SafeAreaView, FlatList, Alert, Dimensions,
} from 'react-native';
// import Preference from 'react-native-preference';
import * as colors from '../../../styles/colors';
import * as sizes from '../../../styles/sizes';
import commonStyles from '../../../styles/commonStyles';
import Header from '../../../components/Header';
import Preference from "react-native-preference";
import {constants} from "../../../Utils/constants";
import moment from 'moment';

const {height, width} = Dimensions.get('window');

export default class PointTransaction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            allItems: [],
        }
    }

    leftAction() {
        this.props.navigation.goBack();
    }

    componentDidMount() {
        this.getPointTransection();
    }

    getPointTransection() {
        this.setState({loading: true})
        let formdata = new FormData();
        formdata.append("student_id", Preference.get('user_id'))
        fetch(constants.pointHistory, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: formdata
        }).then(response => response.json())
            .then(response => {
                this.setState({loading: false})
                console.log("refferalReward-->", "-" + JSON.stringify(response));
                if (response.code == 200) {
                    this.setState({
                        allItems: response.data.point_history
                    })
                } else {
                    Alert.alert("Server Error!", "Please try again.")
                }
            })
            .catch(error => {
                this.setState({loading: false})
                console.log('student_id', Preference.get('user_id'))
                console.log('onMyCourseTabResponseError:', error);

            });
    }

    renderItem(item, index) {
        let day=item.date;
        day=day.split(" ")
        let ptsColor="green";

        if(item.approve=="yes")
        {
            ptsColor="green";
        }else {
            ptsColor="red";
        }
        return (
            <View style={[styles.itemContainerStyle, {marginTop: index == 0 ? 0 : 10}]}>
                <View style={{width: '100%'}}>
                    <View style={{width: "100%", height: 30, backgroundColor: "transparent", flexDirection: "row"}}>
                        <View style={{width: "30%", height: 30, backgroundColor: "#F1F3F5",}}>
                            <Text style={{fontSize: 18, fontWeight: "bold", textAlign: "center"}}>{"NO."}</Text>
                        </View>
                        <View style={{width: "70%", height: 30, backgroundColor: "transparent"}}>
                            <Text style={{fontSize: 18,marginStart:10}}>{index+1}</Text>
                        </View>
                    </View>

                    <View style={{width: "100%", backgroundColor: "transparent", flexDirection: "row"}}>
                        <View style={{width: "30%",  backgroundColor: "#F1F3F5",}}>
                            <Text style={{fontSize: 18, fontWeight: "bold", textAlign: "center"}}>{"EVENT"}</Text>
                        </View>
                        <View style={{width: "70%", backgroundColor: "transparent"}}>
                            <Text style={{fontSize: 18,marginStart:10}}>{item.description}</Text>
                        </View>
                    </View>
                    <View style={{width: "100%", height: 30, backgroundColor: "transparent", flexDirection: "row"}}>
                        <View style={{width: "30%", height: 30, backgroundColor: "#F1F3F5",}}>
                            <Text style={{fontSize: 18, fontWeight: "bold", textAlign: "center"}}>{"PTS"}</Text>
                        </View>
                        <View style={{width: "70%", height: 30, backgroundColor: "transparent"}}>
                            <Text style={{fontSize: 18,marginStart:10,color:ptsColor}}>{item.point}</Text>
                        </View>
                    </View>
                    <View style={{width: "100%", height: 30, backgroundColor: "transparent", flexDirection: "row"}}>
                        <View style={{width: "30%", height: 30, backgroundColor: "#F1F3F5",}}>
                            <Text style={{fontSize: 18, fontWeight: "bold", textAlign: "center"}}>{"DATE"}</Text>
                        </View>
                        <View style={{width: "70%", height: 30, backgroundColor: "transparent"}}>
                            <Text style={{fontSize: 18,marginStart:10}}>{moment(day[0]).format("DD-MMM-YYYY") }</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
                <Header
                    headerText={
                        <Text style={[commonStyles.textStyle, {fontSize: sizes.extraMediumLarge}]}>
                            {"POINT TRANSACTION"}
                        </Text>
                    }
                    leftAction={this.leftAction.bind(this)}
                    leftIcon={require('../../../assets/icons/back.png')}
                    navigation={this.props.navigation}
                />
                <View style={{flex: 1, alignItems: 'center', backgroundColor: '#F2F2F2'}}>
                    <View
                        style={{flex: 1, width: '100%', alignItems: 'center', margin: 10, backgroundColor: '#F2F2F2',}}>
                        <FlatList
                            data={this.state.allItems}
                            keyExtractor={item => item.id}
                            extraData={this.props}
                            showsVerticalScrollIndicator={false}
                            numColumns={1}
                            contentContainerStyle={{alignItems: 'center', width: width}}
                            removeClippedSubviews={false}
                            renderItem={({item, index}) => {
                                return this.renderItem(item, index);
                            }}
                        />
                    </View>
                </View>
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
});
