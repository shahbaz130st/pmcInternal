import React from 'react';
import {StyleSheet, Image} from "react-native";
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createDrawerNavigator} from 'react-navigation-drawer';

import Splash from './modules/Auth/Splash';

//Auth Module
import Login from './modules/Auth/Login';

//Dashboard Module
import Dashboard from './modules/Dashboard';

//Announcement Board Module
import Announcements from './modules/AnnouncementBoard/Announcements';
import AnnouncementDetails from './modules/AnnouncementBoard/AnnouncementDetails';

//Course Module
import MyCourse from './modules/Course/MyCourse';
import SubscribeCourse from './modules/Course/SubscribeCourse';
import Timetable from './modules/Course/Timetable';
import RequestForMakeup from './modules/Course/RequestForMakeup';
import MakeupHistory from './modules/Course/MakeupHistory';

//Referral And Reward Module
import MyReferralCode from './modules/ReferralAndReward/MyReferralCode';
import MyRewardPoint from './modules/ReferralAndReward/MyRewardPoint';
import PointTransaction from './modules/ReferralAndReward/PointTransaction';

//Academic Result Module
import AcademicResult from './modules/AcademicResult';
import CoursesResult from './modules/AcademicResult/ResultByCourses';

//Invoice And Payment Module
import Invoice from './modules/InvoiceAndPayment/Invoice';
import InvoiceDetail from './modules/InvoiceAndPayment/Invoice/invoiceDetail';
import InvoicePayment from './modules/InvoiceAndPayment/Invoice/invoicePayment';
import Message from './modules/InvoiceAndPayment/Message';

//Profile Module
import MyProfile from './modules/Profile/MyProfile';
import MyStudentCard from './modules/Profile/MyStudentCard';
import UpdateMyProfile from './modules/Profile/UpdateMyProfile';

//Settings Module
import Settings from './modules/Settings';

//Extra Modules
//Attendance Module
import AttendanceDetails from './modules/AttendanceBoard/AttendanceDetails';
//Assignments Module

//Components
import Drawer from './components/Drawer';

const AppNavigatorDrawerStack = createStackNavigator(
    {
        Dashboard: Dashboard,
    },
    {
        initialRouteName: 'Dashboard',
        headerMode: 'none',
    },
);

const AppDrawerNavigator = createDrawerNavigator(
    {
        mainApp:{
            screen: AppNavigatorDrawerStack,
        }
    },
    {
        drawerBackgroundColor: '#F2F2F2',
        initialRouteName: 'mainApp',
        contentComponent: Drawer,
    },
);

const AppNavigator = createStackNavigator(
    {
        Splash: Splash,

        //Auth Module
        Login: Login,

        //Dashboard Module
        AppDrawerNavigator: AppDrawerNavigator,

        //Announcement Board Module
        Announcements: Announcements,
        AnnouncementDetails: AnnouncementDetails,

        //Course Module
        MyCourse: MyCourse,
        SubscribeCourse: SubscribeCourse,
        Timetable: Timetable,
        RequestForMakeup: RequestForMakeup,
        MakeupHistory: MakeupHistory,

        //Referral And Reward Module
        MyReferralCode: MyReferralCode,
        MyRewardPoint: MyRewardPoint,
        PointTransaction: PointTransaction,

        //Academic Result Module
        AcademicResult: AcademicResult,
        CoursesResult:CoursesResult,

        //Invoice And Payment Module
        Invoice: Invoice,
        InvoiceDetail: InvoiceDetail,
        InvoicePayment: InvoicePayment,
        Message: Message,

        //Profile Module
        MyProfile: MyProfile,
        MyStudentCard: MyStudentCard,
        UpdateMyProfile: UpdateMyProfile,

        //Settings Module
        Settings: Settings,

        'AttendanceDetails':AttendanceDetails
    },
    {
        initialRouteName: 'Splash',
        headerMode: 'none',
    },
);

export default createAppContainer(AppNavigator);
