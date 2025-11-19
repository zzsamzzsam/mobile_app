/* eslint-disable prettier/prettier */
import { Box, ScrollView, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import CheckBoxA from '../../components/common/CheckBoxA';
import Routes from '../../navigation/Routes';
import AppText from '../../components/common/Text';
import ContainerBox from '../../components/common/CenterX';
import colors from '../../themes/Colors';
import metrics from '../../themes/Metrics';
import ButtonX from '../../components/common/BottonX';
import { showMessage } from 'react-native-flash-message';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ME_USER } from '../../Apollo/Queries';
import { UPDATE_NOTIFICATION } from '../../Apollo/Mutations/User';
import Fonts from '../../themes/Fonts';
import ModalX from '../../components/common/Modal';
import { trackUserEvent } from '../../utils';
import { TrackingEventTypes } from '../../constant';

const NotificationPreferences = () => {
  const navigation = useNavigation();
  const [types, setTypes] = useState([]);
  const [cancelTTVisible, setCancelTTvisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const { data: userData } = useQuery(GET_ME_USER);
  const [updateUserNotificationMutation] = useMutation(UPDATE_NOTIFICATION);

  useEffect(() => {
    if (userData?.meAppUser && !userData?.meAppUser.notificationTypes || userData?.meAppUser?.notificationTypes.length === 0) {
      setTypes(['Events', 'Closures', 'Cancellations']);
    } else {
      setTypes(userData?.meAppUser?.notificationTypes || []);
    }
    if (userData?.meAppUser && !userData?.meAppUser.notificationCategories || userData?.meAppUser?.notificationCategories.length === 0) {
      setCategories(['General Building', 'Gymnasium', 'Aquatics ', 'Parking', 'Fitness classes & Studies', 'Track', 'Promotions']);
    } else {
      setCategories(userData?.meAppUser?.notificationCategories || []);

    }
  }, [userData?.meAppUser]);

  const insertTypes = (value, type) => {
    if (!value) {
      if (types.includes(type)) {
        setTypes(prev => prev.filter(item => item !== type));
      }
    } else {
      setTypes(prev => [...prev, type]);
    }
  };

  const insertCategories = (value, type) => {
    if (!value) {
      if (categories.includes(type)) {
        setCategories(prev =>
          prev.filter(item => item !== type)
        );
      }
    } else {
      setCategories(prev => [...prev, type]);
    }
  };

  const nextScreen = async () => {
    try {
      setLoading(true);
      const input = {
        notificationTypes: types,
        notificationCategories: categories,
      }
      await updateUserNotificationMutation({
        variables: { input },
        refetchQueries: [{ query: GET_ME_USER }]
      });
      trackUserEvent(TrackingEventTypes?.notification_updated, {
        data: input,
      });
      setLoading(false);
      showMessage({
        message: 'Success',
        description: 'Updated Notifications successfully',
        type: 'success',
        icon: 'success',
      });
      navigation.navigate(Routes.ACTIVITIESPREF);
    } catch (error) {
      setLoading(false);
      console.log('errpr', error);
      showMessage({
        message: 'Error',
        description: "Error on Update Notification",
        type: 'danger',
        icon: 'danger',
      });
    }
  };
  const typesList = ['Events', 'Closures', 'Cancellations'];
  const categoriesList = ['General Building', 'Gymnasium', 'Aquatics ', 'Parking', 'Fitness classes & Studies', 'Track', 'Promotions'];
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.white }}
      showsVerticalScrollIndicator={false}>
      <ContainerBox
      >
        <AppText
          fontSize={metrics.s20}
          text="Let's set your preferences for the types of notifications you would like to receive. You can change this later in notifications"
          style={styles.heading}
        />
        <Box
          style={{
            marginTop: metrics.s20,
            width: '100%',
          }}>
          <AppText
            bold
            text="Notice Types"
            style={[styles.bookText, { marginBottom: metrics.s10 }]}
          />
          <VStack space={2}>
            {typesList &&
              typesList.map((type, idx) => {
                return (
                  <CheckBoxA
                    key={type}
                    title={type}
                    icon={type === 'Cancellations'}
                    onIconPress={() => {
                      setCancelTTvisible(true);
                      return false;
                    }
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
          <AppText
            bold
            text="Notice Categories"
            style={[styles.bookText, { marginBottom: metrics.s10 }]}
          />
          <VStack space={2}>
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
          title="Save"
          isLoading={loading}
          isLoadingText="Saving"
          onPress={nextScreen}
          style={{ width: '100%', marginTop: metrics.s20 + metrics.s20 }}
        />
      </ContainerBox>
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

export default NotificationPreferences;

const styles = StyleSheet.create({
  heading: {
    fontFamily: Fonts.book,
  },
  bookText: {
    fontFamily: Fonts.medium,
    color: colors.primary,
  },
});
