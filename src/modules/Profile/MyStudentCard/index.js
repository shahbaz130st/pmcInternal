import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
    Text,
    View,
    TouchableOpacity,
    ScrollView,Platform,
    SafeAreaView,
} from 'react-native';
import * as colors from '../../../styles/colors';
import * as sizes from '../../../styles/sizes';
import commonStyles from '../../../styles/commonStyles';
import Header from '../../../components/Header';
import ViewShot from "react-native-view-shot";
import CameraRoll from "@react-native-community/cameraroll";
var RNFS = require('react-native-fs');
import Preference from 'react-native-preference';
import {constants} from "../../../Utils/constants";
import moment from 'moment';

export default class MyStudentCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        }
    }

    leftAction() {
        this.props.navigation.goBack();
    }

    downloadImage()
    {
        this.refs.viewShot1.capture().then(uri => {
            const directory = Platform.OS === 'ios' ? RNFS.DocumentDirectoryPath : RNFS.PicturesDirectoryPath
            let destPath = directory + "/"+moment().format("x")+".jpg";

            RNFS.copyFile(uri, destPath)
                .then((success) => {

                    if(Platform.OS === 'ios'){
                        CameraRoll.saveToCameraRoll(destPath)
                            .then(res => {
                                alert("Image saved to camera-roll successfully");
                            })
                            .catch(err => {
                                console.log('ShareScreen','download-image-CameraRoll-err', err)
                            })
                    }else{
                        alert("Image saved to camera-roll successfully");
                    }
                })
                .catch((err) => {
                    alert('Error copying file: ' + err.message);
                });
        });
    }

    render() {
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
                <Header
                    headerText={
                        <Text style={[commonStyles.textStyle, {fontSize: sizes.extraMediumLarge}]}>
                            {"MY STUDENT CARD"}
                        </Text>
                    }
                    leftAction={this.leftAction.bind(this)}
                    leftIcon={require('../../../assets/icons/back.png')}
                    navigation={this.props.navigation}
                />
                <ScrollView>
                    <View style={{
                        width: "100%",
                        alignItems: "center",
                        backgroundColor: "#f2f2f2",
                        flexDirection: "column"
                    }}>
                        {/* <TouchableOpacity
                            onPress={()=>{this.downloadImage()}}
                            style={{
                            height: 100,
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column"
                        }}>
                            <Text style={{fontSize: 18, color: "black"}}>{'Download as Image'}</Text>
                            <Image
                                style={{width: 40, height: 40, resizeMode: "contain"}}
                                source={require('../../../assets/images/down_arrow.png')}
                            />
                        </TouchableOpacity> */}

                        <ViewShot  ref="viewShot1" style={{width: 270, height: 520, backgroundColor: "#fff", borderRadius: 5,}}>
                            <Image
                                style={{width: 250, height: 500, margin: 10}}
                                source={require('../../../assets/images/card_Smart.jpg')}
                            />
                            <Text style={{fontSize: 14, color: "black",width:140,backgroundColor:"#fff",position:"absolute",textAlign:"center",top:175,left:60}}>{Preference.get("user_name")}</Text>
                            <Text style={{fontSize: 14, color: "black",width:140,backgroundColor:"#fff",position:"absolute",textAlign:"center",top:235,left:60}}>{"00"+Preference.get("user_id")}</Text>
                            <Image
                                style={{width: 150, height: 150,backgroundColor:"grey",position:"absolute",bottom:60,right:60}}
                                source={{uri:constants.image_Url+Preference.get("qr_code")}}
                            />
                        </ViewShot>


                        <View style={{width: "80%",marginBottom:20, backgroundColor: "#fff",marginTop:10, borderRadius: 10,justifyContent:"center",alignItems:"center"}}>
                            <Text style={{fontSize: 26, color: "black",marginTop:10,fontWeight:"bold"}}>{'SAVE YOUR CARD ID'}</Text>

                            <Image
                                style={{width: 60, height: 60, resizeMode:"contain",marginTop:20}}
                                source={require('../../../assets/images/download.png')}
                            />
                            <Text style={{fontSize: 20, color: "black",marginTop:10,fontWeight:"bold"}}>{'Step 1'}</Text>
                            <Text style={{fontSize: 18, color: "black",marginTop:10}}>{'Save Your Card in Phone'}</Text>

                            <Image
                                style={{width: 60, height: 60, resizeMode:"contain",marginTop:20}}
                                source={require('../../../assets/images/name.png')}
                            />
                            <Text style={{fontSize: 20, color: "black",marginTop:10,fontWeight:"bold"}}>{'Step 2'}</Text>
                            <Text style={{fontSize: 18, color: "black",marginTop:10}}>{'Bring Your Card to PMC'}</Text>

                            <Image
                                style={{width: 60, height: 60, resizeMode:"contain",marginTop:20}}
                                source={require('../../../assets/images/search.png')}
                            />
                            <Text style={{fontSize: 20, color: "black",marginTop:10,fontWeight:"bold"}}>{'Step 2'}</Text>
                            <Text style={{fontSize: 18, color: "black",marginTop:10,marginBottom:20}}>{'Scan QR Code to take attendance'}</Text>
                        </View>


                    </View>
                </ScrollView>
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
