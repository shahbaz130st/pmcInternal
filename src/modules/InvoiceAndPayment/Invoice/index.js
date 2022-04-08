import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    SafeAreaView, FlatList, Dimensions,
} from 'react-native';
// import Preference from 'react-native-preference';
import * as colors from '../../../styles/colors';
import * as sizes from '../../../styles/sizes';
import commonStyles from '../../../styles/commonStyles';
import Header from '../../../components/Header';
import ProgressBar from "../../../components/ProgressBar";
import Preference from "react-native-preference";
import {constants} from "../../../Utils/constants";
import moment from "moment";

const {height, width} = Dimensions.get('window');
export default class Invoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            invoices: [],
        }
    }

    componentDidMount() {
        this.getInvoices()
    }

    getInvoices() {
        this.setState({loading: true})
        let formdata = new FormData();
        console.log("USERID:", Preference.get('user_id'))
        formdata.append("student_id", Preference.get('user_id'))
        fetch(constants.invoice, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: formdata
        }).then(response => response.json())
            .then(response => {
                this.setState({loading: false})
                console.log("getResultsResponse-->", "-" + JSON.stringify(response));
                if (response.code === 200) {

                    this.setState({
                        invoices: response.data

                    }, () => {
                        this.forceUpdate()
                    })

                } else {

                }
            })
            .catch(error => {
                this.setState({loading: false})
                console.log('ResponseError:', error);

            });
    }

    leftAction() {
        this.props.navigation.goBack();
    }


    renderItem(item, index) {
        let coler="red";
        if (item.credit_amount === null) {
            item.credit_amount = "0.00"
        }
        console.log("student_course_status:"+item.student_course_status)
        if(parseInt(item.balance)<=0)
        {
            item.student_course_status="PAID"
            coler="green";
        }else {
            item.student_course_status="UNPAID"
            coler="red";
        }
        let status="";
        if(parseInt(item.balance)<=0)
        {
            status="PAID";
            coler="green";
        }else{
            status="UNPAID";
            coler="red";
        }
        console.log("student_course_status:"+item.student_course_status)
        return (
            <View style={[styles.itemContainerStyle, {marginTop: index == 0 ? 10 : 10}]}>
                <TouchableOpacity onPress={()=>{this.props.navigation.navigate("InvoiceDetail",{invoiceId:item.id})}} style={{width: '100%'}}>
                    <View style={{width: "100%",  backgroundColor: "transparent", flexDirection: "row"}}>
                        <View style={{width: "40%",  backgroundColor: "#F1F3F5",}}>
                            <Text style={{fontSize: 15, fontWeight: "bold", textAlign: "center"}}>{"NO."}</Text>
                        </View>
                        <View style={{width: "60%",  backgroundColor: "transparent"}}>
                            <Text style={{fontSize: 15, marginStart: 10}}>{index + 1}</Text>
                        </View>
                    </View>

                    <View style={{width: "100%", backgroundColor: "transparent", flexDirection: "row"}}>
                        <View style={{width: "40%", backgroundColor: "#F1F3F5",}}>
                            <Text style={{fontSize: 15, fontWeight: "bold", textAlign: "center"}}>{"INVOICE NO."}</Text>
                        </View>
                        <View style={{width: "60%", backgroundColor: "transparent"}}>
                            <Text style={{fontSize: 15, marginStart: 10}}>{item.invoice_no_new}</Text>
                        </View>
                    </View>
                    <View style={{width: "100%",  backgroundColor: "transparent", flexDirection: "row"}}>
                        <View style={{width: "40%",  backgroundColor: "#F1F3F5",}}>
                            <Text style={{fontSize: 15, fontWeight: "bold", textAlign: "center"}}>{"DUE DATE"}</Text>
                        </View>
                        <View style={{width: "60%", backgroundColor: "transparent"}}>
                            <Text style={{
                                fontSize: 15,
                                marginStart: 10
                            }}>{moment(item.due_date).format("DD-MMM-YYYY")}</Text>
                        </View>
                    </View>
                    <View style={{width: "100%", backgroundColor: "transparent", flexDirection: "row"}}>
                        <View style={{width: "40%", backgroundColor: "#F1F3F5",}}>
                            <Text style={{
                                fontSize: 15,
                                fontWeight: "bold",
                                textAlign: "center"
                            }}>{"INVOICE AMOUNT"}</Text>
                        </View>
                        <View style={{width: "60%", backgroundColor: "transparent"}}>
                            <Text style={{fontSize: 15, marginStart: 10}}>{"$" + item.invoice_amount}</Text>
                        </View>
                    </View>
                    <View style={{width: "100%",  backgroundColor: "transparent", flexDirection: "row"}}>
                        <View style={{width: "40%",  backgroundColor: "#F1F3F5",}}>
                            <Text style={{fontSize: 15, fontWeight: "bold", textAlign: "center"}}>{"PAID AMOUNT"}</Text>
                        </View>
                        <View style={{width: "60%",  backgroundColor: "transparent"}}>
                            <Text style={{fontSize: 15, marginStart: 10}}>{"$" + item.receipt}</Text>
                        </View>
                    </View>
                    <View style={{width: "100%",  backgroundColor: "transparent", flexDirection: "row"}}>
                        <View style={{width: "40%",  backgroundColor: "#F1F3F5",}}>
                            <Text
                                style={{fontSize: 15, fontWeight: "bold", textAlign: "center"}}>{"CREDIT AMOUNT"}</Text>
                        </View>
                        <View style={{width: "60%",  backgroundColor: "transparent"}}>
                            <Text style={{fontSize: 15, marginStart: 10}}>{"$" + item.credit_amount}</Text>
                        </View>
                    </View>
                    <View style={{width: "100%",  backgroundColor: "transparent", flexDirection: "row"}}>
                        <View style={{width: "40%",  backgroundColor: "#F1F3F5",}}>
                            <Text style={{fontSize: 15, fontWeight: "bold", textAlign: "center"}}>{"STATUS"}</Text>
                        </View>
                        <View style={{width: "60%",  backgroundColor: "transparent"}}>
                            <Text style={{fontSize: 15, marginStart: 10,color:coler}}>{status}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
                <Header
                    headerText={
                        <Text style={[commonStyles.textStyle, {fontSize: sizes.extraMediumLarge}]}>
                            {"INVOICE"}
                        </Text>
                    }
                    leftAction={this.leftAction.bind(this)}
                    leftIcon={require('../../../assets/icons/back.png')}
                    navigation={this.props.navigation}
                />
                <View style={{width: '100%', alignItems: 'center', backgroundColor: '#F2F2F2',}}>
                    <FlatList
                        data={this.state.invoices}
                        keyExtractor={item => item.id}
                        extraData={this.props}
                        showsVerticalScrollIndicator={false}
                        numColumns={1}
                        contentContainerStyle={{alignItems: 'center', width: width}}
                        removeClippedSubviews={false}
                        style={{marginBottom:50}}
                        renderItem={({item, index}) => {
                            return this.renderItem(item, index);
                        }}
                    />
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
});
