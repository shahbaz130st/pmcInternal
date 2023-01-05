import React, {Component} from 'react';
import {StatusBar, View} from 'react-native';
import Routing from './Routing';
import firebase from "react-native-firebase";
import NotificationPopup from 'react-native-push-notification-popup';
import {NavigationActions} from "react-navigation";

StatusBar.setHidden(true);
StatusBar.setTranslucent(false);
console.disableYellowBox = true;
const prefix = 'PMCStudent://';
import Preference from 'react-native-preference';


class App extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.createNotificationListeners();

    }

    componentWillUnmount() {
        this.notificationListener();
        this.notificationOpenedListener();
    }

    createNotificationListeners=async()=> {
        /*
        * Triggered when a particular notification has been received in foreground
        **/
        this.notificationListener = firebase.notifications().onNotification((notification) => {
            const {title, body, data} = notification;
            this.showAlert(title, body, data);
        });

        /*
        * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
         **/
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            const {title, body} = notificationOpen.notification;
        });

        /*
        * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
         **/
        const notificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {
            const {title, body, data} = notificationOpen.notification;
            setTimeout(() => {
                this.moveToAnnouncementDetail(data)
            }, 3000);
        }
    }


    showAlert=(title, body, data)=> {
        if (this.popup) {
            this.popup.show({
                onPress: () => {
                    if (Preference.get("isLoggedIn") === true)
                        this.moveToAnnouncementDetail(data)

                },
                appIconSource: require('./assets/images/appicon.png'),
                appTitle: title,
                timeText: "",
                title: title,
                body: body,
                slideOutTime: 5000
            });
        }
    }

    moveToAnnouncementDetail = (data) => {
        this.navigator.dispatch(
            NavigationActions.navigate({
                routeName: 'AnnouncementDetails', params: {
                    selectedItem: data.id,
                }
            })
        );
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <Routing ref={ref => {
                    this.navigator = ref;
                }} uriPrefix={prefix}/>
                <NotificationPopup ref={ref => this.popup = ref} style={{zIndex: 999}}/>
            </View>
        );
    }
}

export default App;
