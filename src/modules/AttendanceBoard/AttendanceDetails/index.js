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
    Dimensions
} from 'react-native';
// import Preference from 'react-native-preference';
import * as colors from '../../../styles/colors';
import * as sizes from '../../../styles/sizes';
import commonStyles from '../../../styles/commonStyles';
import Header from '../../../components/Header';
import Preference from 'react-native-preference';
import { constants } from '../../../Utils/constants'
import ProgressBar from '../../../components/ProgressBar';
import moment from 'moment';
export default class AttendanceDetails extends Component {
    constructor(props) {
        super(props);
        const { params } = props.navigation.state
        this.state = {
            loading: false,
            selectedItem: params.selectedItem,
            schedule: params.schedule,
            courseTitle: '',
            announcementsList: [
                // {
                //     id: 0,
                //     date: '',
                //     status: '',
                // },
            ]
        }
    }

    leftAction() {
        this.props.navigation.goBack();
    }
    componentDidMount() {
        this.onMyCourseFlatAttendancePress()
    }
    onMyCourseFlatAttendancePress() {
        this.setState({ loading: true })
        let formdata = new FormData();
        formdata.append("student_id", Preference.get('user_id'))
        formdata.append("schedule_id", this.state.schedule)
        formdata.append("course_id", this.state.selectedItem)
        fetch(constants.attendance, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: formdata
        }).then(response => response.json())
            .then(response => {
                this.setState({ loading: false })
                console.log("onMyCourseFlatAttendancePressApi-->", "-" + JSON.stringify(response));
                if (response.code === 200) {

                    this.setState({
                        courseTitle: response.data.course.title,
                        announcementsList: response.attendance_list
                    }, () => {
                        this.forceUpdate()
                    })
                } else {


                }
            })
            .catch(error => {
                this.setState({ loading: false })
                console.log('onMyCourseFlatAttendancePressError:', error);

            });


    }


    renderItem(item, index) {
        let status="-";

        //console.log("Dates:::", moment(item.enroll_date).format('YYYY-MM-DD') +"-------"+ moment(item.date).format('YYYY-MM-DD'))
        if(item.date>= item.withdraw && item.withdraw != '0000-00-00'){
            if(item.status == 2){
                status= 'Withdraw';
            }else{
                status= 'Transfer';
            }
        }else if(moment(item.enroll_date).format('YYYY-MM-DD') > moment(item.date).format('YYYY-MM-DD')){
            //console.log("Dates:::", moment(item.enroll_date).format('YYYY-MM-DD') +"-------"+ moment(item.date).format('YYYY-MM-DD'))
            status= '-';
        } else{
            console.log("Dateaa:::",   moment(new Date()).format('YYYY-MM-DD')  +"-------"+ item.date)
            if(item.attendance ===  0 &&  moment(new Date()).format('YYYY-MM-DD') > moment( item.date).format('YYYY-MM-DD')){
                status= 'Absent';
            }else if(item.attendance.length>0){
                console.log("attendance:::")
                for (let i=0;i<item.attendance.length ;i++) {
                    if(item.attendance[i].att === "1"){
                        status= 'Normal Class';
                    }else{
                        status= 'Makeup Class'+  moment(item.attendance[i].att_date).format('YYYY-MM-DD');
                    }
                }
            }
        }
       /* if(item.attendance ==  0)
        {
            status= "Absent";
        }
        else if(!(item.attendance ==  0))
        {
            let att=item.attendance
            if(att[0].att==1)
            {
                status= "Normal Class";
            }
            //status= "Present";
        }*/
        return (
            <View style={[styles.itemContainerStyle, { marginTop: index == 0 ? 0 : 10 }]}>
               <Text style={{ width: '15%', fontSize: 18, }}>{index+1+'.'}</Text>
                <Text style={{ width: '35%', fontSize: 18, }}>{moment(item.date).format("DD MMM YYYY")}</Text>
                <Text style={{ width: '35%', fontSize: 18, }}>{status}</Text>

            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
                <Header
                    headerText={
                        <Text style={[commonStyles.textStyle, { fontSize: sizes.extraMediumLarge }]}>
                            {"ATTENDANCE DETAILS"}
                        </Text>
                    }
                    leftAction={this.leftAction.bind(this)}
                    leftIcon={require('../../../assets/icons/back.png')}
                    navigation={this.props.navigation}
                />
                <View style={{ alignItems: 'center', }}>
                    <Text style={{ fontSize: 22, marginTop: 10 }}>{this.state.courseTitle}</Text>
                    <Text style={{ fontSize: 12, marginTop: 10 }}>Attendance for additional lesson is not reflected here</Text>
                </View>
                <View style={{ width: '100%', flexDirection: 'row', marginTop: 15, justifyContent: 'center' }}>
                    <Text style={{ width: '15%', fontSize: 18,  }}>No.</Text>
                    <Text style={{ width: '35%', fontSize: 18,  }}>Date</Text>
                    <Text style={{ width: '35%', fontSize: 18,  }}>status</Text>

                </View>
                <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 10,paddingBottom:10 }}>
                    <View style={{ flex: 1, margin: 10, marginBottom: 0, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                        <FlatList
                            data={this.state.announcementsList.sort((a, b) => a.date.localeCompare(b.date))}
                            keyExtractor={item => item.id}
                            extraData={this.props}
                            showsVerticalScrollIndicator={false}
                            numColumns={1}
                            contentContainerStyle={{ alignItems: 'center' }}
                            style={{ width: '100%' }}
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
      flexDirection:'row',
      width:'100%'
    },
});
