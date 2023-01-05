import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    Text,
    View,
    TouchableOpacity,
    ScrollView, Alert,
    SafeAreaView,
} from 'react-native';
import { Picker } from 'native-base'
import * as colors from '../../../styles/colors';
import * as sizes from '../../../styles/sizes';
import commonStyles from '../../../styles/commonStyles';
import Header from '../../../components/Header';
import { constants } from "../../../Utils/constants";
import Preference from "react-native-preference";
import ProgressBar from '../../../components/ProgressBar';

export default class RequestForMakeup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            courses: [],
            selectedCourse: '0',
            coursesDate: [],
            selectedCourseDate: '0',
            coursesNewDate: [],
            selectedCourseNewDate: '0',
        }
    }

    componentDidMount() {
        this.getCourses()
    }

    leftAction() {
        this.props.navigation.goBack();
    }


    getCourses() {
        this.setState({ loading: true })
        let formdata = new FormData();
        formdata.append("student_id", Preference.get('user_id'))
        fetch(constants.getCourseList, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: formdata
        }).then(response => response.json())
            .then(response => {
                this.setState({ loading: false })
                let data = response.course_list
                this.setState({
                    courses: data,
                })
            })
            .catch(error => {
                this.setState({ loading: false })
                console.log('onMyCourseTabResponseError:', error);

            });
    }

    setCourseDate(val) {
        this.setState({
            loading: true,
            coursesDate: [],
            coursesNewDate: []
        })
        let formdata = new FormData();
        formdata.append("course", val)
        fetch(constants.getClassDates, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: formdata
        }).then(async response => {
            const responseText = await response.text();
            return JSON.parse(responseText)
        })
            .then(response => {
                this.setState({ loading: false })
                let data = response
                this.setState({
                    coursesDate: data,
                })
            })
            .catch(error => {
                this.setState({ loading: false })
                console.log('onMyCourseTabResponseError:', error);

            });


    }

    getCoursesNewDates(val) {
        this.setState({ loading: true })
        let formdata = new FormData();
        formdata.append("course", this.state.selectedCourse)
        formdata.append("date", val)
        fetch(constants.getCourseDates, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: formdata
        }).then(response => response.json())
            .then(response => {
                this.setState({ loading: false })
                let data = response
                this.setState({
                    coursesNewDate: data,
                })
            })
            .catch(error => {
                this.setState({ loading: false })
                console.log('onMyCourseTabResponseError:', error);

            });


    }

    submitNewCourse() {
        this.setState({ loading: true })
        let formdata = new FormData();
        formdata.append("student_id", Preference.get('user_id'))
        formdata.append("schedule_id", this.state.selectedCourse)
        formdata.append("day", this.state.selectedCourseDate)
        formdata.append("make_up", this.state.selectedCourseNewDate)
        fetch(constants.AddMakeupClass, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: formdata
        }).then(response => response.json())
            .then(response => {
                this.setState({ loading: false })
                if (response.code === 200) {
                    Alert.alert("Success!", "You request for a makeup is submitted.")
                    this.props.navigation.goBack();
                } else {
                    Alert.alert("Error!", "Sorry try again later.")
                }

            })
            .catch(error => {
                this.setState({ loading: false })
                console.log('onMyCourseTabResponseError:', error);

            });
    }


    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
                <Header
                    headerText={
                        <Text style={[commonStyles.textStyle, { fontSize: sizes.extraMediumLarge }]}>
                            {"REQUEST FOR MAKEUP"}
                        </Text>
                    }
                    leftAction={this.leftAction.bind(this)}
                    leftIcon={require('../../../assets/icons/back.png')}
                    navigation={this.props.navigation}
                />
                <View style={{ height: "100%", flexDirection: "column", margin: 10 }}>
                    <View style={{
                        width: "90%",
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 10,
                        marginBottom: 20
                    }}>

                        <Text style={{ fontSize: 14, marginTop: 10, fontWeight: 'bold' }}>{'Class'}
                            <Text style={{ color: 'red', }}>{'*'}</Text>
                        </Text>
                        <View style={{ height: 40, width: "45%", backgroundColor: "#F4F4F4" }}>
                            <Picker
                                selectedValue={this.state.selectedCourse}
                                placeholder={'Select Course'}
                                iosHeader={'Select Course'}
                                style={{ height: 40, width: "100%" }}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState({ selectedCourse: itemValue }, () => {
                                        this.setCourseDate(itemValue)
                                    })
                                }>
                                {this.state.courses.map((item, index) => {
                                    return <Picker.Item label={item.course_title} value={item.id} />
                                })}
                            </Picker>
                        </View>
                    </View>
                    <View style={{
                        width: "90%",
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 10,
                        marginBottom: 20
                    }}>

                        <Text style={{ fontSize: 14, marginTop: 10, fontWeight: 'bold' }}>{'ORIGINAL DEFAULT \n CLASS'}
                            <Text style={{ color: 'red', }}>{'*'}</Text>
                        </Text>
                        <View style={{ height: 40, width: "45%", backgroundColor: "#F4F4F4" }}>
                            <Picker
                                selectedValue={this.state.selectedCourseDate}
                                placeholder={'Select Course Default Date'}
                                iosHeader={'Select Course Default Date'}
                                style={{ height: 40, width: "100%" }}
                                onValueChange={(itemValue, itemIndex) => {
                                    this.setState({ selectedCourseDate: itemValue }, () => {
                                        this.getCoursesNewDates(itemValue)
                                    })
                                }
                                }>
                                {this.state.coursesDate.map((item, index) => {
                                    return <Picker.Item label={item.day} value={item.day} />
                                })}
                            </Picker>
                        </View>
                    </View>
                    <View style={{
                        width: "90%",
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 10,
                        marginBottom: 20
                    }}>

                        <Text style={{ fontSize: 14, marginTop: 10, fontWeight: 'bold' }}>{'CHANGE TO'}
                            <Text style={{ color: 'red', }}>{'*'}</Text>
                        </Text>
                        <View style={{ height: 40, width: "45%", backgroundColor: "#F4F4F4" }}>
                            <Picker
                                selectedValue={this.state.selectedCourseNewDate}
                                placeholder={'Select Course Change Date'}
                                iosHeader={'Select Course Change Date'}
                                style={{ height: 40, width: "100%" }}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState({ selectedCourseNewDate: itemValue })
                                }>
                                {this.state.coursesNewDate.map((item, index) => {
                                    return <Picker.Item label={item.day} value={item.date} />
                                })}
                            </Picker>
                        </View>
                    </View>

                    <Text style={{ color: 'red', fontSize: 15 }}>{'* Please do not request for classes if it is marked as Sold Out.\n Please send an email to admin@pmc.sg if you would like to transfer your existing class.'}</Text>

                    <TouchableOpacity onPress={() => {
                        this.submitNewCourse()
                    }} style={{
                        width: '100%',
                        height: 50,
                        borderRadius: 10,
                        backgroundColor: '#007AFF',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 10
                    }}>
                        <Text style={{ fontSize: 18, color: 'white' }}>
                            Request
                        </Text>
                    </TouchableOpacity>

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
    }
});
