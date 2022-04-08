import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    Text,
    View,
    TouchableOpacity,
    ScrollView, Dimensions,
    SafeAreaView,
    Linking,
    Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';

const screenHeight = Math.round(Dimensions.get('window').height);
// import Preference from 'react-native-preference';
import * as colors from '../../../styles/colors';
import * as sizes from '../../../styles/sizes';
import commonStyles from '../../../styles/commonStyles';
import { constants } from '../../../Utils/constants'
import Header from '../../../components/Header';
import ProgressBar from '../../../components/ProgressBar';
import RNFetchBlob from 'rn-fetch-blob'

export default class AnnouncementDetails extends Component {
    constructor(props) {
        super(props);
        const { params } = props.navigation.state
        this.state = {
            loading: false,
            selectedItem: params.selectedItem,
            userId: params.userId,
            title: '',
            date: '',
            description: '',
            webViewHeight: 0,
            showWebView: true,
            files: []
        }
    }

    leftAction() {
        this.props.navigation.goBack();
    }

    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener("didFocus", payload => {
            this.onAnnouncementPress()
        });
        this.onAnnouncementPress()
    }

    onAnnouncementPress() {
        this.setState({ loading: true })
        let formdata = new FormData();

        formdata.append("announcement_id", this.state.selectedItem)
        formdata.append("student_id", this.state.userId)
        console.log("announcement_id", "--" + constants.announcementDetail, formdata);
        fetch(constants.announcementDetail, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: formdata
        }).then(response => response.json())
            .then(response => {
                this.setState({ loading: false })
                if (response.code === 200) {
                    console.log("response1", response.data.title)

                    this.state.title = response.data.title
                    this.state.date = response.data.date
                    this.state.description = response.data.description

                    const files = []
                    if (response.data.file && response.data.file != '') {
                        files.push({
                            link: response.data.file,
                            name: response.data.file.split("/").pop()
                        })
                    }
                    if (response.data.file2 && response.data.file2 != '') {
                        files.push({
                            link: response.data.file2,
                            name: response.data.file2.split("/").pop()
                        })
                    }
                    if (response.data.file3 && response.data.file3 != '') {
                        files.push({
                            link: response.data.file3,
                            name: response.data.file3.split("/").pop()
                        })
                    }

                    this.setState({ files })
                } else {
                }
            })
            .catch(error => {
                this.setState({ loading: false })
                console.log('ResponseError:', error);

            });


    }


    render() {
        const {
            files
        } = this.state
        const html = '<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>' + this.state.description + '</body></html>'

        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
                <Header
                    headerText={
                        <Text style={[commonStyles.textStyle, { fontSize: sizes.extraMediumLarge, fontWeight: 'bold' }]}>
                            {"ANNOUNCEMENTS"}
                        </Text>
                    }
                    leftAction={this.leftAction.bind(this)}
                    leftIcon={require('../../../assets/icons/back.png')}
                    navigation={this.props.navigation}
                />
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,

                    }}
                >
                    <View style={{
                        flex: 1,
                        width: '100%',
                        alignItems: 'center',
                        paddingTop: 10,
                        backgroundColor: '#F2F2F2',
                    }}>
                        <View style={[styles.itemContainerStyle, { flex: 1 }]}>
                            <View style={{ width: '100%' }}>
                                <Text style={{
                                    textTransform: 'uppercase',
                                    fontSize: sizes.extraLarge
                                }}>{this.state.title}</Text>
                            </View>
                            <View style={{
                                width: '100%',
                                flexDirection: 'row',
                                backgroundColor: '#F2F2F2',
                                paddingLeft: 5,
                                height: 40,
                                alignItems: 'center',
                                marginTop: 10
                            }}>
                                <Image style={styles.arrowStyle} source={require('../../../assets/icons/clock.png')} />
                                <Text style={{
                                    marginLeft: 10,
                                    marginRight: 10,
                                    fontSize: 16,
                                    fontWeight: 'bold'
                                }}>{this.state.date}</Text>
                            </View>

                            {files.length > 0 && (
                                <View style={{
                                    backgroundColor: '#F2F2F2',
                                    paddingLeft: 5,
                                    paddingVertical: 5,
                                    marginTop: 10
                                }}>
                                    {files.map((file, index) => {
                                        return (
                                            <View style={{
                                                flexDirection: 'row',
                                                marginTop: index == 0 ? 0 : 10,
                                                alignItems: 'center'
                                            }}>
                                                <Image style={styles.arrowStyle} source={require('../../../assets/icons/attach.png')} />
                                                <TouchableOpacity onPress={() => { Linking.openURL(constants.image_Url + file.link) }} style={{
                                                    marginLeft: 10,
                                                }}>
                                                    <Text style={{
                                                        maxWidth: '95%',
                                                        maxWidth: Platform.OS == 'ios' ? '100%' : '95%',
                                                        fontSize: 16,
                                                        color: "#337AB7",
                                                        fontWeight: 'bold'
                                                    }}>{file.name}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    })}
                                </View>
                            )}
                            <View
                                style={[
                                    {
                                        width: '100%',
                                        backgroundColor: '#F2F2F2',
                                        marginTop: 10,
                                        marginBottom: 10,
                                        flex: 1,
                                    },
                                    // this.state.webViewHeight > 0 && {
                                    //     height: this.state.webViewHeight
                                    // }
                                ]}>
                                {/* <Image style={styles.arrowStyle} source={require('../../../assets/icons/download.png')} /> */}
                                <Text style={{
                                    marginLeft: 10,
                                    marginRight: 10,
                                    fontSize: 18,
                                    fontWeight: 'bold',
                                    marginBottom: 5,
                                    marginTop: 5
                                }}>Description</Text>
                                {(this.state.showWebView) && (
                                    <WebView
                                        originWhitelist={['']}
                                        style={[
                                            {
                                                backgroundColor: "#F2F2F2",
                                                flex: 1,
                                                flexGrow: 1,
                                                // height: screenHeight
                                            },
                                        ]}
                                        containerStyle={{
                                            flexGrow: 1,
                                        }}
                                        useWebKit={true}
                                        onShouldStartLoadWithRequest={(event) => {
                                            if (event.url.startsWith('http')) {
                                                this.webview.stopLoading();
                                                Linking.openURL(event.url);
                                                this.setState({
                                                    showWebView: false
                                                }, () => {
                                                    setTimeout(() => {
                                                        this.setState({
                                                            showWebView: true
                                                        })
                                                    }, 500)
                                                })
                                                return false;
                                            }

                                            return true;
                                        }}
                                        ref={(ref) => { this.webview = ref; }}
                                        onNavigationStateChange={(event) => {

                                            if (event.url.startsWith('http')) {
                                                this.webview.stopLoading();
                                                Linking.openURL(event.url);
                                                this.setState({
                                                    showWebView: false
                                                }, () => {
                                                    setTimeout(() => {
                                                        this.setState({
                                                            showWebView: true
                                                        })
                                                    }, 500)
                                                })
                                                return false;
                                            }
                                            return true;

                                        }}
                                        originWhitelist={['*']}
                                        // source={{ html: this.state.description }}
                                        // source={{ uri: 'https://reactnative.dev/' }}
                                        // source={{
                                        //     uri: this.state.description
                                        //   }}
                                        source={{ html }} />
                                )}
                            </View>

                        </View>
                    </View>
                </ScrollView>
                <ProgressBar visible={this.state.loading} />
            </SafeAreaView>
        );
    }


    onShouldStartLoadWithRequest = (request) => {
        console.log(request.url);
        if (Platform.OS === 'ios') return true;
        else
            Linking.openURL(request.url);
    }

    openExternalLink(req) {
        Linking.openURL(req.url);
        /*const isLocal = req.url.search('https://') !== -1;

        if (isLocal) {
            return true;
        } else {
            Linking.openURL(req.url);
            return false;
        }*/
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
        // flexDirection: 'row',
        borderRadius: 20,
        paddingHorizontal: 25,
        paddingTop: 25,
        borderLeftColor: 'yellow',
        backgroundColor: colors.white,
        borderLeftWidth: 5,
        // alignItems: 'center',
        // justifyContent: 'center',
        width: '98%'
    },
    arrowStyle: {
        resizeMode: 'contain',
        width: 18,
        height: 18,
        marginLeft: 5,

    },
});
