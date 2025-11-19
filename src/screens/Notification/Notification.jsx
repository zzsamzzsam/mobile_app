/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import { Box, ScrollView, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useStoreState } from 'easy-peasy';
import CheckBoxA from '../../components/common/CheckBoxA';
import { showMessage } from 'react-native-flash-message';
import AppText from '../../components/common/Text';
import ButtonX from '../../components/common/BottonX';
import metrics from '../../themes/Metrics';
import colors from '../../themes/Colors';
import Routes from '../../navigation/Routes';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_NOTIFICATION } from '../../Apollo/Mutations/User';
import { GET_ME_USER } from '../../Apollo/Queries';
import Fonts from '../../themes/Fonts';
import ModalX from '../../components/common/Modal';
import { TrackingEventTypes } from '../../constant';
import { trackUserEvent } from '../../utils';

const NotificationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { fromHome } = route.params || false;
  const [types, setTypes] = useState([])
  const [cancelTTVisible, setCancelTTvisible] = useState(false);
  const [categories, setCategories] = useState([])
  const [updateUserNotification, { loading }] = useMutation(UPDATE_NOTIFICATION);
  const { data, loading: userLoading, error } = useQuery(GET_ME_USER);

  const { userToken } = useStoreState(state => ({
    userToken: state.login.userToken,
  }));
  useEffect(() => {
    setTypes(data?.meAppUser?.notificationTypes);
    setCategories(data?.meAppUser?.notificationCategories);
  }, [navigation]);

  const insertTypes = (value, type) => {
    if (!value) {
      if (types.includes(type)) {
        setTypes(prev => prev.filter(item => item !== type));
      };
    } else {
      setTypes(prev => [...prev, type]);
    }
  };

  const insertCategories = (value, type) => {
    if (!value) {
      if (categories.includes(type)) {
        setCategories(prev =>
          prev.filter(item => item !== type),
        );
      }
    } else {
      setCategories(prev => [...prev, type]);
    }
  };
  const nextScreen = async () => {
    if (!userToken) {
      showMessage({
        message: "Error",
        description: "Invalid Credentials",
        type: 'danger',
        icon: 'danger',
      });
    }
    try {
      const input = {
        notificationTypes: types,
        notificationCategories: categories,
      }
      // await updateAppNotification({ input })
      await updateUserNotification({
        variables: { input },
        refetchQueries: [{ query: GET_ME_USER }],
      });
      trackUserEvent(TrackingEventTypes?.notification_updated, {
        data: input,
      });
      showMessage({
        message: 'Success',
        description: 'Updated Notifications successfully',
        type: 'success',
        icon: 'success',
      });
      if (fromHome) {
        navigation.navigate(Routes.HOME)
      } else {
        navigation.navigate(Routes.ACCOUNT)
      }
    } catch (err) {
      console.log('errpr', err);
      showMessage({
        message: 'Error',
        description: "Error on Update Notification",
        type: 'danger',
        icon: 'danger',
      });
    }
  };

  const typesList = ['Events', 'Closures', 'Cancellations'];
  const categoriesList = ['General Building', 'Gymnasium', 'Aquatics ', 'Parking', 'Fitness classes & Studies', 'Track', 'Promotions']
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Box style={styles.codeContainer}>
        <AppText
          // text={"Let's update your preferences for the types of notifications you would like to receive."}
          text={'Please set your notification preferences'}
          style={styles.heading}
        />
        <Box
          style={{
            marginTop: metrics.s20,
            width: '100%',
          }}>
          <AppText text={'Notice Types'} bold style={{ marginBottom: 10 }} />
          <VStack space={2} key={1}>
            {typesList &&
              typesList.map((type, idx) => {
                return (
                  <CheckBoxA
                    key={type}
                    title={type}
                    icon={type === 'Cancellations'}
                    onIconPress={() => setCancelTTvisible(true)
                    }
                    value={type}
                    size="md"
                    isChecked={types?.includes(type) ? true : false}
                    onChange={value => insertTypes(value, type)}
                  />
                );
              })}
          </VStack>
        </Box>

        <Box
          style={{
            marginTop: 10,
            width: '100%',
          }}>
          <AppText text={'Notice Categories'} bold style={{ marginBottom: 10 }} />
          <VStack space={2} key={2}>
            {categoriesList &&
              categoriesList.map((category, idx) => {
                return (
                  <CheckBoxA
                    key={category}
                    title={category}
                    value={category}
                    size="sm"
                    isChecked={categories?.includes(category) ? true : false}
                    onChange={value => insertCategories(value, category)}
                  />
                );
              })}
          </VStack>
        </Box>
        <ButtonX
          title={fromHome ? 'Save' : 'Update'}
          isLoading={loading}
          isLoadingText={fromHome ? 'Saving' : 'Updating'}
          onPress={nextScreen}
          style={{ width: '100%', marginTop: metrics.s20 + metrics.s20 }}
        />
      </Box>
      <ModalX
        visible={cancelTTVisible}
        onDismiss={() => setCancelTTvisible(false)}
        // height="auto"
        width="80%"
        title="Cancellations">
        <Box>
          <AppText textAlign="center">
            You will only receive cancellation notices for items you have
            favourited or have registered for. We highly recommend checking this
          </AppText>
        </Box>
      </ModalX>
    </ScrollView>
  );
};


export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: metrics.s20,
    backgroundColor: colors.white,
  },

  codeContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  heading: {
    fontSize: metrics.s20,
    fontFamily: Fonts.book,
    paddingTop: 10,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  error: {
    color: colors.danger,
  },
  checkboxView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: colors.white,
    fontFamily: Fonts.book,
  },
});
