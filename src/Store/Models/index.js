/* eslint-disable prettier/prettier */
import ActivitiesModel from "./Activities";
import AppModel from "./App";
import BarcodeModel from "./Barcode";
import CancellationModel from "./Cancellation";
import ClosureModel from "./Closures";
import EventsModel from "./Events";
import LoginModel from "./Login";
import NewsModel from "./News";
import NoticeModel from "./Notice";
import NotificationModel from "./Notification";
import ScheduleModel from "./Schedule";
import CartModel from "./cart";
import HealthModel from "./Health";
import ChannelModel from "./channel";

export default {
    login: LoginModel,
    // news: NewsModel,
    // event: EventsModel,
    // closure: ClosureModel,
    // barcode: BarcodeModel,
    // notice: NoticeModel,
    schedule: ScheduleModel,
    health: HealthModel,
    cart: CartModel,
    // cancellation: CancellationModel,
    // notification: NotificationModel,
    // activity: ActivitiesModel,
    app: AppModel,
    channel: ChannelModel,
};
