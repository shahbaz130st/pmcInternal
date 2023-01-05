import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    SafeAreaView, FlatList, Alert, Modal
} from 'react-native';
import * as colors from '../../../styles/colors';
import * as sizes from '../../../styles/sizes';
import commonStyles from '../../../styles/commonStyles';
import Header from '../../../components/Header';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ProgressBar from '../../../components/ProgressBar';
import { constants } from "../../../Utils/constants";
import Preference from "react-native-preference";
import AvatarComponent from "../../../components/AvatarComponent";
import { screenAspectRatio } from "react-native-calendars/src/expandableCalendar/commons";
import ImageViewer from 'react-native-image-zoom-viewer';
import ImageView from "react-native-image-viewing";

export default class MyRewardPoint extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            rewardPoints: "",
            allItems: [],
            visible: false,
            currentImage:null
        }
    }

    leftAction() {
        this.props.navigation.goBack();
    }

    componentDidMount() {
        this.getAllItems();
    }

    getAllItems() {
        this.setState({ loading: true })
        let formdata = new FormData();
        formdata.append("student_id", Preference.get('user_id'))
        fetch(constants.rewardPoint, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: formdata
        }).then(response => response.json())
            .then(response => {
                this.setState({ loading: false })
                if (response.code == 200) {
                    let rewardPoints = 0;
                    this.sortArray(response.data.redeem_list)
                    response.data.redeem_list.sort((a, b) => parseFloat(a.point) - parseFloat(b.point));


                    if (parseInt(response.data.student_point.total_point) > 0) {

                        rewardPoints = response.data.student_point.total_point;

                    }

                    this.setState({
                        allItems: response.data.redeem_list,
                        rewardPoints: rewardPoints
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

    sortArray(array) {
        let sortedArray = [];
        let tmp = array[0]
        for (let i = 0; i < array.length; i++) {
            for (let j = i + 1; j < array.length - 1; j++) {
                if (parseInt(array[j].point) > parseInt(tmp.point)) {
                    tmp = array[j];
                }

            }
            sortedArray.push(tmp)
        }
    }

    redeemItem(item) {
        if (parseInt(this.state.rewardPoints) >= item.point) {

            Alert.alert(
                'Operation Information',
                'Are you sure you want to redeem?',
                [
                    {
                        text: 'No, May be Next time',
                        onPress: () => {
                        },
                        style: 'cancel',
                    },
                    { text: 'Yes', onPress: () => this.redeemPoints(item) },
                ]
            );


        } else {
            Alert.alert("Operation Information", "You don't have enough point to redeem this. Please try again later.");
        }
    }

    redeemPoints(item) {
        this.setState({ loading: true })
        let formdata = new FormData();
        formdata.append("student_id", Preference.get('user_id'))
        formdata.append("id", item.id)
        fetch(constants.requestRedeem, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: formdata
        }).then(response => response.json())
            .then(response => {
                this.setState({ loading: false })
                if (response.code == 200) {
                    Alert.alert("Success", "Your redemption request is submitted. PMC student affairs will be reaching out to you soon. :)")
                    this.getAllItems();
                } else {
                    Alert.alert("Server Error!", "Please try again.")
                }
            })
            .catch(error => {
                this.setState({ loading: false })
                console.log('onMyCourseTabResponseError:', error);

            });
    }

    renderItem(item, index) {
        return (
            <View style={styles.itemContainerStyle}>
                <TouchableOpacity onPress={() => this.setState({
                    currentImage:constants.image_Url + item.img,
                    visible: true
                })}>
                    <AvatarComponent
                        style={{ width: 100, height: 100, resizeMode: "contain", marginTop: 10 }}
                        source={constants.image_Url + item.img}
                    />
                </TouchableOpacity>
                <Text style={{
                    color: "#FF0000",
                    fontSize: 15,
                    textAlign: 'center',
                    height: 70,
                    marginTop: 10,
                }}>{item.title}</Text>
                <Text style={{
                    color: "#000",
                    fontSize: 15,
                    textAlign: 'center',
                    height: 120,
                }}>{item.description}</Text>

                <TouchableOpacity onPress={() => this.redeemItem(item)}
                    style={{
                        height: 40,
                        width: "80%",
                        borderWidth: 3,
                        borderColor: "#D1E7F5",
                        borderRadius: 35,
                        marginTop: 10,
                        marginBottom: 10
                    }}>
                    <View style={{ width: "100%", height: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                        <Text style={{
                            color: "#000",
                            fontSize: 13,
                            textAlign: 'center',
                            height: 120,
                        }}>{item.point + "pts"}</Text>
                    </View>
                    <View style={{
                        width: "100%",
                        height: 20,
                        borderBottomLeftRadius: 20,
                        borderBottomRightRadius: 20,
                        backgroundColor: "#0075D1"
                    }}>
                        <Text style={{
                            color: "#fff",
                            fontSize: 13,
                            textAlign: 'center',
                            height: 120,
                        }}>{"Redeem Now"}</Text>
                    </View>
                </TouchableOpacity>

            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>

{/* <Modal visible={this.state.visible} transparent={true}>
                <ImageViewer imageUrls={[{url:this.state.currentImage}]}/>
            </Modal> */}
            <ImageView
  images={[{
      uri:this.state.currentImage
  }]}
  imageIndex={0}
  visible={this.state.visible}
  onRequestClose={() => this.setState({visible:false})}
/>
                <Header
                    headerText={
                        <Text style={[commonStyles.textStyle, { fontSize: sizes.extraMediumLarge }]}>
                            {"MY REWARD POINTS"}
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
                    style={{ flex: 1, width: "100%" }}>
                    <View style={{ height: '100%', alignItems: 'center' }}>

                        <View style={styles.groupStyle}>
                            <Text style={{
                                color: "grey",
                                fontSize: 18,
                                textAlign: 'center',
                            }}>{'Redemption items are subject to availability and PMC reserves the right, at any time and in its sole discretion, to substitute, withdraw, add to or alter, any of the items offered under the Points System without notice to the students.'}</Text>
                        </View>

                        <View style={{
                            width: "90%",
                            borderWidth: 5,
                            borderRadius: 15,
                            borderColor: "#FFD057",
                            alignItems: 'center',
                            marginTop: 20
                        }}>
                            <View style={styles.groupStyle}>
                                <Text style={{
                                    color: "#000",
                                    fontSize: 20,
                                    textAlign: 'center',
                                    fontWeight: "bold",
                                    marginTop: 10
                                }}>{'YOUR PMC CURRENCY'}</Text>
                            </View>

                            <View style={styles.groupStyle}>
                                <Text style={{
                                    color: "black",
                                    fontSize: 17,
                                    textAlign: 'center',
                                    marginTop: 10
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
                                        }}>{'refer friends'}</Text>
                                    {' to earn more PMC currency'}
                                </Text>
                            </View>

                            <View style={styles.groupStyle}>
                                <Text style={{
                                    color: "black",
                                    fontSize: 40,
                                    textAlign: 'center',
                                    fontWeight: "bold",
                                    marginTop: 10
                                }}>{this.state.rewardPoints}</Text>
                            </View>
                        </View>

                        <View style={styles.groupStyle}>
                            <Text style={{
                                color: "#000",
                                fontSize: 18,
                                textAlign: 'center',
                            }}>{'SELECT ANY OF THE BELOW TO REDEEM YOUR POINTS'}</Text>
                        </View>

                        <View style={styles.groupStyle}>
                            <Text style={{
                                color: "#FF0000",
                                fontSize: 18,
                                textAlign: 'center',
                            }}>{'All students are only allowed to redeem up to a maximum of 5 items in a week. Students are reminded to be considerate to respect the rules above.'}</Text>
                        </View>


                        <View style={{
                            flex: 1,
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#F2F2F2',
                        }}>
                            <View style={{
                                flex: 1,
                                margin: 10,
                                marginBottom: 0,
                                width: '100%',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <FlatList
                                    data={this.state.allItems}
                                    keyExtractor={item => 'item' + item.id}
                                    extraData={this.state.allItems}
                                    showsVerticalScrollIndicator={false}
                                    numColumns={2}
                                    style={{ width: '100%' }}
                                    removeClippedSubviews={true}
                                    maxToRenderPerBatch={4}
                                    renderItem={({ item, index }) => {
                                        return this.renderItem(item, index);
                                    }}
                                    windowSize={4}
                                />
                            </View>
                        </View>

                    </View>

                </KeyboardAwareScrollView>
                <ProgressBar visible={this.state.loading} />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    groupStyle: {
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
        borderRadius: 20,
        margin: 6,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        width: '47%',
    },
});
