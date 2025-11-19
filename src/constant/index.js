/* eslint-disable prettier/prettier */
import { Platform } from "react-native";


export const isIos = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

export const initialScheduleFilters = {
    activities: {
        all: true,
        selected: [],
    },
    programs: {
        all: true,
        selected: [],
    },
    audiences: {
        all: true,
        selected: [],
    },
    locations: {
        all: true,
        selected: [],
    },
    trainers: {
        all: true,
        selected: [],
    },
};

export const TrackingEventTypes = {
    login_finish: 'login_finish',
    biometric_login_finish: 'biometric_login_finish',
    login_failed: 'login_failed',
    onboarding_finish: 'onboarding_finish',
    event_button_click: 'event_button_click',
    barcode_link: 'barcode_link',
    schedule_page_view: 'schedule_page_view',
    single_schedule_opened: 'single_schedule_opened',
    favourited_activity: 'favourited_activity',
    notification_updated: 'notification_updated',
    barcode_added: 'barcode_added',
    news_opened: 'news_opened',
    calender_added: 'calender_added',
    booked_schedule: 'booked_schedule',
    filter_changed: 'filter_changed',
    home_barcode_button_pressed: 'home_barcode_button_pressed',
    home_myschedule_button_presed: 'home_myschedule_button_presed',
    home_barcode_tab_pressed: 'home_barcode_tab_pressed',
    update_activities: 'update_activities',
    single_schedule_item_pressed: 'single_schedule_item_pressed',
    restart_onboarding: 'restart_onboarding',
    notification_opned: 'notification_opned',
    my_booking_feed_pressed: 'my_booking_feed_pressed'
};
export const restaurants = [
    {
        id: 1,
        code: 'restaurant_1',
        name: 'Booster Juice',
        mid: "QZFZ8SDWY3DV1",
        image: require('../public/Booster_Juice.png'),
        hero: require('../../assets/booster_juice_item.png'),
    },
    {
        id: 2,
        code: 'restaurant_2',
        name: 'Pizza Pizza',
        mid: "NK0PVENK3C481",
        image: require('../public/Pizza_Pizza.png'),
        hero: require('../../assets/pizza_item.png'),
    },
    {
        id: 3,
        code: 'restaurant_3',
        name: 'Poolsides Bar and Grille',
        mid: "KKA9VYYW593D1",
        image: require('../public/Poolsides_Bar+Grill.png'),
        hero: require('../../assets/poolside_item.jpg'),
    }
];

