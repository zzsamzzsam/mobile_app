/* eslint-disable prettier/prettier */
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import React, { useCallback } from 'react'
import { Avatar, Box, Divider, FlatList, Image, Skeleton } from 'native-base';
import AppText from '../../components/common/Text';
import Fonts from '../../themes/Fonts';
import colors from '../../themes/Colors';
import metrics from '../../themes/Metrics';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@apollo/client';
import { GET_VIDEOS } from '../../Apollo/Queries';
import moment from 'moment';
import viewFormatter from '../../utils';
import Routes from '../../navigation/Routes';


const { height: HEIGHT, width: WIDTH } = Dimensions.get('window');

const HomeVideoFeed = () => {
    const navigation = useNavigation();
    const { data, loading } = useQuery(GET_VIDEOS, {
        variables: {
            organizationId: '5f60bcc4cce4855acd244bd8',
        },
    });

    const _renderItem = ({ item, index }) => {
        // if(item?.premiereAt) {
        //     return null;
        // }
        let views = '0';
        if (item.totalViews) {
            views = viewFormatter(item.totalViews, 1);
        }
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => navigation.navigate(Routes.GETFITTAB, {
                    screen: Routes.VIDEO,
                    params: { vidId: item?.vidId},
                })}
                style={styles.container}
            >
                <Image
                    source={{ uri: item?.thumbnail }}
                    alt='img'
                    style={styles.thumbnail}
                />
                <View style={styles.descContainer}>
                    <Avatar size={10} source={{ uri: item?.trainer?.trainerPicUrl }} />
                    <Box style={{ paddingLeft: 10, flexShrink: 1 }}>
                        <Text style={styles.boldTitle} numberOfLines={2} >{item?.title}</Text>
                        <Text style={styles.text} numberOfLines={1}>{(item.trainer && item.trainer.name) || ''} &#183; {(item.activity && item.activity.name) || ''}</Text>
                        <Text style={styles.text} numberOfLines={1}>{item.premiereAt ? moment(item.premiereAt).fromNow() : moment(item.createdAt).fromNow()}</Text>
                    </Box>
                </View>
            </TouchableOpacity>
        );
    };

    const ItemSeparator = useCallback(({ orientation }) => {
        return (<Divider
            style={{
                width: metrics.s10,
                backgroundColor: 'transparent'
            }}
        />
        )

    }, []);

    const _renderVideoSkeleton = useCallback(({ item }) => {
        return <Box>
            <Skeleton flex="1" h='100' w='150' startColor={colors.gray} />
        </Box>;
    }, []);
    if (!data?.latestVideos?.length) {
        return;
    }

    return (
        <View style={{ marginHorizontal: metrics.s20 }}>
            <AppText
                text="Videos"
                style={[styles.bold, { color: colors.primary, paddingVertical: 10 }]}
            />
            {
                loading ? (
                    <Box>
                        <FlatList
                            data={[1, 2, 3]}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, idx) => `${item?._id}-${idx}`}
                            ItemSeparatorComponent={ItemSeparator}
                            renderItem={_renderVideoSkeleton}
                        />
                    </Box>
                ) : (
                    <FlatList
                        data={data.latestVideos}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, idx) => `${item?._id}-${idx}`}
                        ItemSeparatorComponent={ItemSeparator}
                        renderItem={_renderItem}
                    />
                )
            }
        </View>
    );
};
const styles = StyleSheet.create({

    bold: {
        fontSize: 14,
        fontFamily: Fonts.bold,
        fontWeight: 700,
    },
    container: {
        backgroundColor: '#fff',
        width: WIDTH * 0.55,
        paddingBottom: 5,
    },
    thumbnail: {
        backgroundColor: colors.secondary,
        height: 100,
        resizeMode: 'cover',
    },
    descContainer: {
        paddingTop: 5,
        paddingHorizontal: 5,
        flexDirection: 'row',
    },
    boldTitle: {
        fontFamily: Fonts.book,
        fontSize: 14,
        fontWeight: '700',
        color: colors.primary,
        lineHeight: 15,
    },
    text: {
        fontFamily: Fonts.book,
        color: colors.dark,
        fontSize: 12,
    },
})

export default HomeVideoFeed