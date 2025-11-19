/* eslint-disable prettier/prettier */
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client';
import { GET_CHANNELS, GET_ME_USER, GET_USERS } from '../../Apollo/Queries';
import AntIcon from 'react-native-vector-icons/AntDesign';
import colors from '../../themes/Colors';
import { Avatar, Divider } from 'native-base';
import { avatarAbbr } from '../../utils/utils';
import Fonts from '../../themes/Fonts';
import EmptyBox from '../../components/common/EmptyBox';
import { JOIN_CHANNEL } from '../../Apollo/Mutations';
import _ from 'lodash';
import { useStoreState } from 'easy-peasy';
import Routes from '../../navigation/Routes';
import { Searchbar } from 'react-native-paper';

const UserSearchScreen = ({ navigation }) => {
    const { data: searchedUsers, refetch: refetchUsers } = useQuery(GET_USERS);
    const { data: channelsData, loading: channelLoading } = useQuery(GET_CHANNELS, {
        fetchPolicy: 'cache-and-network',
    });
    const [query, setQuery] = useState(null);
    const [joinChannelMutation] = useMutation(JOIN_CHANNEL, {
        refetchQueries: [{ query: GET_USERS }, { query: GET_ME_USER }, { query: GET_CHANNELS }],
    });
    const debouncedRefetch = useCallback(
      _.debounce(search => {
        refetchUsers({search});
      }, 500),
      [refetchUsers],
    );
     useEffect(() => {
       if (query) {
         debouncedRefetch(query);
       }
     }, [query, debouncedRefetch]);
    const updateSearch = (search) => {
        setQuery(search);
    };

    const startChat = useCallback(async (item) => {
        try {
            const existingChannel = channelsData.channels.find(s =>
              s?.memberIds.includes(item._id),
            );
            let channelId = existingChannel?._id;
            console.log('existing====', existingChannel);
            if(!existingChannel) {
                const joinRes = await joinChannelMutation({
                  variables: {
                    userId: item?._id,
                  },
                });
                console.log('join Res====', joinRes);
                channelId = joinRes?.data?.joinChannel?._id
            }
            if(!channelId) {
                throw new Error('Error getting channel id');
            }
            navigation.navigate(Routes.SINGLECHATSCREEN, {
              username: `${item?.firstName} ${item?.lastName}`,
              channelId,
            });
        } catch(e) {
            console.log('Error starting chat', e);
        }
    }, [channelsData])

    const _renderItem = useCallback(({ item }) => {

        return (
            <TouchableOpacity
                activeOpacity={0.8}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Avatar
                            bg={colors.gray}
                            mr="1"
                            _text={{
                                color: colors.black,
                            }}
                            source={{ uri: item?.memberPhotoUrl }}
                        >
                            {avatarAbbr(item?.firstName, item?.lastName)}
                        </Avatar>
                        <View style={{ paddingLeft: 10 }}>
                            <Text style={{ fontFamily: Fonts.book, fontWeight: '500', fontSize: 16 }}>{`${item?.firstName} ${item?.lastName}`}</Text>
                            <Text style={{ fontFamily: Fonts.book, fontWeight: '500', fontSize: 12, lineHeight: 18 }}>{item?.membershipType || ''}</Text>
                        </View>
                    </View>
                    <View style={{ marginRight: 15 }}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => startChat(item)}
                        >
                            <Text style={{ fontFamily: Fonts.book, fontWeight: '700', color: colors.secondary }}>Chat</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }, []);


    return (
      <View style={{flex: 1}}>
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center', padding: 5}}>
              {/* <HeaderBack /> */}
              <Searchbar
                placeholder="Search"
                value={''}
                style={{
                  backgroundColor: colors.white,
                //   height: 50,
                  width: '100%',
                  borderRadius: 5,
                //   margin: 5,
                //   paddingRight: 10,
                }}
                // style={{
                //   width: 200,
                //   marginLeft: 10,
                //   fontSize: 16,
                //   fontFamily: Fonts.book,
                //   padding: 10,
                // }}
                placeholderTextColor={colors.gray}
                selectionColor={colors.primary}
                value={query}
                onChangeText={updateSearch}
              />
            </View>
            {/* <View>
              {!!query && (
                <AntIcon
                  name="close"
                  size={20}
                  color={colors.black}
                  style={{marginRight: 15}}
                  onPress={() => updateSearch('')}
                />
              )}
            </View> */}
          </View>
        </View>
        <FlatList
          ListHeaderComponent={() => {
            return (
              <Text
                style={{
                  marginLeft: 10,
                  fontFamily: Fonts.book,
                  fontSize: 16,
                  fontWeight: '700',
                  marginVertical: 10,
                }}>
                Peoples
              </Text>
            );
          }}
          style={{backgroundColor: colors.white}}
          data={searchedUsers?.ezUsers || []}
          renderItem={_renderItem}
          ItemSeparatorComponent={() => {
            return (
              <Divider style={{height: 5, backgroundColor: colors.white}} />
            );
          }}
          ListEmptyComponent={() => {
            return (
              <EmptyBox
                bg={colors.homeBg}
                style={{marginHorizontal: 10}}
                description={'No result'}
              />
            );
          }}
        />
      </View>
    );
};

export default UserSearchScreen

const styles = StyleSheet.create({})