/* eslint-disable prettier/prettier */
import { useRoute } from '@react-navigation/native';
import { Box } from 'native-base';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import NotificationStrip from '../../components/NotificationStrip';
import Icons from 'react-native-vector-icons/MaterialIcons';
import metrics from '../../themes/Metrics';
import Fonts from '../../themes/Fonts';
import colors from '../../themes/Colors';
import AppText from '../../components/common/Text';
import { useMutation, useQuery } from '@apollo/client';
import { GET_CANCELLATIONS, GET_NOTIFICATION, GET_NOTIFICATIONS } from '../../Apollo/Queries';
import { READ_NOTIFICATION } from '../../Apollo/Mutations';
import LoadingCircle from '../../components/LoadingCircle';
import { useStoreActions } from 'easy-peasy';
import { removeHtmlEntities } from '../../utils/utils';

const NoticeDetailScreen = () => {
  const [noticeData, setNoticeDate] = useState(null);
  const route = useRoute();
  const { id, resourceId, shouldFetch, notice } = route.params;

  const { setRefetchNotification } = useStoreActions(action => ({
    setRefetchNotification: action.app.setRefetchNotification,
  }))

  const { data } = useQuery(GET_NOTIFICATION, {
    variables: { _id: id },
    skip: !!notice,
  });
  const [readNotificationMutation, { loading }] = useMutation(READ_NOTIFICATION);

  useEffect(() => {
    const getNotificationDetails = async () => {
      try {
        if (!!notice && notice?.title) {
          setNoticeDate(notice);
          await readNotificationMutation({ variables: { _id: notice?._id }, refetchQueries: [{ query: GET_NOTIFICATIONS }] });
          setRefetchNotification();
        } else {
          setNoticeDate(data?.notification);
          await readNotificationMutation({ variables: { _id: id }, refetchQueries: [{ query: GET_NOTIFICATIONS }] });
          setRefetchNotification();
        }
      } catch (err) {
        console.log("error", err.toString());
      }
    };
    getNotificationDetails();
  }, [notice, data?.notification, id, readNotificationMutation]);

  return (
    <Box style={styles.container}>
      {
        loading ? (
          <LoadingCircle />
        ) : (
          <Box style={[styles.notificationContainer]}>
            <NotificationStrip color={colors.warning} />
            <Box style={styles.notificationContent}>
              <Icons name="warning" size={25} color={colors.warning} />
              <Box style={styles.titleBox}>
                <AppText
                  fontSize={metrics.s12}
                  style={styles.description}
                >
                  NOTICE:
                </AppText>
              </Box>
            </Box>
            <AppText
              fontSize={metrics.s12}
              style={styles.description}
            >
              {removeHtmlEntities(noticeData?.description)}
            </AppText>
          </Box>
        )
      }
    </Box>
  );
};

export default NoticeDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  notificationContainer: {
    position: 'relative',
    margin: metrics.s20,
  },
  notificationContent: {
    paddingHorizontal: metrics.s10,
    paddingVertical: metrics.s20,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  titleBox: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  description: {
    lineHeight: 20,
    marginLeft: metrics.s10,
    marginRight: metrics.s10 / 2,
    fontFamily: Fonts.medium,
  },
});
