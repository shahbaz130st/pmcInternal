import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    FlatList, PushNotificationIOS,
    Dimensions,
    Platform
} from 'react-native';
import * as colors from '../../../styles/colors';
import * as sizes from '../../../styles/sizes';
import commonStyles from '../../../styles/commonStyles';
import { constants } from '../../../Utils/constants'
import Preference from 'react-native-preference';
import Header from '../../../components/Header';
const { height, width } = Dimensions.get('window');
import ProgressBar from '../../../components/ProgressBar';
export default class Announcements extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            userId: 0,
            announcementsList: [
                {
                    id: 0,
                    title: '',
                    ann_year: "",
                    subject: ''
                },

            ]
        }
    }

    leftAction() {
        this.props.navigation.goBack();
    }
    componentDidMount() {
        if (Platform.OS === "ios") {
            PushNotificationIOS.setApplicationIconBadgeNumber(0);
        }

        this.onAnnouncementScreen()
    }

    onAnnouncementScreen() {
        this.setState({ loading: true })
        let formdata = new FormData();
        formdata.append("student_id", Preference.get('user_id'))
        formdata.append("limit", '10')
        formdata.append("offset", '2')
        fetch(constants.announcement, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: formdata
        }).then(response => response.json())
            .then(response => {
                this.setState({ loading: false })
                if (response.code === 200) {
                    this.setState({
                        announcementsList: response.data.announcement_list,
                        userId: response.data.student.id

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

    renderItem(item, index) {
        return (
            <TouchableOpacity
                style={[styles.itemContainerStyle, { marginTop: index == 0 ? 0 : 10 }]}
                onPress={() => {
                    this.props.navigation.navigate("AnnouncementDetails", { selectedItem: item.id, userId: this.state.userId })
                }}>
                {
                    item?.id !== item?.pinned &&
                    <Image source={require("../../../assets/icons/star.png")} style={{ height: 15, width: 15, tintColor: "red",marginRight:10 }} />
                }
                <View style={{ width: '80%' }}>


                    <Text style={{ textTransform: 'uppercase', fontSize: sizes.large, fontWeight: 'bold' }}>
                        {item.title}
                    </Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: sizes.large, marginRight: 20 }}>{item.date}</Text>
                        <Text style={{ fontSize: sizes.large }}>{item.subject}</Text>
                    </View>
                </View>
                <View style={{ width: '20%', justifyContent: 'flex-end', flexDirection: 'row' }}>
                    <Image
                        style={styles.arrowStyle}
                        source={require('../../../assets/icons/arrow.png')}
                    />
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
                <Header
                    headerText={
                        <Text style={[commonStyles.textStyle, { fontSize: sizes.extraMediumLarge, fontWeight: 'bold' }]}>
                            {"ANNOUNCEMENTS"}
                        </Text>
                    }
                    leftAction={this.leftAction.bind(this)}
                    leftIcon={require('../../../assets/icons/back.png')}
                    navigation={this.props.navigation}
                />
                <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#F2F2F2' }}>
                    {/* <Text style={commonStyles.textStyle}>{"Not Designed Yet!"}</Text> */}
                    <View style={{ height: 70, width: '100%', backgroundColor: '#f3c323', justifyContent: 'center' }}>
                        <Text style={{ marginLeft: 20, fontWeight: "bold", fontSize: sizes.large }}>{"Announcements"}</Text>
                    </View>
                    <View style={{ flex: 1, width: '100%', alignItems: 'center', margin: 10, backgroundColor: '#F2F2F2', }}>
                        <FlatList
                            data={this.state.announcementsList}
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
                    </View>
                </View>
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
        width: '94%'
    },
    arrowStyle: {
        resizeMode: 'contain',
        width: 15,
        height: 15,
        marginLeft: 5,

    },
});
