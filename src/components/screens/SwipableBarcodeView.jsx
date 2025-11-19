/* eslint-disable prettier/prettier */
import { Dimensions, StyleSheet, Animated } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Button } from 'native-base';
import Barcode from '@kichiyaki/react-native-barcode-generator';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import LoadingCircle from '../LoadingCircle';
import Routes from '../../navigation/Routes';
import AppText from '../common/Text';
import colors from '../../themes/Colors';
import { useQuery } from '@apollo/client';
import { GET_BARCODES } from '../../Apollo/Queries';
import { showMessage } from 'react-native-flash-message';
import ButtonX from '../common/BottonX';
import metrics from '../../themes/Metrics';
import Fonts from '../../themes/Fonts';
import { showCardType } from '../../utils';
import {useAppState} from '@react-native-community/hooks';

const WIDTH = Dimensions.get('window').width - 40;
const HEIGHT = Dimensions.get('window').height;

const SwipableBarcodeView = () => {
    const navigation = useNavigation();
    const [active, setActive] = useState(0);
    const scrollViewRef = useRef(null);
    const appState = useAppState();
    const isFocused = useIsFocused();
    const { data, loading: barcodeLoading, refetch } = useQuery(GET_BARCODES, {
        fetchPolicy: 'network-only'
    });
    const [intervalId, setIntervalId] = useState(null);

    useEffect(() => {
      const startInterval = () => {
        const id = setInterval(() => {
          console.log('Interval is running');
          if (!isFocused) {
            console.log('skipping not focused');
          } else {
            refetch();
          }
        }, 20 * 1000);
        setIntervalId(id);
      };

      const stopInterval = () => {
        clearInterval(intervalId);
      };

      if (appState === 'active' && isFocused) {
        // console.log('BARCODE======', 'focused');
        startInterval();
      } else {
        // console.log('BARCODE======', 'removed');
        stopInterval();
      }

      // Clear interval when the component is unmounted or loses focus
      return () => {
        // console.log('BARCODE======', 'clearing');
        clearInterval(intervalId);
      };
    }, [isFocused, appState]);
    // const onchange = (nativeEvent) => {
    //     if (nativeEvent) {
    //         const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width);
    //         if (slide) {
    //             if (slide === data?.appBarcode?.barcodes.length - 1 && slide > data?.appBarcode?.barcodes.length - 1) {
    //                 setActive(slide);
    //             } else {
    //                 setActive(0);
    //             }
    //         }
    //     }
    // };
    const onLinkMorePress = async () => {
        if (data?.appBarcode?.length === 3) {
            showMessage({
                message: "Info",
                description: "Cannot Save More Than 3 Barcodes",
                type: 'info',
                icon: 'info',
            });
        } else {
            navigation.navigate(Routes.LINKBARCODE);
        }
    };
    const _renderItem = useCallback(({ item, index }) => {
        return (
            <Box>
                <AppText color={colors.primary} style={{ textAlign: 'center' }}>{showCardType(item?.message?.trim())}</AppText>
                <Barcode
                    format="CODE128"
                    value={item.barcode}
                    text={item.barcode}
                    textStyle={{ color: colors.primary }}
                    background="none"
                    style={styles.wrap}
                />
            </Box>
        )
    }, []);

    return (
        <Box>
            <Box style={{ height: 200 }}>
                {
                    barcodeLoading ? (
                        <LoadingCircle />
                    ) : (
                        (data?.appBarcode && data?.appBarcode?.length > 0) ? (
                            <Animated.FlatList
                                data={data?.appBarcode}
                                horizontal
                                scrollEnabled={false}
                                showsHorizontalScrollIndicator={false}
                                // onScroll={({ nativeEvent }) => onchange(nativeEvent)}
                                ref={scrollViewRef}
                                pagingEnabled
                                renderItem={_renderItem}
                            />
                        ) : (
                            <Box style={{ height: '100%', justifyContent: 'center', backgroundColor: colors.homeBg, alignItems: 'center' }}>
                                <AppText
                                    text="Barcode not linked yet."
                                    fontSize={16}
                                    style={{ textAlign: 'center' }}
                                />
                            </Box>
                        )
                    )
                }
                {
                    (data?.appBarcode && data?.appBarcode?.length > 0) && (
                        <Box style={styles.nextPrev}>
                            <Button
                                onPress={() => {
                                    if (active <= data?.appBarcode?.length - 1) {
                                        setActive(active - 1);
                                        scrollViewRef.current.scrollToIndex({
                                            animated: true,
                                            index: active - 1,
                                        });
                                    }
                                }}
                                isFocusVisible={true}
                                isDisabled={active === 0}
                                style={styles.nextPrevBtn}
                                _text={{
                                    color: colors.primary,
                                    fontFamily: Fonts.medium,
                                }}>
                                Prev
                            </Button>
                            <Button
                                onPress={() => {
                                    if (active < data?.appBarcode?.length - 1) {
                                        setActive(active + 1);
                                        scrollViewRef.current.scrollToIndex({
                                            animated: true,
                                            index: active + 1,
                                        });
                                    }
                                }}
                                isDisabled={(!(active < data?.appBarcode?.length && active < data?.appBarcode?.length - 1))}
                                style={styles.nextPrevBtn}
                                _text={{
                                    color: colors.primary,
                                    fontFamily: Fonts.medium,
                                }}>
                                Next
                            </Button>
                        </Box>
                    )
                }
            </Box>
            <Box>
                <ButtonX
                    title="Link More"
                    onPress={onLinkMorePress}
                    style={{ width: '100%', marginTop: metrics.s20 + metrics.s20 }}
                />
                {
                    (!!data?.appBarcode && !data?.appBarcode?.length <= 0) && (
                        <ButtonX
                            title="Unlink Barcode"
                            onPress={() => navigation.navigate(Routes.UNLINKBARCODE, { barcode: data?.appBarcode[active] })}
                            style={{ width: '100%', marginTop: metrics.s20, backgroundColor: colors.danger }}
                        />
                    )
                }
            </Box>
        </Box >
    );
};
const styles = StyleSheet.create({
    wrap: {
        flex: 1,
        width: WIDTH,
        height: HEIGHT * 0.25,
    },
    nextPrevBtn: {
        width: '45%',
        borderRadius: 0,
        backgroundColor: colors.white,
    },
    nextPrev: {
        marginTop: 10,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
export default SwipableBarcodeView;
