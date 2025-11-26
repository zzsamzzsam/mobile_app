/* eslint-disable prettier/prettier */
import { OneSignal } from 'react-native-onesignal';
import NavigationService from '../navigation';
import Routes from '../navigation/Routes';
import { trackUserEvent } from '.';
import { TrackingEventTypes } from '../constant';

OneSignal.initialize('10e010ca-398e-43ce-8347-2292a77d9b61');
// OneSignal.setAppId('10e010ca-398e-43ce-8347-2292a77d9b61');
// OneSignal.setAppId('6cf62d65-a711-4b22-b8f1-a529fc531322');

// Prompt for push notification permissions (optional)
// OneSignal.Notifications.requestPermission(true);

// Foreground notification handling
OneSignal.Notifications.addEventListener('foregroundWillDisplay', (event) => {
  // Prevent default to do any async work before displaying
  event.preventDefault();

  const notification = event.getNotification();
  const data = notification.additionalData || {};

  // console.log("Foreground notification received:", data);

  // Display it after any processing
  event.getNotification().display();
});

// Notification click handling
OneSignal.Notifications.addEventListener('click', (event) => {
  const notification = event.getNotification();
  const data = notification.additionalData || {};
  const { resourceType, notificationId, resourceId } = data;

  if (resourceType === "chat") {
    NavigationService.navigate(Routes.SINGLECHATSCREEN, {
      channelId: resourceId
    });
  } else if (resourceType === "cancellation") {
    NavigationService.navigate(Routes.SCHEDULEDETAIL, {
      id: notificationId,
      resourceId,
      shouldFetch: true
    });
  } else {
    NavigationService.navigate(Routes.NOTICEDETAIL, {
      id: notificationId,
      resourceId,
      shouldFetch: true
    });
  }
});

// Set external user ID
export const OneSignalInitialize = (userId) => {

  const externalId = userId
    ? userId
    : `open_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  OneSignal.User.addTag("external_id", externalId);
};

export default OneSignalInitialize;
