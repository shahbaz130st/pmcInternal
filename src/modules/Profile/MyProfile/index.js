import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
} from 'react-native';
// import Preference from 'react-native-preference';
import * as colors from '../../../styles/colors';
import * as sizes from '../../../styles/sizes';
import commonStyles from '../../../styles/commonStyles';
import Header from '../../../components/Header';
import AvatarComponent from "../../../components/AvatarComponent";
import Preference from "react-native-preference";
import {constants} from "../../../Utils/constants";
import ProgressBar from "../../../components/ProgressBar";

export default class MyProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            profileImage: "",
            profileData: "",
        }
    }

    componentDidMount() {
        const {navigation} = this.props;
        this.focusListener = navigation.addListener("didFocus", payload => {
            this.getProfile();
        });
        this.getProfile();
    }

    getProfile() {
        this.setState({loading: true})
        let formdata = new FormData();
        formdata.append("student_id", Preference.get('user_id'))
        fetch(constants.profile, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: formdata
        }).then(response => response.json())
            .then(response => {
                this.setState({loading: false})
                console.log("getprofileResponse-->", "-" + JSON.stringify(response));
                if (response.code === 200) {
                    let mainData = response.profile;
                    this.setState({
                        profileImage: mainData.img,
                        profileData: mainData

                    }, () => {
                        this.forceUpdate()
                    })


                } else {

                }
            })
            .catch(error => {
                this.setState({loading: false})
                console.log('ResponseError:', error);

            });
    }

    leftAction() {
        this.props.navigation.goBack();
    }

    renderField(item) {
        return (
            <View style={{width: "90%", backgroundColor: "#fff", flexDirection: "row", marginTop: 10}}>
                <Text style={{fontSize: 15, color: "grey", width: "45%", fontWeight: "bold"}}>{item.name}</Text>
                <Text style={{fontSize: 15, color: "grey", width: "10%"}}>{":"}</Text>
                <Text style={{fontSize: 15, color: "black", width: "45%"}}>{item.value}</Text>
            </View>
        )
    }

    render() {
        console.log("url: " + encodeURI(constants.image_Url + this.state.profileImage))
        let url = encodeURI(constants.image_Url + this.state.profileImage)
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: "#E4F3F9"}}>
                <Header
                    headerText={
                        <Text style={[commonStyles.textStyle, {fontSize: sizes.extraMediumLarge}]}>
                            {"MY PROFILE"}
                        </Text>
                    }
                    leftAction={this.leftAction.bind(this)}
                    leftIcon={require('../../../assets/icons/back.png')}
                    navigation={this.props.navigation}
                />
                <ScrollView>
                    <View style={{width: "100%", flexDirection: "column", alignItems: "center"}}>
                        <View style={{
                            width: "90%",
                            backgroundColor: "#fff",
                            flexDirection: "column",
                            alignItems: "center",
                            margin: 20,
                            borderRadius: 20
                        }}>
                            <AvatarComponent
                                size={"large"}
                                style={{height: 80, width: 80, resizeMode: "cover",marginTop:10,borderRadius: 5}}
                                source={url}
                            />
                            <Text style={{fontSize: 15, color: "#2E5CA2",marginTop:20}}>{this.state.profileData.name}</Text>
                            <View style={{width: '100%', alignItems: 'center', height: 70}}>
                                <TouchableOpacity
                                    style={[styles.buttonStyle, {backgroundColor: colors.green}]}
                                    onPress={() => {
                                        this.props.navigation.navigate("UpdateMyProfile")
                                    }}>
                                    <Text style={{color: colors.white}}>{'Update Profile'}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{width: '100%', alignItems: 'center', height: 70}}>
                                <TouchableOpacity
                                    style={[styles.buttonStyle, {backgroundColor: colors.green}]}
                                    onPress={() => {
                                        this.props.navigation.navigate("MyStudentCard", {
                                            QR: this.state.profileData.qr_code,
                                            studentName: this.state.profileData.name,
                                            studentId: this.state.profileData.id
                                        })
                                    }}>
                                    <Text style={{color: colors.white}}>{'My Student Card'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{
                            width: "90%",
                            backgroundColor: "#fff",
                            flexDirection: "column",
                            alignItems: "center",
                            margin: 20,
                            paddingVertical:20,
                            borderRadius: 20
                        }}>

                            {this.renderField({
                                name: "Outlet",
                                value: this.state.profileData.outlet_name
                            })}
                            {this.renderField({
                                name: "Date of Registration",
                                value: this.state.profileData.register_date
                            })}
                            {this.renderField({
                                name: "Student ID",
                                value: this.state.profileData.id
                            })}
                            {this.renderField({
                                name: "Student Name",
                                value: this.state.profileData.name
                            })}
                            {this.renderField({
                                name: "Student School",
                                value: this.state.profileData.school_name
                            })}
                            {this.renderField({
                                name: "Gender",
                                value: this.state.profileData.gender == 1 ? 'Male': "Female"
                            })}
                            {this.renderField({
                                name: "Date of Birth",
                                value: this.state.profileData.dob
                            })}
                            {this.renderField({
                                name: "Student Mobile",
                                value: this.state.profileData.phone_no
                            })}
                            {this.renderField({
                                name: "Student Email",
                                value: this.state.profileData.email
                            })}
                            {this.renderField({
                                name: "Address",
                                value: this.state.profileData.address+", Unit_No : "+this.state.profileData.unit_no+" , Postal_Code : "+ this.state.profileData.postal_code
                            })}
                            {this.renderField({
                                name: "Postal Code",
                                value: this.state.profileData.postal_code
                            })}
                        </View>

                        <View style={{
                            width: "90%",
                            backgroundColor: "#fff",
                            flexDirection: "column",
                            alignItems: "center",
                            margin: 20,
                            borderRadius: 20
                        }}>
                            <Text style={{
                                fontSize: 24,
                                color: "#2E5CA2",
                                fontWeight: "bold"
                            }}>{"PARENT’S INFORMATION"}</Text>
                            {this.renderField({
                                name: "Name",
                                value: this.state.profileData.parent_name
                            })}
                            {this.renderField({
                                name: "Mobile",
                                value: this.state.profileData.parent_phone
                            })}
                            {this.renderField({
                                name: "Email",
                                value: this.state.profileData.parent_email
                            })}
                        </View>

                    </View>
                </ScrollView>
                <ProgressBar visible={this.state.loading}/>
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
    buttonStyle: {
        width: '80%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        marginTop: 10
    }
});
