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
const {height, width} = Dimensions.get('window');
import Preference from 'react-native-preference';
import {constants} from '../../../Utils/constants';
import ProgressBar from '../../../components/ProgressBar';
export default class MyCourse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            announcementsList: [
                // {
                //     id: 0,
                //     title: 'NOVENA S1 (MATHS + SCIENCE) ( Term - 1 / 2020 )',
                //     schedule: 'Sun - 09:00:00 to 11:00:00 ( Novena LT )',
                //     enroll_date: '02 Feb 2020',
                //     status: true,
                // },


            ]
        }
    }

    leftAction(){
        this.props.navigation.goBack();
    }

    componentDidMount(){
       this.onMyCourseTabPress()
    }
    onMyCourseTabPress() {
        this.setState({ loading: true })
        let formdata = new FormData();
        formdata.append("student_id",Preference.get('user_id'))
        fetch(constants.student_courses, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: formdata
        }).then(response => response.json())
            .then(response => {
                this.setState({ loading: false })
                console.log("onMyCourseTabApi-->", "-" + JSON.stringify(response));
                if (response.code === 200) {

                    this.setState({
                        announcementsList:response.data.course_list
                    }, () => {
                        this.forceUpdate()
                    })



                } else {


                }
            })
            .catch(error => {
                this.setState({ loading: false })
                console.log('student_id',Preference.get('user_id'))
                console.log('onMyCourseTabResponseError:', error);

            });


    }

    renderItem(item, index){
        return(
            <View style={[styles.itemContainerStyle,{marginTop: index == 0 ? 0 :10 }]}>
                {this.renderLine(require('../../../assets/icons/my_course.png'), item.title+"(Term-"+item.term_no +"/"+item.year+")")}
                {this.renderLine(require('../../../assets/icons/my_course.png'), item.schedule)}
                {this.renderLine(require('../../../assets/icons/my_course.png'), item.enroll_date)}
                <View style={{flexDirection: 'row', width: '100%', marginTop: 10, justifyContent: 'space-around',height:35}}>
                    <View style={[styles.buttonStyle,{backgroundColor: item.status ? colors.active : colors.inActive}]}>
                        <Text style={{color: colors.white}}>{item.status ? 'ACTIVE' : 'INACTIVE'}</Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.buttonStyle,{backgroundColor: colors.green}]}
                        onPress={() => {
                            this.props.navigation.navigate("AttendanceDetails", { selectedItem: item.id,schedule: item.schedule_id })
                        }}>
                        <Text style={{color: colors.white}}>{'ATTENDANCE'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    renderLine(source, text){
        return(
            <View style={{width: '100%',flexDirection: 'row', alignItems: 'center', marginVertical:5}}>
                <Image
                    style={{resizeMode: 'contain', width: 20, height:20, marginRight:5}}
                    source={source}
                />
                <Text style={[commonStyles.textStyle]}>{text}</Text>
            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={{flex: 1, backgroundColor:colors.white}}>
                <Header
                    headerText={
                        <Text style={[commonStyles.textStyle,{fontSize: sizes.extraMediumLarge}]}>
                            {"MY COURSE"}
                        </Text>
                    }
                    leftAction={this.leftAction.bind(this)}
                    leftIcon={require('../../../assets/icons/back.png')}
                    navigation={this.props.navigation}
                />
                <View style={{flex:1, width: '100%', alignItems: 'center', justifyContent: 'center',backgroundColor: '#F2F2F2',}}>
                    <View style={{flex:1,margin: 10, marginBottom: 0,width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                        <FlatList
                            data={this.state.announcementsList}
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
                    </View>
                </View>
                <View style={{height: 80, width: '100%', backgroundColor: '#F2F2F2', alignItems: 'center', justifyContent: 'center'}}>
                    <TouchableOpacity
                        onPress={()=>{
                            this.props.navigation.navigate('SubscribeCourse')
                        }}
                        style={{height: 60 , width: '50%', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.green, borderRadius: 20}}>
                        <Text style={{color: colors.white, textAlign: 'center', fontSize: sizes.large}}>{'Subscribe New\nCourse'}</Text>
                    </TouchableOpacity>
                </View>
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
    itemContainerStyle: {
        borderRadius: 20,
        padding: 15,
        borderLeftColor: colors.tintColor,
        backgroundColor: colors.white,
        borderLeftWidth: 5,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        width: width * 0.95,
    },
    buttonStyle: {
        width: '35%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
    }
});
