import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    SafeAreaView, FlatList, Dimensions, Linking, Platform,
} from 'react-native';
import * as colors from '../../../styles/colors';
import * as sizes from '../../../styles/sizes';
import commonStyles from '../../../styles/commonStyles';
import Header from '../../../components/Header';
import ProgressBar from "../../../components/ProgressBar";
import AvatarComponent from "../../../components/AvatarComponent";
import Preference from "react-native-preference";
import { constants } from "../../../Utils/constants";
import moment from "moment";
import { WebView } from "react-native-webview";

let amountRecieved = 0;
const { height, width } = Dimensions.get('window');
export default class Invoice extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            invoices: [],
            description: "",
            student_course: "",
            invoice_amount: "",
            invoice_header: "",
            amount_list: "",
            detail_level: "",
            date_detail: [],
            canGoFurther: false,
            Remark: ""
        }
    }

    componentDidMount() {
        // this.props.navigation.state.params.JSON_ListView_Clicked_Item
        const { params } = this.props.navigation.state;
        console.log(this.props.navigation)
        this.getInvoices(params.invoiceId);
    }

    getInvoices(id) {
        this.setState({ loading: true })
        let formdata = new FormData();
        formdata.append("student_id", Preference.get('user_id'))
        formdata.append("invoice_id", id)
        fetch(constants.invoice_detail, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: formdata
        }).then(response => response.json())
            .then(response => {
                this.setState({ loading: false })
                if (response.code === 200) {
                    let mainData = response.data;
                    this.setState({
                        invoicesDetail: mainData,
                        student_course: mainData.student_course,
                        invoice_amount: mainData.invoice_amount,
                        invoice_header: mainData.invoice_header,
                        amount_list: mainData.amount_list,
                        detail_level: mainData.detail_level,
                        date_detail: mainData.date_detail,
                        total_hours: mainData.total_hr,
                        Remark: mainData.invoice_header.remark

                    }, () => {
                        this.forceUpdate()
                        if (this.state.invoice_header.credit_amount == null)
                            this.state.invoice_header.credit_amount = 0;
                        if (this.state.invoice_amount.credit_amount != null) {
                            amountRecieved = parseInt(this.state.invoice_amount.receipt) + parseInt(this.state.invoice_amount.credit_amount)

                        } else {
                            amountRecieved = parseInt(this.state.invoice_amount.receipt)
                        }

                        let text = this.state.invoice_header.remark
                        text = text.replace(/\r?\n/g, "<br>");
                        this.setState({ Remark: text }, () => {
                        })
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
        this.props.navigation.goBack();
    }

    renderItem(item, index) {
        return (
            <View style={{
                width: "90%",
                backgroundColor: "#FBFBF3",
                flexDirection: "row",
                alignItems: "center"
            }}>
                <Text style={{ fontSize: 15, color: "black", width: "10%", textAlign: "center" }}>{index + 1}</Text>
                <Text style={{ fontSize: 15, color: "black", width: "35%" }}>{item.description}</Text>
                <Text style={{ fontSize: 15, color: "black", width: "15%" }}>{"$" + parseFloat(item.rate).toFixed(2)}</Text>
                <Text style={{ fontSize: 15, color: "black", width: "20%" }}>{"" + item.unit}</Text>
                <Text style={{ fontSize: 15, color: "black", width: "20%" }}>{"$" + parseFloat(item.amount).toFixed(2)}</Text>
            </View>
        )
    }

    renderItem2(item, index) {
        let dat = "";
        let week = "";
        if (item.week === "Special Class") {
            dat = item.day;
            week = "Additional Class"

        } else {
            week = item.week;
            dat = moment(item.Monday).format("DD-MMM") + " - " + moment(item.Friday).format("DD-MMM");
        }

        return (
            <View style={{
                width: "90%",
                backgroundColor: "#F3F2EF",
                flexDirection: "row",
                alignItems: "center"
            }}>
                <Text style={{ fontSize: 13, color: "#000", width: "50%" }}>{dat}</Text>
                <Text style={{ fontSize: 13, color: "#000", width: "25%" }}>{week}</Text>
                <Text style={{ fontSize: 13, color: "#000", width: "25%", textAlign: "center" }}>{item.hr}</Text>
            </View>
        )
    }

    onShouldStartLoadWithRequest = (request) => {
        if (Platform.OS === 'ios') return true;
        else
            Linking.openURL(request.url);
    }

    render() {
        //let data=this.state.invoicesDetail;
        //console.log("data::"+JSON.stringify(data));
        //let instructions=data.fuck;
        //console.log("data2::"+JSON.stringify(instructions));
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
                <Header
                    headerText={
                        <Text style={[commonStyles.textStyle, { fontSize: sizes.extraMediumLarge }]}>
                            {"INVOICE DETAIL"}
                        </Text>
                    }
                    leftAction={this.leftAction.bind(this)}
                    leftIcon={require('../../../assets/icons/back.png')}
                    navigation={this.props.navigation}
                />
                <ScrollView>
                    <View style={{ width: '100%', alignItems: 'center', flexDirection: "column" }}>
                        <View style={{ width: "100%", height: 200, flexDirection: "column" }}>
                            <View style={{ margin: 20 }}>
                                <Text style={{ fontSize: 22, color: "#2E5CA2" }}>{this.state.invoice_header.outlet}</Text>
                                <Text style={{ fontSize: 16, color: "#2E5CA2" }}>{"INVOICE"}</Text>
                                <Text style={{ fontSize: 16, color: "#2E5CA2" }}>{this.state.invoice_header.outlet}</Text>
                            </View>
                            <View style={{ width: '100%', alignItems: 'center', height: 70 }}>
                                <TouchableOpacity
                                    style={[styles.buttonStyle, { backgroundColor: colors.green }]}
                                    onPress={() => {
                                        this.props.navigation.navigate("InvoicePayment")
                                    }}>
                                    <Text style={{ color: colors.white }}>{'Make Payment'}</Text>
                                </TouchableOpacity>
                            </View>

                        </View>


                        <Text style={{ fontSize: 25, color: "#2E5CA2", fontWeight: "bold", marginTop: "10%" }}>{"Hello"}</Text>
                        <Text style={{ fontSize: 18, color: "#2E5CA2" }}>{"THIS IS YOUR INVOICE"}</Text>
                        <AvatarComponent
                            style={{ height: 80, width: 80, resizeMode: "contain" }}
                            source={"https://thephysicscafe.com/admin/resources/images/PMC_logo.png"}
                        />
                        <Text style={{ fontSize: 15, color: "black" }}>{this.state.invoice_header.outlet}</Text>
                        <Text style={{ fontSize: 15, color: "black" }}>{"admin@pmc.sg"}</Text>
                        <Text
                            style={{ fontSize: 18, color: "black" }}>{"9100-1235" + " (SMS)"}</Text>
                        <View style={{ width: "90%", backgroundColor: "#fff", flexDirection: "row" }}>
                            <Text style={{ fontSize: 15, color: "black", width: "45%" }}>{"Tax Invoice No"}</Text>
                            <Text style={{ fontSize: 15, color: "black", width: "10%" }}>{":"}</Text>
                            <Text style={{
                                fontSize: 15,
                                color: "black",
                                width: "45%"
                            }}>{this.state.invoice_header.invoice_no_new}</Text>
                        </View>
                        <View style={{ width: "90%", backgroundColor: "#fff", flexDirection: "row" }}>
                            <Text style={{ fontSize: 15, color: "black", width: "45%" }}>{"Level / Subject"}</Text>
                            <Text style={{ fontSize: 15, color: "black", width: "10%" }}>{":"}</Text>
                            <Text style={{
                                fontSize: 15,
                                color: "black",
                                width: "45%"
                            }}>{this.state.detail_level.level}</Text>
                        </View>
                        <View style={{ width: "90%", backgroundColor: "#fff", flexDirection: "row" }}>
                            <Text style={{ fontSize: 15, color: "black", width: "45%" }}>{"Term"}</Text>
                            <Text style={{ fontSize: 15, color: "black", width: "10%" }}>{":"}</Text>
                            <Text style={{
                                fontSize: 15,
                                color: "black",
                                width: "45%"
                            }}>{"Term " + this.state.invoice_header.term + "/" + this.state.invoice_header.year + "\n"
                                + "(" + moment(this.state.invoice_header.start_date).format("DD MMM") + "-"
                                + moment(this.state.invoice_header.end_date).format("DD MMM YYYY") + ")"}</Text>
                        </View>
                        <View style={{ width: "90%", backgroundColor: "#fff", flexDirection: "row" }}>
                            <Text style={{ fontSize: 15, color: "black", width: "45%" }}>{"Date Of Invoice"}</Text>
                            <Text style={{ fontSize: 15, color: "black", width: "10%" }}>{":"}</Text>
                            <Text style={{
                                fontSize: 15,
                                color: "black",
                                width: "45%"
                            }}>{moment(this.state.invoice_header.due_date).format("DD-MMM-YYYY")}</Text>
                        </View>
                        <View style={{ width: "90%", backgroundColor: "#fff", flexDirection: "row" }}>
                            <Text style={{ fontSize: 15, color: "black", width: "45%" }}>{"Due Date"}</Text>
                            <Text style={{ fontSize: 15, color: "black", width: "10%" }}>{":"}</Text>
                            <Text style={{
                                fontSize: 15,
                                color: "black",
                                width: "45%"
                            }}>{moment(this.state.invoice_header.due_date).format("DD-MMM-YYYY")}</Text>
                        </View>
                        <View style={{ width: "90%", backgroundColor: "#fff", flexDirection: "row" }}>
                            <Text style={{ fontSize: 15, color: "black", width: "45%" }}>{"Attached File"}</Text>
                            <Text style={{ fontSize: 15, color: "black", width: "10%" }}>{":"}</Text>
                            {this.state.invoice_header.file == "" ?
                                <Text style={{ fontSize: 15, color: "black", width: "45%" }}>{"N/A"}</Text>
                                : <TouchableOpacity style={{ width: "45%" }}
                                    onPress={() => Linking.openURL("http://thephysicscafe.com/admin/" + this.state.invoice_header.file)}>
                                    <Text style={{
                                        fontSize: 15,
                                        color: "blue",
                                        width: "100%"
                                    }}>{"View Attached File"}</Text>
                                </TouchableOpacity>}

                        </View>


                        <View style={{
                            width: "100%",
                            backgroundColor: "#FBFBF3",
                            flexDirection: "column",
                            marginTop: 20,
                            alignItems: "center"
                        }}>
                            <View style={{
                                width: "90%",
                                backgroundColor: "#799FDB",
                                height: 50,
                                flexDirection: "row",
                                alignItems: "center"
                            }}>
                                <Text style={{
                                    fontSize: 15,
                                    color: "white",
                                    width: "10%",
                                    textAlign: "center"
                                }}>{"#"}</Text>
                                <Text style={{ fontSize: 15, color: "white", width: "35%" }}>{"Description"}</Text>
                                <Text style={{ fontSize: 15, color: "white", width: "15%" }}>{"Rate"}</Text>
                                <Text style={{ fontSize: 15, color: "white", width: "20%" }}>{"Unit"}</Text>
                                <Text style={{ fontSize: 15, color: "white", width: "20%" }}>{"Total"}</Text>
                            </View>


                            <FlatList
                                data={this.state.amount_list}
                                keyExtractor={item => item.id}
                                extraData={this.props}
                                showsVerticalScrollIndicator={false}
                                numColumns={1}
                                contentContainerStyle={{ alignItems: 'center', width: width }}
                                removeClippedSubviews={false}
                                renderItem={({ item, index }) => {
                                    return this.renderItem(item, index);
                                }}
                            />


                            <View style={{
                                width: "90%",
                                backgroundColor: "#FBFBF3",
                                flexDirection: "row",
                                alignItems: "center",
                                marginTop: 10
                            }}>
                                <Text style={{
                                    fontSize: 15,
                                    color: "black",
                                    width: "80%",
                                    fontWeight: "bold",
                                    textAlign: "right"
                                }}>{"Sub Total :"}</Text>
                                <Text style={{
                                    fontSize: 15,
                                    color: "black",
                                    width: "20%"
                                }}>{"$" + parseFloat(this.state.invoice_amount.sub_before_credit).toFixed(2)}</Text>
                            </View>
                            {this.state.invoice_amount.gst_amount > 0 && (
                                <View style={{
                                    width: "90%",
                                    backgroundColor: "#FBFBF3",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginTop: 10
                                }}>
                                    <Text style={{
                                        fontSize: 15,
                                        color: "black",
                                        width: "80%",
                                        fontWeight: "bold",
                                        textAlign: "right"
                                    }}>{"GST (" + (Math.round(this.state.invoice_amount.gst_amount / this.state.invoice_amount.sub_before_credit * 100)) + "%):"}</Text>
                                    <Text style={{
                                        fontSize: 15,
                                        color: "black",
                                        width: "20%"
                                    }}>{"$" + parseFloat(this.state.invoice_amount.gst_amount).toFixed(2)}</Text>
                                </View>
                            )}
                            <View style={{
                                width: "90%",
                                backgroundColor: "#FBFBF3",
                                flexDirection: "row",
                                alignItems: "center",
                                marginTop: 10
                            }}>
                                <Text style={{
                                    fontSize: 15,
                                    color: "black",
                                    width: "80%",
                                    fontWeight: "bold",
                                    textAlign: "right"
                                }}>{"Total :"}</Text>
                                <Text style={{
                                    fontSize: 15,
                                    color: "black",
                                    width: "20%"
                                }}>{"$" + parseFloat(this.state.invoice_amount.total_amount).toFixed(2)}</Text>
                            </View>
                            <View style={{
                                width: "90%",
                                backgroundColor: "#FBFBF3",
                                flexDirection: "row",
                                alignItems: "center",
                                marginTop: 10
                            }}>
                                <Text style={{
                                    fontSize: 15,
                                    color: "black",
                                    width: "80%",
                                    fontWeight: "bold",
                                    textAlign: "right"
                                }}>{"Amount Received :"}</Text>
                                <Text style={{
                                    fontSize: 15,
                                    color: "black",
                                    width: "23%"
                                }}>{`$${amountRecieved > 0 ? '-' : ''}${amountRecieved.toFixed(2)}`}</Text>
                            </View>
                            <View style={{
                                width: "90%",
                                backgroundColor: "#FBFBF3",
                                flexDirection: "row",
                                alignItems: "center",
                                marginTop: 10
                            }}>
                                <Text style={{
                                    fontSize: 15,
                                    color: "black",
                                    width: "80%",
                                    fontWeight: "bold",
                                    textAlign: "right"
                                }}>{"Balance Due :"}</Text>
                                <Text style={{
                                    fontSize: 15,
                                    color: "black",
                                    width: "20%"
                                }}>{"$" + parseFloat(this.state.invoice_amount.balance_credit).toFixed(2)}</Text>
                            </View>
                            <View style={{
                                width: "90%",
                                backgroundColor: "#FBFBF3",
                                flexDirection: "row",
                                alignItems: "center",
                                marginTop: 10
                            }}>
                                <Text style={{
                                    fontSize: 15,
                                    color: "black",
                                    width: "100%",
                                    textAlign: "left"
                                }}>{"Payment should be received before the due date stated in the invoice."}</Text>
                            </View>
                            {this.state.invoice_header.remark != undefined &&
                                <View style={{
                                    // flex: 1
                                    width: "90%",
                                    backgroundColor: "#F3F2EF",
                                    marginTop: 10,
                                    height: 350
                                }}>

                                    <WebView
                                        originWhitelist={['*']}
                                        style={{
                                            flexGrow: 1,
                                            width: '100%',
                                            backgroundColor: "#F3F2EF",
                                            opacity: 0.99
                                        }}
                                        useWebKit={true}
                                        onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
                                        ref={(ref) => { this.webview = ref; }}
                                        onNavigationStateChange={(event) => {
                                            if (event.url !== "www.google.com") {
                                                if (Platform.OS === "android") {
                                                    // this.webview.stopLoading();
                                                    //Linking.openURL(event.url);
                                                } else {
                                                    //this.webview.stopLoading();
                                                    Linking.openURL(event.url);
                                                }

                                            }
                                        }}
                                        //onShouldStartLoadWithRequest={this.openExternalLink}
                                        source={{
                                            html: '<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body><p>' + this.state.invoice_header.remark + '</p></body></html>',
                                            baseUrl: ''
                                        }} />
                                </View>
                            }


                            <View style={{
                                width: "90%",
                                backgroundColor: "#F3F2EF",
                                flexDirection: "row",
                                alignItems: "center",
                                marginTop: 10
                            }}>

                                <Text style={{
                                    fontSize: 15,
                                    color: "#000",
                                    width: "90%",
                                    textAlign: "left", margin: 10
                                }}>{"* Tuition classes can only commence upon full payment of the fees."}</Text>

                            </View>


                            <View style={{
                                width: "90%",
                                backgroundColor: "#F3F2EF",
                                flexDirection: "column",
                                alignItems: "center",
                                marginTop: 10,
                                paddingHorizontal: 10,
                            }}>

                                {/* <Text style={{
                                    fontSize: 15,
                                    color: "#000",
                                    width: "100%",
                                    fontWeight: "bold",
                                    textAlign: "left", marginTop: 10,
                                }}>{"  STUDENT PORTAL LOGIN DETAILS"}</Text>
                                <Text style={{
                                    fontSize: 15,
                                    color: "#000",
                                    width: "100%",
                                    fontWeight: "bold",
                                    textAlign: "left", marginTop: 10,
                                }}>{"\n\n" +
                                "Do you know you can view your invoice, make payment and request for makeup lesson online?" +
                                "\n\n" +
                                "To login to our Student Portal, click"}</Text>
                                <TouchableOpacity style={{width:"100%"}}
                                    onPress={() => Linking.openURL("www.thephysicscafe.com/admin/student_portal")}>
                                    <Text style={{
                                        fontSize: 15,
                                        color: "blue",
                                        width: "100%",
                                        fontWeight: "bold",
                                        textAlign: "left", marginTop: 10,
                                    }}>{"www.thephysicscafe.com/admin/student_portal"}</Text>
                                </TouchableOpacity>
                                <Text style={{
                                    fontSize: 15,
                                    color: "#000",
                                    width: "100%",
                                    fontWeight: "bold",
                                    textAlign: "left", marginTop: 10,
                                }}>{"Email ID: "+this.state.invoice_header.email +
                                "\n" +
                                "Mobile No: "+this.state.invoice_header.phone_no  +
                                "\n\n"}</Text>
                                <Text style={{
                                    fontSize: 15,
                                    color: "#000",
                                    width: "100%",
                                    fontWeight: "bold",
                                    textAlign: "left", marginTop: 10,
                                }}>{"PAYING YOUR INVOICE" +
                                "\n" +
                                "METHOD 1 & METHOD 2 are preferred" +
                                "\n\n" +
                                " Method 1 (PAY BY INTERNET TRANSFER – PAYNOW - Recommended)"}</Text>
                                <Text style={{
                                    fontSize: 15,
                                    color: "#000",
                                    width: "100%",

                                    textAlign: "left",
                                }}>{"\n\n" +
                                "Step 1: Login to your internet banking" +
                                "\n\n" +
                                "Step 2: Pay the outstanding amount to mobile number 91001235." +
                                "\n\n" +
                                "Step 3: Include student’s name, school and level and subject of student clearly in remarks." +
                                "\n\n" +
                                "Step 4: Print screen confirmation page and email to admin@pmc.sg." +
                                "\n\n" +
                                "All steps must be completed so that the finance will need the information to submit payment manually to your account." +
                                "\n\n"}</Text>
                                <Text style={{
                                    fontSize: 15,
                                    color: "#000",
                                    width: "100%",
                                    fontWeight: "bold",
                                    textAlign: "left", marginTop: 10,
                                }}>{"Method 2 (PAY BY INTERNET TRANSFER – MANUAL)"}</Text>
                                <Text style={{
                                    fontSize: 15,
                                    color: "#000",
                                    width: "100%",

                                    textAlign: "left"
                                }}>{"\n\n" +
                                "Step 1: Login to your internet banking" +
                                "\n\n" +
                                "Step 2: Pay the outstanding amount to OCBC Savings Account 687-399253-001 - The Physics Cafe Ptd Ltd - Bank Code (7339) - Branch Code (687)" +
                                "\n\n" +
                                "Step 3: Include student’s name, school and level and subject of student clearly in remarks." +
                                "\n\n" +
                                "Step 4: Print screen confirmation page and email to admin@pmc.sg." +
                                "\n\n" +
                                "All steps must be completed so that the finance will need the information to submit payment manually to your account." +
                                "\n\n"}</Text>


                                <Text style={{
                                    fontSize: 15,
                                    color: "#000",
                                    width: "100%",
                                    fontWeight: "bold",
                                    textAlign: "left", marginTop: 10,
                                }}>{" Method 3 (PAY BY PAYPAL/CREDIT CARD)" +
                                "\n\n"}</Text>
                                <Text style={{
                                    fontSize: 15,
                                    color: "#000",
                                    width: "100%",
                                    textAlign: "left"
                                }}>{"Step 1: Login to your student portal." +
                                "\n\n" +
                                "Step 2: Click [MAKE PAYMENT] and pay by paypal and credit card. (2.5% processing fee applies)" +
                                "\n\n"}</Text> */}
                                <Text style={{
                                    fontSize: 15,
                                    color: "#000",
                                    width: "100%",
                                    fontWeight: "bold",
                                    textAlign: "left", marginTop: 10,
                                }}> {"Note:"} </Text>
                                <Text style={{
                                    fontSize: 15,
                                    color: "#000",
                                    width: "100%",
                                    textAlign: "left",
                                }}>{"" +

                                    "1)All payment or notifications of payment must be received before the first lesson of invoice so that the student will be able to mark their attendance via the automated system." +
                                    "\n\n" +

                                    "2)E-Receipt will be issued within 7 working days upon receiving payment. Kindly contact us if receipt is not issued." +
                                    "\n\n" +

                                    "3) There are no NETS or Credit Card terminal at the centres. "}</Text>
                            </View>


                            <View style={{
                                width: "90%",
                                backgroundColor: "#F3F2EF",
                                flexDirection: "column",
                                alignItems: "center",
                                marginTop: 10
                            }}>

                                <View style={{
                                    width: "100%",
                                    backgroundColor: "#799FDB",
                                    height: 120,
                                    flexDirection: "row",
                                    alignItems: "center"
                                }}>
                                    <Text style={{
                                        fontSize: 13,
                                        color: "#fff",
                                        width: "50%",
                                        textAlign: "center"
                                    }}>{"Date \n" +
                                        "(Monday - Sunday)"}</Text>
                                    <Text style={{
                                        fontSize: 13,
                                        color: "#fff",
                                        width: "25%",
                                        textAlign: "center"
                                    }}>{"Lessons"}</Text>
                                    <Text style={{
                                        fontSize: 13,
                                        color: "#fff",
                                        width: "25%",
                                        textAlign: "center"
                                    }}>{"No. Of Hours\n" +
                                        this.state.detail_level.title}</Text>


                                </View>
                                <FlatList
                                    data={this.state.date_detail}
                                    keyExtractor={item => item.id}
                                    extraData={this.props}
                                    showsVerticalScrollIndicator={false}
                                    numColumns={1}
                                    contentContainerStyle={{ alignItems: 'center', width: width }}
                                    removeClippedSubviews={false}
                                    renderItem={({ item, index }) => {

                                        return this.renderItem2(item, index);
                                    }}
                                />
                                <View style={{
                                    width: "90%",
                                    backgroundColor: "#F3F2EF",
                                    flexDirection: "row",
                                    alignItems: "center"
                                }}>
                                    <Text style={{
                                        fontSize: 13,
                                        color: "#000",
                                        width: "75%",
                                        textAlign: "center"
                                    }}>{"Total no. of hours in Term :"}</Text>
                                    <Text style={{
                                        fontSize: 13,
                                        color: "#000",
                                        width: "25%",
                                        textAlign: "center"
                                    }}>{this.state.total_hours}</Text>
                                </View>

                                <Text style={{
                                    fontSize: 15,
                                    color: "#2E5CA2",
                                    marginTop: 20,
                                    marginBottom: 20,
                                    textAlign: "left"
                                }}>{"1.\tAll lessons scheduled by the school are part of The Physics and Maths Cafe programme. Please refer to www.pmc.sg/classes for available makeup classes."}</Text>
                                <View style={{ width: '100%', alignItems: 'center', height: 70, marginBottom: 20 }}>
                                    <TouchableOpacity
                                        style={[styles.buttonStyle, { backgroundColor: colors.green }]}
                                        onPress={() => {
                                            this.props.navigation.navigate("InvoicePayment")
                                        }}>
                                        <Text style={{ color: colors.white }}>{'Make Payment'}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </View>
                        {/*<WebView
                        originWhitelist={['*']}
                        style={{width:'100%',height:500,
                            backgroundColor: "black",}}
                        useWebKit={true}
                        onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
                        //onShouldStartLoadWithRequest={this.openExternalLink}
                        source={{ html: '<html><head><meta name="viewport"></head><body>'+this.state.description+'</body></html>' }} />*/}
                    </View>
                </ScrollView>
                <ProgressBar visible={this.state.loading} />
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
