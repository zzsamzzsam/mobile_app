/* eslint-disable prettier/prettier */
import { Box, HStack, Image, ScrollView, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import CheckBoxA from '../../components/common/CheckBoxA';
import Routes from '../../navigation/Routes';
import AppText from '../../components/common/Text';
import metrics from '../../themes/Metrics';
import ButtonX from '../../components/common/BottonX';
import ContainerBox from '../../components/common/CenterX';
import colors from '../../themes/Colors';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_ACTIVITIES } from '../../Apollo/Mutations/User';
import { GET_ME_USER, GET_MY_FAVOURITE_SCHEDULES, GET_SCHEDULES } from '../../Apollo/Queries';
import moment from 'moment';
import { TrackingEventTypes, state } from '../../constant';
import { showMessage } from 'react-native-flash-message';
import { trackUserEvent } from '../../utils';

const currentDate = moment();
const ActivitiesPreferences = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const fromHome = route?.params?.fromHome || false;
  const [loading, setLoading] = useState(false);
  const [activityData, setActivityData] = useState([]);
  const { data: userData } = useQuery(GET_ME_USER);

  const [updateUserActivitiesMutation] = useMutation(UPDATE_ACTIVITIES);

  useEffect(() => {
    setActivityData(userData?.meAppUser?.activities);
  }, [userData]);

  const activityArray = (value, type) => {
    if (!value) {
      if (activityData.includes(type)) {
        setActivityData(prev => prev.filter(item => item !== type));
      }
    } else {
      setActivityData(prev => [...prev, type]);
    }
  };
  const nextScreen = async () => {
    try {
      setLoading(true);
      await updateUserActivitiesMutation({
        variables: {
          input: { activities: activityData },
        },
        refetchQueries: [
          { query: GET_ME_USER },
          {
            query: GET_MY_FAVOURITE_SCHEDULES,
            variables: {
              limit: 20,
              page: 1,
            },
          },
          {
            query: GET_SCHEDULES,
            variables: {
              startDate: moment(currentDate).subtract(12, 'hours'),
              endDate: moment(currentDate).add(1, 'days'),
              limit: 80,
              page: 1,
            }
          }
        ],
      });
      trackUserEvent(TrackingEventTypes?.update_activities, {
        prev_activities: userData?.activities,
        new_activities: activityData,
      });
      if (!fromHome) {
        navigation.navigate(Routes.ONBOARDING_FINAL_PAGE);
      }
      showMessage({
        message: 'Success',
        description: 'Updated Activities',
        type: 'success',
        icon: 'success',
      });
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log('Error saving Activities', err)
    }
  };

  const leftItem = ['Aquafit', 'Archery', 'Arts', 'Badminton/Table Tennis', 'Ball/Floor Hockey', 'Basketball', 'Climbing', 'Cycling', 'Dance', 'Family', 'Fitness'];
  const rightItem = ['Guitar', 'Martial Arts', 'Performing Arts', 'Pickleball', 'Soccer', 'Swimming', 'Table Tennis', 'Ultimate Frisbee', 'Volleyball', 'Walking', 'Yoga']

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.white }}
      showsVerticalScrollIndicator={false}>
      <ContainerBox style={{ paddingTop: 10 }}>
        {!fromHome ? (
          <AppText
            fontSize={metrics.s20}
            text="Finally, please select the activities that you like. This helps build your favourites. Again you can change this any time."
          />
        ) : (
          <AppText
            fontSize={metrics.s20}
            text="Please select the activities that you like. This helps build your favourites."
          />
        )}
        <Box
          style={{
            marginTop: metrics.s20,
            width: '100%',
          }}>
          <AppText
            fontSize={metrics.s16}
            text="Activities"
            bold
            style={{ marginBottom: 10 }}
          />
          <HStack>
            <VStack space={2}>
              {leftItem &&
                leftItem.map(s => {
                  return (
                    <CheckBoxA
                      key={s}
                      title={s}
                      value={s}
                      size="sm"
                      isChecked={activityData?.includes(s) ? true : false}
                      onChange={value => activityArray(value, s)}
                    />
                  );
                })}
            </VStack>
            <VStack space={2}>
              {rightItem &&
                rightItem.map(s => {
                  return (
                    <CheckBoxA
                      key={s}
                      title={s}
                      value={s}
                      size="sm"
                      isChecked={activityData?.includes(s) ? true : false}
                      onChange={value => activityArray(value, s)}
                    />
                  );
                })}
            </VStack>
          </HStack>
        </Box>

        <Box
          style={{
            marginTop: 10,
            marginLeft: metrics.s20,
            width: '100%',
          }}>
          <VStack space={2}></VStack>
        </Box>
        <ButtonX
          title={fromHome ? 'Update' : 'Save'}
          isLoading={loading}
          isLoadingText={fromHome ? 'Updating' : 'Saving'}
          onPress={nextScreen}
          style={{ width: '100%', marginTop: metrics.s20 + metrics.s20 }}
        />
      </ContainerBox>
    </ScrollView>
  );
};

export default ActivitiesPreferences;
