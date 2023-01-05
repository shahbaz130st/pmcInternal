import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Arrow, FlatList
} from 'react-native';
import * as colors from '../../../styles/colors';
import * as sizes from '../../../styles/sizes';
import commonStyles from '../../../styles/commonStyles';
import Header from '../../../components/Header';
import Preference from 'react-native-preference';
import {constants} from '../../../Utils/constants';
import ProgressBar from '../../../components/ProgressBar';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import moment from 'moment';
import _ from 'lodash';

export default class Timetable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            listOfItems: [],
            selectedItem: '',
            setDatesCalender: "",
        }
    }

    leftAction() {
        this.props.navigation.goBack();
    }

    componentDidMount() {
        this.setState({loading: true})
        let formdata = new FormData();
        formdata.append("student_id", Preference.get('user_id'))
        fetch(constants.getCalendarData, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: formdata
        }).then(response => {
            if (response.status == 200)
                return response.json()
        }).then(response => {
            this.setState({loading: false})
            if (response) {
                this.setState({listOfItems: response})
                this.setDays(moment(new Date().getDate()).format('YYYY-MM-DD'),false);
            } else {

            }
        })
            .catch(error => {
                this.setState({loading: false})
                console.log('onMyCourseTabResponseError:', error);
            });
    }

    renderItem(item, index) {
        let dateTime = item.start
        dateTime = dateTime.split(" ");
        return (
            <View style={{width: '100%', margin: 10, borderRadius: 30}}>
                <View style={{
                    borderRadius: 30,
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 40,
                    backgroundColor: item.color
                }}>
                    <Text style={{
                        color: colors.white,
                        width: 250,
                        textAlign: "center",
                        justifyContent: "center"
                    }}>{dateTime[1] + " " + item.title}</Text>
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
                            {"MY TIMETABLE"}
                        </Text>
                    }
                    leftAction={this.leftAction.bind(this)}
                    leftIcon={require('../../../assets/icons/back.png')}
                    navigation={this.props.navigation}
                />
                <View style={{flex: 1, alignItems: 'center'}}>
                    <Calendar
                        style={{width: '90%'}}

                        markedDates={this.state.setDatesCalender}

                        theme={{
                            backgroundColor: '#fff',
                            calendarBackground: '#fff',
                            textSectionTitleColor: '#b6c1cd',
                            selectedDayBackgroundColor: '#2d4150',
                            selectedDayTextColor: '#fff',
                            todayTextColor: 'green',
                            dayTextColor: '#000',
                            textDisabledColor: '#d9e1e8',
                            dotColor: '#2d4150',
                            selectedDotColor: '#000',
                            arrowColor: 'black',
                            monthTextColor: 'black',
                            indicatorColor: 'black',
                            textDayFontWeight: '300',
                            textMonthFontWeight: 'bold',
                            textDayHeaderFontWeight: '300',
                            textDayFontSize: 16,
                            textMonthFontSize: 16,
                            textDayHeaderFontSize: 13,
                        }}
                        current={this.state.selectedItem.start}
                        firstDay={1}
                        onDayPress={(day) => {
                            let _selectedItem = [];
                            this.setDays(moment(day.dateString).format('YYYY-MM-DD'),true);
                            let allItems = this.state.listOfItems;
                            for (let i = 0; i < allItems.length; i++) {

                                let item = allItems[i];
                                let _date = item.start
                                _date = _date.split(" ");
                                if (_date[0] == moment(day.dateString).format('YYYY-MM-DD')) {
                                    _selectedItem.push(item)
                                }
                            }
                            this.setState({selectedItem: _selectedItem})
                        }}
                    />
                    {this.state.selectedItem.length > 0 &&

                    <FlatList
                        data={this.state.selectedItem}
                        keyExtractor={item => item.id}
                        extraData={this.props}
                        showsVerticalScrollIndicator={false}
                        numColumns={1}
                        contentContainerStyle={{alignItems: 'center'}}
                        style={{width: '100%'}}
                        removeClippedSubviews={false}
                        renderItem={({item, index}) => {
                            return this.renderItem(item, index);
                        }}
                    />
                    }
                </View>
                <ProgressBar visible={this.state.loading}/>
            </SafeAreaView>
        );
    }

    setDays(day,selected)
    {
        let details = new Object();
        let appointdate = day;
        if(selected)
        {
            let allItems=this.state.listOfItems;
            for(let j=0;j<allItems.length;j++)
            {
                let _date = allItems[j].start
                _date = _date.split(" ");
                details[`${_date[0]}`] =  {marked: true, dotColor: 'red',}
            }
            details[`${appointdate}`] = {selected: true, selectedColor: "#389CFE"}
        }else {

            let allItems=this.state.listOfItems;
            for(let j=0;j<allItems.length;j++)
            {
                let _date = allItems[j].start
                _date = _date.split(" ");
                details[`${_date[0]}`] =  {marked: true, dotColor: 'red',}
            }
        }
        this.setState({setDatesCalender:details});

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
