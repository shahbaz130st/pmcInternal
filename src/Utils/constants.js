//export const Base_url = 'http://v56.appcrates.co/';
export const Base_url = 'https://www.thephysicscafe.com/';
const api = "admin/api/"

export const constants = {
    //image_Url:Base_url+'student_app/admin/',
    image_Url:Base_url+'admin/',
    Login: Base_url + api + "login",
    announcement: Base_url + api + "announcement",
    announcementDetail: Base_url + api + "announcement_detail",
    student_courses: Base_url + api + "student_courses",
    attendance: Base_url + api + "attendance",

    getLevel: Base_url + api + "get_levels",
    getSubject: Base_url + api + "get_subject_against_level",
    getClass: Base_url + api + "get_course",
    subscribeCourse: Base_url + api + "cpud_new_course",
    getCalendarData: Base_url + api + "get_calendar_data",
    getCourseList: Base_url + api + "get_course_list",
    getClassDates: Base_url + api + "get_class_day",
    getCourseDates: Base_url + api + "get_other_day",
    getCourseNewDates: Base_url + api + "get_make_up_day",
    AddMakeupClass: Base_url + api + "request_make_up_class",
    getMakeUpHistory: Base_url + api + "make_up_history",
    cancelMakeUpHistory: Base_url + api + "cancel_make_up",
    refferalReward: Base_url + api + "referral_reward",
    rewardPoint: Base_url + api + "reward_point",
    requestRedeem: Base_url + api + "request_a_redeem",
    pointHistory: Base_url + api + "point_history",
    accademy: Base_url + api + "academy",
    top_10_students: Base_url + api + "top_10_students",
    invoice: Base_url + api + "invoice",
    invoice_detail: Base_url + api + "invoice_detail",
    profile: Base_url + api + "profile",
    update_student_profile: Base_url + api + "update_student_profile",
    home: Base_url + api + "home",
    logout:Base_url+api+"logout",
    get_paynow_instruction:Base_url+api+"get_paynow_instruction",
};
