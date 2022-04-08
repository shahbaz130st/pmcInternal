import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    Text,
    View,
    TouchableOpacity,
    ScrollView,Alert,
    SafeAreaView, FlatList, Dimensions,
} from 'react-native';
// import Preference from 'react-native-preference';
import * as colors from '../../../styles/colors';
import * as sizes from '../../../styles/sizes';
import commonStyles from '../../../styles/commonStyles';
import Header from '../../../components/Header';
import moment from "../SubscribeCourse";
import Preference from "react-native-preference";
import {constants} from "../../../Utils/constants";
import ProgressBar from '../../../components/ProgressBar';

const {height, width} = Dimensions.get('window');

export default class MakeupHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            makeUpHistory:[]
        }
    }

    componentDidMount() {
        console.log("Calling component");
        this.getMakeUpHistory();
    }

    getMakeUpHistory()
    {
        this.setState({loading: true})
        let formdata = new FormData();
        formdata.append("student_id", Preference.get('user_id'))
        fetch(constants.getMakeUpHistory, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: formdata
        }).then(response => response.json())
            .then(response => {
                this.setState({loading: false})
                console.log("MakeUpHistory-->", "-" + JSON.stringify(response));
                this.setState({makeUpHistory:response.make_up_list})
            })
            .catch(error => {
                this.setState({loading: false})
                console.log('student_id', Preference.get('user_id'))
                console.log('onMyCourseTabResponseError:', error);

            });
    }


    cancelMakeUpHistory(id)
    {
        this.setState({loading: true})
        let formdata = new FormData();
        formdata.append("make_up_class_id", id)
        fetch(constants.cancelMakeUpHistory, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: formdata
        }).then(response => response.json())
            .then(response => {
                this.setState({loading: false})
                console.log("MakeUpHistory-->", "-" + JSON.stringify(response));
                if(response.code==200)
                {
                    Alert.alert("Success!","Your Request is submitted.");
                    this.getMakeUpHistory();
                }else {
                    Alert.alert("Server Error!","Please try again.")
                }
            })
            .catch(error => {
                this.setState({loading: false})
                console.log('student_id', Preference.get('user_id'))
                console.log('onMyCourseTabResponseError:', error);

            });
    }

    leftAction(){
        this.props.navigation.goBack();
    }


    renderLine(source, text){
        return(
            <View style={{width: '100%',flexDirection: 'row', alignItems: 'center', marginVertical:5}}>
                <View style={{width:"50%",justifyContent:"center",alignItems:"center"}}>
                    <Text style={[commonStyles.textStyle]}>{source}</Text>
                </View>
                <View style={{width:"50%",justifyContent:"center",alignItems:"center"}}>
                    <Text style={[commonStyles.textStyle]}>{text}</Text>
                </View>

            </View>
        )
    }

    renderItem(item, index){
        if(item.remark==="")
            item.remark="-"

        console.log("StatusMakeup: "+ item.status +"-- "+index)
        // if( item.status==="0")
        //     item.status="Cancel"
        // else
        //     item.status="Approve"
        let statusMakeUp="";

            if(item.status === "1")
            {
                //echo "Approve";
                statusMakeUp="Approve"
            }
            else if(item.status === "2")
            {
                //echo "Reject";
                statusMakeUp="Reject"
            }
            else if(item.status === "3")
            {
                //echo "Cancel";
                statusMakeUp="Cancel"
            }
            else
            {
                //echo "Requesting";
                statusMakeUp="Requesting"
            }

        return(
            <View style={[styles.itemContainerStyle,{marginTop: index == 0 ? 0 :10 }]}>
                {this.renderLine("COURSE", item.title)}
                {this.renderLine("MAKE UP DAY", item.make_up_day)}
                {this.renderLine("SUBMITTED ON", item.request_date)}
                {this.renderLine("STATUS", statusMakeUp)}
                {this.renderLine("REMARK", item.remark)}
                {(statusMakeUp!="Cancel")&&<View style={{ width: '100%', marginTop: 10,height:35,alignItems:"center",justifyContent:"center"}}>
                    <TouchableOpacity
                        style={[styles.buttonStyle,{backgroundColor: colors.orange}]}
                        onPress={() => {
                           this.cancelMakeUpHistory(item.id)
                        }}>
                        <Text style={{color: colors.white}}>{'Cancel'}</Text>
                    </TouchableOpacity>
                </View>}
            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={{flex: 1, backgroundColor:colors.white}}>
                <Header
                    headerText={
                        <Text style={[commonStyles.textStyle,{fontSize: sizes.extraExtraLarge}]}>
                            {"MAKE UP HISTORY"}
                        </Text>
                    }
                    leftAction={this.leftAction.bind(this)}
                    leftIcon={require('../../../assets/icons/back.png')}
                    navigation={this.props.navigation}
                />
                <View style={{flex:1, width: '100%', alignItems: 'center', justifyContent: 'center',backgroundColor: '#F2F2F2',}}>
                    <View style={{flex:1,margin: 10, marginBottom: 0,width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                        <FlatList
                            data={this.state.makeUpHistory}
                            keyExtractor={item => item.id}
                            extraData={this.props}
                            showsVerticalScrollIndicator={false}
                            numColumns={1}
                            contentContainerStyle={{alignItems: 'center'}}
                            style={{width: '100%',width:"100%"}}
                            removeClippedSubviews={false}
                            renderItem={({item, index}) => {
                                return this.renderItem(item, index);
                            }}
                        />
                    </View>
                </View>
                {/*<View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={commonStyles.textStyle}>{"Not Designed Yet!"}</Text>
                </View>*/}
                <ProgressBar visible={this.state.loading} />
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
    },
    buttonStyle: {
        width: '80%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
    },
    itemContainerStyle: {
        borderRadius: 20,
        padding: 15,
        borderLeftColor: colors.tintColor,
        backgroundColor: colors.white,
        borderLeftWidth: 5,
        alignItems: 'center',
        justifyContent: 'center',
        //width: '100%',
        width: width * 0.95,
    },
});
