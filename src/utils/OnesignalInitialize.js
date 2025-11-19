/* eslint-disable prettier/prettier */
import OneSignal from 'react-native-onesignal';
import NavigationService from '../navigation';
import Routes from '../navigation/Routes';
import { trackUserEvent } from '.';
import { TrackingEventTypes } from '../constant';


OneSignal.setAppId('10e010ca-398e-43ce-8347-2292a77d9b61');
// OneSignal.setAppId('6cf62d65-a711-4b22-b8f1-a529fc531322');

// Prompt for push notification permissions (optional)
OneSignal.promptForPushNotificationsWithUserResponse();


const OneSignalInitilize = (userId) => {
    let externalUserId = '';
    if (userId) {
        externalUserId = userId;
    } else {
        externalUserId = `open_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    }
    OneSignal.setExternalUserId(externalUserId);
    // Method for handling notifications received while app is in foreground
    OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
        let notification = notificationReceivedEvent.getNotification();
        notificationReceivedEvent.complete(notification);
    });

    // Method for handling notifications opened
    OneSignal.setNotificationOpenedHandler(notificationResponse => {
        const { notification } = notificationResponse;
        if (notification) {
            const { additionalData = null } = notification;
            if (additionalData) {
                const { resourceType, notificationId, resourceId } = additionalData;
                // console.log("here=======", resourceId, notificationId, resourceId);
                if (resourceType === 'chat') {
                    console.log('chat notif clicked', additionalData);
                    NavigationService.navigate(Routes.SINGLECHATSCREEN, {
                        channelId: additionalData.resourceId,
                    })
                } else if (resourceType === "cancellation") {
                    NavigationService.navigate(Routes.SCHEDULEDETAIL, { id: notificationId, resourceId, shouldFetch: true });
                } else {
                    NavigationService.navigate(Routes.NOTICEDETAIL, { id: notificationId, resourceId, shouldFetch: true });
                }
                trackUserEvent(TrackingEventTypes?.notification_opned, {
                    resource_type: resourceType,
                    notification_id: notificationId,
                    resource_id: resourceId,
                });
            } else {
                console.log("something went wrong");
            }
        } else {
            console.log("something went wrong")
        }
    });
};

export default OneSignalInitilize;
