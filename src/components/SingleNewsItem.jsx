/* eslint-disable prettier/prettier */
import { TouchableOpacity, StyleSheet, Image } from 'react-native'
import React from 'react'
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import Routes from '../navigation/Routes';
import { Box, Text } from 'native-base';
import Fonts from '../themes/Fonts';
import colors from '../themes/Colors';
import { trackUserEvent } from '../utils';
import { TrackingEventTypes } from '../constant';

const SingleNewsItem = ({ item }) => {
    const navigation = useNavigation();
    const onItemPress = () => {
        trackUserEvent(TrackingEventTypes?.news_opened, {
            data: item,
        });
        navigation.navigate(Routes.SINGLENEWS, { news: item });
    };
    return (
        <TouchableOpacity
            activeOpacity={0.5}
            onPress={onItemPress}
        >
            <Box style={styles.content}>
                <Box style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                        source={{ uri: item?.image }}
                        resizeMode='cover'
                        style={{ width: 100, height: '90%' }}
                        alt={`${item?.image}`}
                    />
                </Box>
                <Box style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.feedTitle} noOfLines={2}>{item.title}</Text>
                    <Text style={styles.description} noOfLines={2}>
                        {item.sub_title}
                    </Text>
                    <Text style={styles.date}>
                        {item?.date ?
                            (moment(item?.date).isSame(moment(), 'year') ?
                                `${moment(item?.date).format('ddd D MMMM')}` :
                                `${moment(item?.date).format('ddd D MMMM YYYY')}`)
                            : ''}
                    </Text>
                </Box>
            </Box>
        </TouchableOpacity>
    )
};

export default React.memo(SingleNewsItem);

const styles = StyleSheet.create({
    content: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 10,
        flexDirection: 'row',
        minHeight: 120,
        justifyContent: 'space-between',
    },
    feedTitle: {
        fontSize: 14,
        color: colors.primary,
        fontFamily: Fonts.bold,
        fontWeight: 700,
        lineHeight: 16,
    },
    description: {
        paddingTop: 2,
        fontFamily: Fonts.book,
        letterSpacing: 0.1,
        lineHeight: 16,
    },
    date: {
        // marginTop: 5,
        fontSize: 12,
        color: colors.black,
        fontFamily: Fonts.book,
    },
});
