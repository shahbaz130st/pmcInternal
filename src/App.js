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
        // Build a channel
        // const channel = new firebase.notifications.Android.Channel('PMCStudent', 'PMCStudent', firebase.notifications.Android.Importance.Max)
        //     .setDescription('PMCStudent');
        //
        // // Create the channel
        // firebase.notifications().android.createChannel(channel);
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
            console.log('Notifications', title, body, JSON.stringify(data));
            /*if (title == 'Appointment completed' && data.appointment_status == '1') {
                if (Preference.get('clientlogin') === true) {
                    this.moveToClientLeaveReview(data);
                }
            }*/
            this.showAlert(title, body, data);
        });

        /*
        * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
         **/
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            const {title, body} = notificationOpen.notification;
            console.log("Notificcation is opened1")
            //alert("Notification: "+JSON.stringify(body));
            //this.showAlert(title, body);
        });

        /*
        * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
         **/
        const notificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {
            //console.log("Notificcation is opened=",JSON.stringify(notificationOpen))
            const {title, body, data} = notificationOpen.notification;
            console.log("Notificcation is opened", JSON.stringify(body))
            setTimeout(() => {
                this.moveToAnnouncementDetail(data)
            }, 3000);

            //this.showAlert(title, body);
        }
    }


    showAlert=(title, body, data)=> {
        if (this.popup) {
            this.popup.show({
                onPress: () => {
                    console.log("Notification Clicked")
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
        console.log("Notificcation is opened", JSON.stringify(data))
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

// const App = () =>
//     <Routing/>
//
// export default App;
