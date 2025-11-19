/* eslint-disable prettier/prettier */

import React, { useEffect, useMemo } from 'react';
import { Avatar, Box, Image, Pressable, Badge, VStack, Text } from 'native-base';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import Routes from '../../../navigation/Routes';
import colors from '../../../themes/Colors';
import { GET_ME_USER, GET_NOTIFICATIONS } from '../../../Apollo/Queries';
import { useQuery } from '@apollo/client';
import { useStoreState } from 'easy-peasy';
import Fonts from '../../../themes/Fonts';
// import { Badge } from 'react-native-paper';

const PAGE_LIMIT = 100;
const HeaderTitle = ({ navigation }) => {
  const { refetchNotification } = useStoreState(st => ({
    refetchNotification: st.app.refetchNotification,
  }));
  const { data, refetch } = useQuery(GET_NOTIFICATIONS, {
    variables: {
      limit: PAGE_LIMIT,
      page: 1,
    },
  });
  useEffect(() => {
    refetch();
  }, [refetchNotification]);
  const { data: userData } = useQuery(GET_ME_USER);
  const unReadNotification = useMemo(() => {
    return data?.myNotifications?.items?.filter(s => !s.isRead);
  }, [data?.myNotifications?.items]);

  return (
    <Box
      style={{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>

      <Pressable
        style={{ marginLeft: 5 }}
        onPress={() => navigation.navigate(Routes.NOTICE)}>
        <VStack>
          {!!unReadNotification?.length && (
            <Badge // bg="red.400"
              colorScheme="danger"
              rounded="full"
              mb={-4}
              mr={-4}
              zIndex={1}
              variant="subtle"
              alignSelf="flex-end"
              _text={{
                fontSize: 10,
              }}>
              {unReadNotification?.length}
            </Badge>
          )}
          <MaterialCommunity
            color={colors.primary}
            name={
              unReadNotification?.length > 0
                ? 'bell-ring-outline'
                : 'bell-outline'
            }
            size={25}
          />
        </VStack>
      </Pressable>
      <Image
        style={{ height: 50, width: '55%' }}
        resizeMode="contain"
        source={require('../../../public/logo.png')}
        alt="Logo"
      />
      <Pressable
        style={{ marginRight: 5 }}
        onPress={() => {
          navigation.navigate(Routes.ACCOUNT);
        }}>
        <Avatar size="sm" source={{ uri: userData?.meAppUser?.memberPhotoUrl }} />
        {/* <MaterialCommunity color={colors.primary} name="credit-card-scan-outline" size={25} /> */}
      </Pressable>
    </Box>
  );
};

export const HeaderTextTitle = ({text}) => {
  return (
    <Text
      style={{
        fontSize: 16,
        fontFamily: Fonts.book,
        fontWeight: '700',
        color: colors.primary
      }}
    >
      {text}
    </Text>
  )
};

const TopLogo = () => {
  return (
    <Box
      style={{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image
        style={{ height: 50, width: '55%' }}
        resizeMode="contain"
        source={require('../../../public/logo.png')}
        alt="Logo"
      />
    </Box>
  );
};


export { TopLogo, HeaderTitle };
