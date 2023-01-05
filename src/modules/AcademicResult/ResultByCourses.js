import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    FlatList,
    Dimensions, Picker
} from 'react-native';
import * as colors from '../../styles/colors';
import * as sizes from '../../styles/sizes';
import commonStyles from '../../styles/commonStyles';
import Header from '../../components/Header';
const { height, width } = Dimensions.get('window');
import Preference from 'react-native-preference';
import { constants } from '../../Utils/constants';
import ProgressBar from '../../components/ProgressBar';
export default class CoursesResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            announcementsList: []
        }
    }

    leftAction() {
        this.props.navigation.goBack();
    }

    componentDidMount() {
        this.topStudent()
    }
    topStudent() {
        this.setState({ loading: true })
        let formdata = new FormData();
        formdata.append("student_id", Preference.get('user_id'))
        fetch(constants.top_10_students, {
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
                        resultList: response.data
                    }, () => {
                        this.forceUpdate()
                    })
                } else {
                }
            })
            .catch(error => {
                this.setState({ loading: false })
                console.log('onMyCourseTabResponseError:', error);
            });


    }

    renderItem(item, index) {
        let students = item.task_list
        return (
            <View style={{ width: "100%", backgroundColor: "#F3EEC7", marginTop: 10, alignItems: "center", justifyContent: "center", borderRadius: 20 }}>
                <View style={{ marginStart: 20, marginEnd: 20, marginTop: 20, marginBottom: 20, width: width - 60 }}>
                    <Text style={{ fontSize: 18 }}>{"All Course"}</Text>
                    <Text style={{ fontSize: 18 }}>{item.title}</Text>
                    <View style={{ width: "100%", height: 3, borderRadius: 2, backgroundColor: "#FFAD1E", marginTop: 10, marginBottom: 10 }} />
                    <View style={{ width: "100%", height: 70, flexDirection: "row", alignItems: "center" }}>
                        <Image source={require("../../assets/images/icon3.png")} style={{ width: 70, height: 70, resizeMode: "contain" }} />
                        <Text style={{ fontSize: 21, marginStart: 20 }}>{"Top 10 Students"}</Text>
                    </View>
                    <View style={{ width: "100%", height: 50, flexDirection: "row", alignItems: "center", borderBottomWidth: 2, borderColor: "#F0E3B0" }}>
                        <Text style={{ fontSize: 21, fontWeight: "bold", width: "50%" }}>{"Student Name"}</Text>
                        <Text style={{ fontSize: 21, marginStart: 50, fontWeight: "bold", width: "50%" }}>{"Score"}</Text>
                    </View>
                    {
                        students.map((item, index) => {
                            return (
                                <View style={{ width: "100%", height: 50, flexDirection: "row", alignItems: "center", borderBottomWidth: 0.5, borderColor: "#F0E3B0" }}>
                                    <Text style={{ fontSize: 18, width: "50%" }}>{item.name}</Text>
                                    <Text style={{ fontSize: 18, width: "50%", textAlign: "center" }}>{item.mark}</Text>
                                </View>
                            )
                        })
                    }


                </View>

            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
                <Header
                    headerText={
                        <Text style={[commonStyles.textStyle, { fontSize: sizes.extraMediumLarge }]}>
                            {"Courses Result"}
                        </Text>
                    }
                    leftAction={this.leftAction.bind(this)}
                    leftIcon={require('../../assets/icons/back.png')}
                    navigation={this.props.navigation}
                />
                <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F2F2F2', }}>
                    <View style={{ flex: 1, margin: 10, marginBottom: 0, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                        <FlatList
                            data={this.state.resultList}
                            keyExtractor={item => item.id}
                            extraData={this.props}
                            showsVerticalScrollIndicator={false}
                            numColumns={1}
                            contentContainerStyle={{ alignItems: 'center' }}
                            style={{ marginStart: 10, marginEnd: 10 }}
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
        borderRadius: 20,
        padding: 15,
        borderLeftColor: colors.tintColor,
        backgroundColor: colors.white,
        borderLeftWidth: 5,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    buttonStyle: {
        width: '35%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
    }
});
