import React, { Component } from 'react';
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
import * as colors from '../../styles/colors';
import * as sizes from '../../styles/sizes';
import Header from '../../components/Header';
import Preference from "react-native-preference";
import {constants} from "../../Utils/constants";
import ProgressBar from '../../components/ProgressBar';
import moment from 'moment';
import commonStyles from '../../styles/commonStyles';

const { height, width } = Dimensions.get('window');

export default class AcademicResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            results:[],
        }
    }

    leftAction(){
        this.props.navigation.goBack();
    }
    componentDidMount() {
        this.getResults();
    }

    getResults()
    {
        this.setState({ loading: true })
        let formdata = new FormData();
        formdata.append("student_id", Preference.get('user_id'))
        fetch(constants.accademy, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: formdata
        }).then(response => response.json())
            .then(response => {
                this.setState({ loading: false })
                console.log("getResultsResponse-->", "-" + JSON.stringify(response));
                if (response.code === 200) {

                    this.setState({
                        results: response.data.student_academy_list

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

  /*  renderItem(item, index) {

        return (
            <TouchableOpacity
                style={[styles.itemContainerStyle, { marginTop: index == 0 ? 10 : 10 }]}
                onPress={() => {
                    this.props.navigation.navigate("AnnouncementDetails", { selectedItem: item.id })
                }}>
                <View style={{ width: '80%' }}>
                    <Text style={{ textTransform: 'uppercase', fontSize: sizes.large, fontWeight: 'bold' }}>
                        {item.title}
                    </Text>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{ fontSize: sizes.large,marginRight:20 }}>{ item.date}</Text>
                        <Text style={{ fontSize: sizes.large }}>{item.subject}</Text>
                    </View>
                </View>
                <View style={{ width: '20%', justifyContent: 'flex-end', flexDirection: 'row' }}>
                    <Image
                        style={styles.arrowStyle}
                        source={require('../../assets/icons/arrow.png')}
                    />
                </View>
            </TouchableOpacity>
        )
    }*/

    renderItem(item, index) {



        return (
            <View style={[styles.itemContainerStyle, {marginTop: index == 0 ? 10 : 10}]}>
                <View style={{width: '100%'}}>
                    <View style={{width: "100%",  backgroundColor: "transparent", flexDirection: "row"}}>
                        <View style={{width: "40%",  backgroundColor: "#F1F3F5",}}>
                            <Text style={{fontSize: 15, fontWeight: "bold", textAlign: "left",marginStart:10}}>{"NO."}</Text>
                        </View>
                        <View style={{width: "60%", backgroundColor: "transparent"}}>
                            <Text style={{fontSize: 15,marginStart:10}}>{index+1}</Text>
                        </View>
                    </View>

                    <View style={{width: "100%", backgroundColor: "transparent", flexDirection: "row"}}>
                        <View style={{width: "40%", backgroundColor: "#F1F3F5",}}>
                            <Text style={{fontSize: 15, fontWeight: "bold", textAlign: "left",marginStart:10}}>{"TITLE"}</Text>
                        </View>
                        <View style={{width: "60%", backgroundColor: "transparent"}}>
                            <Text style={{fontSize: 15,marginStart:10}}>{item.title}</Text>
                        </View>
                    </View>
                    <View style={{width: "100%",  backgroundColor: "transparent", flexDirection: "row"}}>
                        <View style={{width: "40%",  backgroundColor: "#F1F3F5",}}>
                            <Text style={{fontSize: 15, fontWeight: "bold", textAlign: "left",marginStart:10}}>{"SCORE"}</Text>
                        </View>
                        <View style={{width: "60%",  backgroundColor: "transparent"}}>
                            <Text style={{fontSize: 15,marginStart:10}}>{item.mark +"/"+item.total_score}</Text>
                        </View>
                    </View>
                    <View style={{width: "100%",backgroundColor: "transparent", flexDirection: "row"}}>
                        <View style={{width: "40%",  backgroundColor: "#F1F3F5",}}>
                            <Text style={{fontSize: 15, fontWeight: "bold", textAlign: "left",marginStart:10}}>{"COMMENT"}</Text>
                        </View>
                        <View style={{width: "60%", backgroundColor: "transparent"}}>
                            <Text style={{fontSize: 15,marginStart:10}}>{item.comment }</Text>
                        </View>
                    </View>
                    <View style={{width: "100%",  backgroundColor: "transparent", flexDirection: "row"}}>
                        <View style={{width: "40%",  backgroundColor: "#F1F3F5",}}>
                            <Text style={{fontSize: 15, fontWeight: "bold", textAlign: "left",marginStart:10}}>{"DATE"}</Text>
                        </View>
                        <View style={{width: "60%", backgroundColor: "transparent"}}>
                            <Text style={{fontSize: 15,marginStart:10}}>{moment(item.date).format("DD-MMM-YYYY") }</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }



    render() {
        return (
            <SafeAreaView style={{flex: 1, backgroundColor:colors.white}}>
                <Header
                    headerText={
                        <Text style={[commonStyles.textStyle,{fontSize: sizes.extraMediumLarge}]}>
                            {"ACADEMIC RESULT"}
                        </Text>
                    }
                    leftAction={this.leftAction.bind(this)}
                    leftIcon={require('../../assets/icons/back.png')}
                    navigation={this.props.navigation}
                />

                <View style={{ width: '100%', alignItems: 'center', backgroundColor: '#F2F2F2',height:70}}>
                    <TouchableOpacity
                        style={[styles.buttonStyle,{backgroundColor: colors.green}]}
                        onPress={() => {
                            this.props.navigation.navigate("CoursesResult")
                        }}>
                        <Text style={{color: colors.white}}>{'Top Scorers'}</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ width: '100%', alignItems: 'center', backgroundColor: '#F2F2F2', }}>
                    <FlatList
                        data={this.state.results}
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
    buttonImageStyle:{
        width: 120,
        height: 80,
        alignItems: 'center'
    },
    buttonStyle: {
        width: '80%',
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        marginTop:10
    }
});
