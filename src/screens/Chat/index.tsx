/* eslint-disable prettier/prettier */
import { View, Text, FlatList, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client';
import { Avatar, Badge } from 'native-base';
import Fonts from '../../themes/Fonts';
import colors from '../../themes/Colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Routes from '../../navigation/Routes';
import { useStoreActions, useStoreState } from 'easy-peasy';
import useSearch from '../../hooks/useSearch';
import { Searchbar } from 'react-native-paper';
import LoadingCircle from '../../components/LoadingCircle';
import { avatarAbbr } from '../../utils/utils';
import { useSubscriptionData } from '../../Services/Chat/ChatProvider';
import { useIsFocused } from '@react-navigation/native';
import { GET_MY_PACKAGES } from '../../Apollo/Queries/GetMe';
import ChatWidget from './ChatWidget';
import { REQUEST_AGENT_CHAT } from '../../Apollo/Mutations/Channel';
const supportIcon = "https://firebasestorage.googleapis.com/v0/b/highlevel-backend.appspot.com/o/locationPhotos%2FZ75OcAlf7ZdzKogbywAQ%2Fchat-widget-person?alt=media&token=873f0592-b63b-4a89-8b8f-14a02a809656";
const ChatScreen = ({ navigation }) => {
    const {
      data: subscriptionData,
      channelsData,
      refetchChannels,
    } = useSubscriptionData();
    const { data: packagesData } = useQuery(GET_MY_PACKAGES, {
      fetchPolicy: 'cache-and-network',
    });
    const [showSupportChat, setShowSupportChat] = useState(false);
    const [sendMessageMutation] = useMutation(REQUEST_AGENT_CHAT);
    const {actualUser} = useStoreState(state => ({
      actualUser: state?.login?.actualUser,
    }));

    const isStaff = useMemo(() => {
      if(actualUser?.membershipType !== 'TPASC Staff') {
        return false;
      }
      if (packagesData?.myEzPackages?.find(s => s?.PackagePlanID === 277721)) {
        return true;
      }
      return false;
    }, [actualUser, packagesData]);
    
    const initSupportChat = async () => {
      const rest = await sendMessageMutation({
        variables: {
          input: {
            name: "test"
          }
        }
      })
      console.log('Rest=====', rest);
      if(rest?.data?.requestAgentChat?.agentChat) {
          navigation.navigate(Routes.SINGLECHATSCREEN, {
            username: `Customer Support`,
            channelId: rest.data.requestAgentChat._id,
          });
      }
    }
    // const {data: subscriptionData} = useChatSubscription()
    useEffect(() => {
      if (subscriptionData) {
        console.log('Event on Channel List', subscriptionData?.newMessage?.message);
        refetchChannels();
      }
    }, [subscriptionData]);

    const hasAgentChat = useMemo(() => {
      if(channelsData?.channels.find(s => s.agentChat)) {
        return true;
      }
      return false;
    }, [channelsData?.channels]);
    const _renderItem = useCallback(({ item }) => {
        const channelUser = item?.members.find(x => x._id !== actualUser?._id);// channel must have 2 users only
        // console.log('the----', item?.latestMessage?.read)
        return (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate(Routes.SINGLECHATSCREEN, {
                username: `${channelUser?.firstName} ${channelUser?.lastName}`,
                channelId: item?._id,
              })
            }>
            <View
              style={{flexDirection: 'row', padding: 10, alignItems: 'center'}}>
              <Avatar
                bg={colors.gray}
                mr="1"
                _text={{
                  color: colors.black,
                }}
                source={{uri: channelUser?.memberPhotoUrl}}>
                {avatarAbbr(channelUser?.firstName, channelUser?.lastName)}
              </Avatar>

              <View style={{paddingLeft: 10}}>
                <Text
                  style={{
                    fontFamily: Fonts.book,
                    fontWeight: '500',
                    fontSize: 16,
                  }}>
                  {`${channelUser?.firstName} ${channelUser?.lastName}`}{' '}
                </Text>
                <Text
                  style={{
                    fontFamily: Fonts.medium,
                    paddingTop: 5,
                    color: colors.gray,
                    // fontWeight: item?.latestMessage?.sender?._id !== userData.meAppUser?._id ? '500' : !item?.latestMessage.read ? '500' : '700',
                    fontWeight:
                      item?.latestMessage?.sender?._id === actualUser?._id
                        ? item.latestMessage?.read
                          ? '500'
                          : '500'
                        : item.latestMessage?.read
                        ? '500'
                        : '700',
                    fontSize: 14,
                  }}>{`${
                  item?.latestMessage?.sender?._id === actualUser?._id
                    ? 'You:'
                    : ''
                } ${item?.latestMessage?.message || ''}`}</Text>
              </View>
              {!!item?.unreadCount && <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.unreadCount}</Text>
              </View>}
            </View>
          </TouchableOpacity>
        );
    }, [actualUser]);


    if (!actualUser) {
        return <LoadingCircle color={colors.primary} />;
    }

    return (
      <View style={{flex: 1}}>
        {isStaff && (
          <TouchableOpacity
            onPress={() => navigation.navigate(Routes.USERSEARCHSCREEN)}>
            <Searchbar
              editable={false}
              placeholder="Search"
              value={''}
              style={{
                backgroundColor: colors.white,
                height: 50,
                borderRadius: 5,
                margin: 5,
              }}
            />
          </TouchableOpacity>
        )}
        {!hasAgentChat && <TouchableOpacity
          activeOpacity={0.8}
          style={{backgroundColor: 'white'}}
          onPress={() => {
            // support press
            // setShowSupportChat(true);
            initSupportChat();
          }
          }>
          <View
            style={{flexDirection: 'row', padding: 10, alignItems: 'center'}}>
            <Avatar
              bg={colors.gray}
              mr="1"
              _text={{
                color: colors.black,
              }}
              source={{uri: supportIcon}}>
            </Avatar>

            <View style={{paddingLeft: 10}}>
              <Text
                style={{
                  fontFamily: Fonts.book,
                  fontWeight: '500',
                  fontSize: 16,
                }}>
                Customer Support
              </Text>
              <Text
                style={{
                  fontFamily: Fonts.medium,
                  paddingTop: 5,
                  color: colors.gray,
                  // fontWeight: item?.latestMessage?.sender?._id !== userData.meAppUser?._id ? '500' : !item?.latestMessage.read ? '500' : '700',
                  fontWeight: 500,
                  fontSize: 14,
                }}>Click to chat</Text>
            </View>
          </View>
        </TouchableOpacity>}
        <FlatList
          style={{backgroundColor: colors.white, flex: 1}}
          data={channelsData?.channels}
          renderItem={_renderItem}
        />
        {showSupportChat && <View style={styles.widgetContainer}>
          <ChatWidget />
        </View>}
      </View>
    );
}

export default ChatScreen;

const styles = StyleSheet.create({
    widgetContainer: {
      backgroundColor: 'red',
      ...StyleSheet.absoluteFillObject,
    },
    searchContainer: {

    },
    badgeText: {

    },
    badge: {
        backgroundColor: colors.secondary,
        // color: colors.secondary,
        borderRadius: 100,
        // overflow: 'hidden',
        padding: 5,
        position: 'absolute',
        right: 10,
        // top: 0
    }
});