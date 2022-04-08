import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
    Text, Alert,
    View,
    TouchableOpacity,
    ScrollView, TextInput,
    SafeAreaView,
} from 'react-native';
// import Preference from 'react-native-preference';
import * as colors from '../../../styles/colors';
import * as sizes from '../../../styles/sizes';
import commonStyles from '../../../styles/commonStyles';
import Header from '../../../components/Header';
import AvatarComponent from "../../../components/AvatarComponent";
import ProgressBar from "../../../components/ProgressBar";
import Preference from "react-native-preference";
import {constants} from "../../../Utils/constants";
import ImagePicker from 'react-native-image-picker';

const options = {
    title: 'Select Image',
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};

export default class UpdateMyProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            profileImage: "",
            profileData: "",
            avatarSource: "",
            avatarSelected:false,
        }
    }

    leftAction() {
        this.props.navigation.goBack();
    }

    componentDidMount() {
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
                    Preference.set('user_id', response.profile.id);
                    Preference.set('user_name', response.profile.name);
                    Preference.set('qr_code', response.profile.qr_code);
                    Preference.set('user_image', response.profile.img);
                    let mainData = response.profile;
                    this.setState({
                        profileImage: mainData.img,
                        profileData: mainData,
                        avatarSource: {uri: encodeURI(constants.image_Url + mainData.img)}

                    }, () => {
                        this.forceUpdate()
                        if (this.state.profileData.gender === "1") {
                            this.state.profileData.gender = "male";
                        } else {
                            this.state.profileData.gender = "female";
                        }
                    })


                } else {

                }
            })
            .catch(error => {
                this.setState({loading: false})
                console.log('ResponseError:', error);

            });
    }

    updateProfile() {
        this.setState({loading: true})
        if (this.state.profileData.gender === "male") {
            this.state.profileData.gender=1;
            this.setState({profileData:this.state.profileData})
        }else
        {
            this.state.profileData.gender=2;
            this.setState({profileData:this.state.profileData})
        }
        let formdata = new FormData();
        formdata.append("student_id", Preference.get('user_id'))
        formdata.append("student_name", this.state.profileData.name)
        formdata.append("school_name", this.state.profileData.school_name)
        formdata.append("nric", this.state.profileData.nric)
        formdata.append("gender", this.state.profileData.gender)
        formdata.append("dob", this.state.profileData.dob)
        formdata.append("phoneno", this.state.profileData.phone_no)
        formdata.append("address", this.state.profileData.address)
        formdata.append("postal_code", this.state.profileData.postal_code)
        formdata.append("parent_name", this.state.profileData.parent_name)
        formdata.append("parent_mobile", this.state.profileData.parent_phone)
        if(this.state.avatarSelected)
        {
            formdata.append("photo", {uri: this.state.profileImage,name: this.state.profileData.name, type: 'image/jpeg'})
        }
        //formdata.append("photo", this.state.profileData.img)

        fetch(constants.update_student_profile, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                //'Content-Type': 'multipart/form-data'
            },
            body: formdata
        }).then(response => response.json())
            .then(response => {
                this.setState({loading: false})
                console.log("updateprofileResponse-->", "-" + JSON.stringify(response));
                if (response.code === 200) {
                    Alert.alert("Success", "Your data saved successfully.")
                    this.getProfile();
                } else {
                    Alert.alert("Error", "Please try again to update.")
                }
            })
            .catch(error => {
                this.setState({loading: false})
                console.log('ResponseError:', error);

            });
    }

    /* renderField(item) {
         return (
             <View style={{width: "90%", backgroundColor: "#fff", flexDirection: "row",marginTop:10}}>
                 <Text style={{fontSize: 18, color: "grey", width: "45%", fontWeight: "bold"}}>{item.name}</Text>
                 <Text style={{fontSize: 18, color: "grey", width: "10%"}}>{":"}</Text>
                 <InputText style={{fontSize: 18, color: "grey", width: "45%",borderWidth:1,borderColor:"#000"}}
                            onChangeText={text =>{this.state.profileData.name=text}}
                            placeholder={"Student Name"}
                            value={this.state.profileData.name}/>
             </View>
         )
     }*/

    selectImage = () => {
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User canceled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = {uri: response.uri};

                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({avatarSource: source, profileImage: response.uri,avatarSelected:true});
            }
        });
    }

    render() {
        //console.log("url: " + encodeURI(constants.image_Url + this.state.profileImage))
        //let url = encodeURI(constants.image_Url + this.state.profileImage)

        return (
            <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
                <Header
                    headerText={
                        <Text style={[commonStyles.textStyle, {fontSize: sizes.extraMediumLarge}]}>
                            {"UPDATE MY PROFILE"}
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

                            <View style={{width: 100,}}>
                                <Image
                                    source={this.state.avatarSource}
                                    style={{height: 80, width: 80, resizeMode: "cover", borderRadius: 10}}/>
                                {/* <AvatarComponent
                                size={"large"}
                                style={{height: 80, width: 80, resizeMode: "cover"}}
                                source={this.state.avatarSource}
                            />*/}
                                <TouchableOpacity onPress={() => this.selectImage()} style={{
                                    position: "absolute",
                                    right: 5,
                                    bottom: 5,
                                    borderWidth: 4,
                                    borderRadius: 20,
                                    borderColor: "black",
                                    width: 30,
                                    height: 30,
                                }}>
                                    <Image
                                        source={require("../../../assets/images/dpchange.png")}
                                        resizeMode='contain'
                                        style={{
                                            width: '100%', height: '100%',
                                        }}/>
                                </TouchableOpacity>
                            </View>


                            <Text style={{fontSize: 18, color: "#2E5CA2"}}>{this.state.profileData.name}</Text>
                        </View>

                        <View style={{
                            width: "90%",
                            backgroundColor: "#fff",
                            flexDirection: "column",
                            alignItems: "center",
                            margin: 20,
                            borderRadius: 20
                        }}>
                            <View style={{width: "90%", backgroundColor: "#fff", flexDirection: "row", marginTop: 10}}>
                                <Text style={{
                                    fontSize: 18,
                                    color: "grey",
                                    width: "30%",
                                    fontWeight: "bold"
                                }}>{"Student Name"}</Text>
                                <Text style={{fontSize: 18, color: "grey", width: "10%"}}>{":"}</Text>
                                <TextInput style={{
                                    fontSize: 18,
                                    color: "grey",
                                    width: "60%",
                                    borderWidth: 1,
                                    borderColor: "#000"
                                }}
                                           onChangeText={text => {
                                               this.state.profileData.name = text
                                               this.setState({profileData: this.state.profileData})
                                           }}
                                           placeholder={"Student Name"}
                                           value={this.state.profileData.name}/>
                            </View>
                            <View style={{width: "90%", backgroundColor: "#fff", flexDirection: "row", marginTop: 10}}>
                                <Text style={{
                                    fontSize: 18,
                                    color: "grey",
                                    width: "30%",
                                    fontWeight: "bold"
                                }}>{"Student School"}</Text>
                                <Text style={{fontSize: 18, color: "grey", width: "10%"}}>{":"}</Text>
                                <TextInput style={{
                                    fontSize: 18,
                                    color: "grey",
                                    width: "60%",
                                    borderWidth: 1,
                                    borderColor: "#000"
                                }}
                                           onChangeText={text => {
                                               this.state.profileData.school_name = text
                                               this.setState({profileData: this.state.profileData})
                                           }}
                                           placeholder={"Student School"}
                                           value={this.state.profileData.school_name}/>
                            </View>
                            <View style={{width: "90%", backgroundColor: "#fff", flexDirection: "row", marginTop: 10}}>
                                <Text style={{
                                    fontSize: 18,
                                    color: "grey",
                                    width: "30%",
                                    fontWeight: "bold"
                                }}>{"Gender"}</Text>
                                <Text style={{fontSize: 18, color: "grey", width: "10%"}}>{":"}</Text>
                                <TextInput style={{
                                    fontSize: 18,
                                    color: "grey",
                                    width: "60%",
                                    borderWidth: 1,
                                    borderColor: "#000"
                                }}
                                           onChangeText={text => {
                                               this.state.profileData.gender = text
                                               this.setState({profileData: this.state.profileData})
                                           }}
                                           placeholder={"Gender"}
                                           value={this.state.profileData.gender}/>
                            </View>
                            <View style={{width: "90%", backgroundColor: "#fff", flexDirection: "row", marginTop: 10}}>
                                <Text style={{
                                    fontSize: 18,
                                    color: "grey",
                                    width: "30%",
                                    fontWeight: "bold"
                                }}>{"Date of Birth"}</Text>
                                <Text style={{fontSize: 18, color: "grey", width: "10%"}}>{":"}</Text>
                                <TextInput style={{
                                    fontSize: 18,
                                    color: "grey",
                                    width: "60%",
                                    borderWidth: 1,
                                    borderColor: "#000"
                                }}
                                           onChangeText={text => {
                                               this.state.profileData.dob = text
                                               this.setState({profileData: this.state.profileData})
                                           }}
                                           placeholder={"Date of Birth"}
                                           value={this.state.profileData.dob}/>
                            </View>
                            <View style={{width: "90%", backgroundColor: "#fff", flexDirection: "row", marginTop: 10}}>
                                <Text style={{
                                    fontSize: 18,
                                    color: "grey",
                                    width: "30%",
                                    fontWeight: "bold"
                                }}>{"Student Mobile"}</Text>
                                <Text style={{fontSize: 18, color: "grey", width: "10%"}}>{":"}</Text>
                                <TextInput style={{
                                    fontSize: 18,
                                    color: "grey",
                                    width: "60%",
                                    borderWidth: 1,
                                    borderColor: "#000"
                                }}
                                           onChangeText={text => {
                                               this.state.profileData.phone_no = text
                                               this.setState({profileData: this.state.profileData})
                                           }}
                                           placeholder={"Student Mobile"}
                                           value={this.state.profileData.phone_no}/>
                            </View>
                            <View style={{width: "90%", backgroundColor: "#fff", flexDirection: "row", marginTop: 10}}>
                                <Text style={{
                                    fontSize: 18,
                                    color: "grey",
                                    width: "30%",
                                    fontWeight: "bold"
                                }}>{"Student Email"}</Text>
                                <Text style={{fontSize: 18, color: "grey", width: "10%"}}>{":"}</Text>
                                <TextInput style={{
                                    fontSize: 18,
                                    color: "grey",
                                    width: "60%",
                                    borderWidth: 1,
                                    borderColor: "#000"
                                }}
                                           onChangeText={text => {
                                               this.state.profileData.email = text
                                               this.setState({profileData: this.state.profileData})
                                           }}
                                           placeholder={"Student Email"}
                                           value={this.state.profileData.email}/>
                            </View>

                            <View style={{width: "90%", backgroundColor: "#fff", flexDirection: "row", marginTop: 10}}>
                                <Text style={{
                                    fontSize: 18,
                                    color: "grey",
                                    width: "30%",
                                    fontWeight: "bold"
                                }}>{"Address"}</Text>
                                <Text style={{fontSize: 18, color: "grey", width: "10%"}}>{":"}</Text>
                                <TextInput style={{
                                    fontSize: 18,
                                    color: "grey",
                                    width: "60%",
                                    borderWidth: 1,
                                    borderColor: "#000"
                                }}
                                           onChangeText={text => {
                                               this.state.profileData.address = text
                                               this.setState({profileData: this.state.profileData})
                                           }}
                                           placeholder={"Address"}
                                           value={this.state.profileData.address}/>
                            </View>
                            <View style={{width: "90%", backgroundColor: "#fff", flexDirection: "row", marginTop: 10}}>
                                <Text style={{
                                    fontSize: 18,
                                    color: "grey",
                                    width: "30%",
                                    fontWeight: "bold"
                                }}>{"Postal Code"}</Text>
                                <Text style={{fontSize: 18, color: "grey", width: "10%"}}>{":"}</Text>
                                <TextInput style={{
                                    fontSize: 18,
                                    color: "grey",
                                    width: "60%",
                                    borderWidth: 1,
                                    borderColor: "#000"
                                }}
                                           onChangeText={text => {
                                               this.state.profileData.postal_code = text
                                               this.setState({profileData: this.state.profileData})
                                           }}
                                           placeholder={"Postal Code"}
                                           value={this.state.profileData.postal_code}/>
                            </View>
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
                            {/*  {this.renderField({
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
                            })}*/}
                            <View style={{width: "90%", backgroundColor: "#fff", flexDirection: "row", marginTop: 10}}>
                                <Text style={{
                                    fontSize: 18,
                                    color: "grey",
                                    width: "30%",
                                    fontWeight: "bold"
                                }}>{"Parent Name"}</Text>
                                <Text style={{fontSize: 18, color: "grey", width: "10%"}}>{":"}</Text>
                                <TextInput style={{
                                    fontSize: 18,
                                    color: "grey",
                                    width: "60%",
                                    borderWidth: 1,
                                    borderColor: "#000"
                                }}
                                           onChangeText={text => {
                                               this.state.profileData.parent_name = text
                                               this.setState({profileData: this.state.profileData})
                                           }}
                                           placeholder={"Name"}
                                           value={this.state.profileData.parent_name}/>
                            </View>
                            <View style={{width: "90%", backgroundColor: "#fff", flexDirection: "row", marginTop: 10}}>
                                <Text style={{
                                    fontSize: 18,
                                    color: "grey",
                                    width: "30%",
                                    fontWeight: "bold"
                                }}>{"Parent Mobile"}</Text>
                                <Text style={{fontSize: 18, color: "grey", width: "10%"}}>{":"}</Text>
                                <TextInput style={{
                                    fontSize: 18,
                                    color: "grey",
                                    width: "60%",
                                    borderWidth: 1,
                                    borderColor: "#000"
                                }}
                                           onChangeText={text => {
                                               this.state.profileData.parent_phone = text
                                               this.setState({profileData: this.state.profileData})
                                           }}
                                           placeholder={"Mobile"}
                                           value={this.state.profileData.parent_phone}/>
                            </View>
                            <View style={{width: "90%", backgroundColor: "#fff", flexDirection: "row", marginTop: 10}}>
                                <Text style={{
                                    fontSize: 18,
                                    color: "grey",
                                    width: "30%",
                                    fontWeight: "bold"
                                }}>{"Parent Email"}</Text>
                                <Text style={{fontSize: 18, color: "grey", width: "10%"}}>{":"}</Text>
                                <TextInput style={{
                                    fontSize: 18,
                                    color: "grey",
                                    width: "60%",
                                    borderWidth: 1,
                                    borderColor: "#000"
                                }}
                                           onChangeText={text => {
                                               this.state.profileData.parent_email = text
                                               this.setState({profileData: this.state.profileData})
                                           }}
                                           placeholder={"Email"}
                                           value={this.state.profileData.parent_email}/>
                            </View>


                            <View style={{width: '100%', alignItems: 'center', height: 70}}>
                                <TouchableOpacity
                                    style={[styles.buttonStyle, {backgroundColor: colors.green}]}
                                    onPress={() => {
                                        this.updateProfile()
                                    }}>
                                    <Text style={{color: colors.white}}>{'Update Profile'}</Text>
                                </TouchableOpacity>
                            </View>
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
