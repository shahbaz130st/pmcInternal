import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import { Picker } from 'native-base'
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import { constants } from '../../../Utils/constants'
import * as colors from '../../../styles/colors';
import * as sizes from '../../../styles/sizes';
import commonStyles from '../../../styles/commonStyles';
import ProgressBar from '../../../components/ProgressBar';
import Header from '../../../components/Header';
import DatePicker from 'react-native-datepicker'
import Preference from "react-native-preference";
import moment from "moment";

var radio_props = [];
var radio2_props = [];
export default class SubscribeCourse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            radioData: radio_props,
            radioData2: radio2_props,
            selectedLevel: '',
            selectedSuject: '',
            loading: false,
            value: 0,
            subscribeCourseId: '0',
            announcementsList: [{},],
            announcementsList2: [{},],
            subjects: [],
            date: new Date(),

        }
    }

    componentDidMount() {
        this.getLevel()
    }

    getLevel() {
        this.setState({ loading: true })
        let formdata = new FormData();
        formdata.append("school_id", '3')
        fetch(constants.getLevel, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: formdata
        }).then(response => response.json())
            .then(response => {
                this.setState({ loading: false })
                if (response.code === 200) {
                    let data = response.data
                    data = data.map((item, index) => {
                        return {
                            label: item.level,
                            value: item.id
                        }
                    })
                    this.setState({
                        radioData: data,
                        selectedLevel: data[0].label
                    }, () => {

                        this.getSubject(data[0].label)
                    })

                } else {
                }
            })
            .catch(error => {
                this.setState({ loading: false })
                console.log('onMyCourseTabResponseError:', error);

            });


    }

    getSubject(text) {
        this.setState({ loading: true })
        let formdata = new FormData();
        formdata.append("level", text)
        fetch(constants.getSubject, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: formdata
        }).then(response => response.json())
            .then(response => {
                this.setState({ loading: false })
                if (response.code === 200) {

                    let data = response.data

                    data = data.map((item, index) => {
                        return {
                            label: item.subject,
                            value: item.id
                        }
                    })

                    this.setState({
                        radioData2: data,
                        selectedSuject: data[0].label
                    }, () => {
                        this.getClass(this.state.selectedLevel, this.state.selectedLevel)
                    })

                } else {


                }
            })
            .catch(error => {
                this.setState({ loading: false })
                console.log('onMyCourseTabResponseError:', error);

            });


    }

    getClass(lev, sub) {
        this.setState({ loading: true })
        let formdata = new FormData();
        formdata.append("level", lev)
        formdata.append("level", sub)
        fetch(constants.getClass, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: formdata
        }).then(response => response.json())
            .then(response => {
                this.setState({ loading: false })
                if (response.code === 200) {
                    let data = response.data
                    this.setState({
                        subjects: data,
                        subscribeCourseId: data[0].id
                    })
                } else {
                }
            })
            .catch(error => {
                this.setState({ loading: false })
                console.log('onMyCourseTabResponseError:', error);
            });


    }
    subscribeCourse() {
        this.setState({ loading: true })
        let formdata = new FormData();
        formdata.append("enroll_date", moment(this.state.date).format("YYYY-MM-DD"))
        formdata.append("schedule_id[0]", this.state.subscribeCourseId)
        formdata.append("student_id", Preference.get('user_id'))
        fetch(constants.subscribeCourse, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: formdata
        }).then(response => response.json())
            .then(response => {
                this.setState({ loading: false })
                if (response.code === 200) {
                    this.props.navigation.navigate('AppDrawerNavigator');
                } else {
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

    renderItem(item, index) {
        return (
            <View style={[styles.itemContainerStyle, { marginTop: index == 0 ? 0 : 10 }]}>
                <RadioForm
                    radio_props={this.state.radioData}
                    initial={0}
                    buttonSize={10}
                    onPress={(value) => {
                        this.setState({ value: value })
                        const item = this.state.radioData.find((item) => item.value == value)
                        this.setState({ selectedLevel: item.label })
                        this.getSubject(item.label)

                    }}
                />

            </View>
        )
    }

    renderItem2(item, index) {
        return (
            <View style={[styles.itemContainerStyle, { marginTop: index == 0 ? 0 : 10 }]}>
                <RadioForm
                    radio_props={this.state.radioData2}
                    initial={0}
                    buttonSize={10}
                    onPress={
                        (value) => {
                            this.setState({ value: value })
                            const item = this.state.radioData2.find((item) => item.value == value)
                            this.setState({ selectedSuject: item.label })
                            this.getClass(this.state.selectedLevel, this.state.selectedLevel)
                        }}
                />
            </View>
        )
    }


    render() {
        return (

            <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
                <Header
                    headerText={
                        <Text style={[commonStyles.textStyle, { fontSize: sizes.extraMediumLarge }]}>
                            {"SUBSCRIBE COURSE"}
                        </Text>
                    }
                    leftAction={this.leftAction.bind(this)}
                    leftIcon={require('../../../assets/icons/back.png')}
                    navigation={this.props.navigation}
                />

                <ScrollView>
                    <View style={{ margin: 20 }}>
                        {/* <Text style={{ fontSize: 20 }}>SUBSCRIBE NEW COURSE</Text>
                        <View style={{width:'100%',height:10,backgroundColor:'red'}}/>
                        <View style={{width:'100%',height:20,backgroundColor:'blue'}}/> */}
                        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 5, marginTop: 0 }}>PLEASE SELECT
                            THE SUBJECT AND SCHEDULE THAT YOU WANT TO ATTEND</Text>
                        <Text style={{ fontSize: 14, color: 'red' }}>You can register additional subject here. Please send
                            an email to admin@pmc.sg if you would like to transfer your existing class</Text>
                        <Text style={{ fontSize: 14, color: 'red' }}>Unable to subscribe existing subject. Please sms to
                            9100-1235 for manual registration of optional workshop.</Text>
                        <Text style={{ fontSize: 14, marginTop: 10, marginBottom: 10, fontWeight: 'bold' }}>LEVEL
                            <Text style={{ color: 'red', }}>*</Text>
                        </Text>

                        <FlatList
                            data={this.state.announcementsList}
                            keyExtractor={item => item.id}
                            extraData={this.state.announcementsList}
                            showsVerticalScrollIndicator={false}
                            numColumns={2}
                            removeClippedSubviews={false}
                            style={{ width: '100%' }}
                            renderItem={({ item, index }) => {
                                return this.renderItem(item, index);
                            }}
                        />
                        <Text style={{ fontSize: 14, marginTop: 10, marginBottom: 10, fontWeight: 'bold' }}>SUBJECTS
                            <Text style={{ color: 'red', }}>*</Text>
                        </Text>
                        <FlatList
                            data={this.state.announcementsList2}
                            keyExtractor={item => item.id}
                            extraData={this.state.announcementsList2}
                            showsVerticalScrollIndicator={false}
                            numColumns={2}
                            removeClippedSubviews={false}
                            style={{ width: '100%' }}
                            renderItem={({ item, index }) => {
                                return this.renderItem2(item, index);
                            }}
                        />

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, marginBottom: 20 }}>

                            <Text style={{ fontSize: 14, marginTop: 10, fontWeight: 'bold' }}>Class
                                <Text style={{ color: 'red', }}>*</Text>
                            </Text>
                            <Picker
                                selectedValue={this.state.subscribeCourseId}
                                style={{ height: 40, width: "45%" }}
                                pickerStyleType={{ fontSize: 10 }}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState({ subscribeCourseId: itemValue })
                                }>
                                {this.state.subjects.map((item, index) => {
                                    return <Picker.Item label={item.title + " " + item.day + "\n - " + item.start_time + " to " + item.end_time} value={item.id} />
                                })}
                            </Picker>
                            {/* <TouchableOpacity onPress={() => {
                                if (this.datePicker) {
                                    this.datePicker.onPressDate()
                                }
                            }}> */}
                            <DatePicker
                                ref={ref => this.datePicker = ref}
                                style={{ width: 100, }}
                                date={this.state.date}
                                mode="date"
                                placeholder="select date"
                                format="YYYY-MM-DD"
                                minDate={new Date().getUTCDate()}
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                customStyles={{
                                    dateIcon: {
                                        position: 'absolute',
                                        left: 400,
                                        top: 4,
                                        marginLeft: 0,


                                    },
                                    dateInput: {
                                        marginLeft: 0,
                                        flexDirection: 'row',
                                        color: '#00314a',
                                        borderWidth: 1
                                    }
                                }}
                                onDateChange={(date) => {
                                    this.setState({ date: date })
                                }}
                            />
                            {/* </TouchableOpacity> */}
                        </View>
                        <TouchableOpacity onPress={() => {
                            this.subscribeCourse()
                        }} style={{
                            width: '100%',
                            height: 50,
                            borderRadius: 10,
                            backgroundColor: '#007AFF',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 5
                        }}>
                            <Text style={{ fontSize: 18, color: 'white' }}>
                                Confirm
                            </Text>
                        </TouchableOpacity>

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
        width: '50%',
        justifyContent: 'center'
    },
});
