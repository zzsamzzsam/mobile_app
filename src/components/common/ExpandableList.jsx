/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable prettier/prettier */
import { useState } from 'react';
import ChipX from './ChipX';
import { Box, Divider, Pressable, Text } from 'native-base';
import { StyleSheet } from 'react-native';
import colors from '../../themes/Colors';
import Fonts from '../../themes/Fonts';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


const ExpandableItem = ({ title, data, containerStyle, filtersValue, setFiltersValue }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };
    const onPressChip = (value) => {
        let newData = null;
        if (value === "All") {
            newData = {
                all: true,
                selected: [],
            };
        } else {
            if (!filtersValue?.selected.includes(value)) {
                newData = {
                    all: false,
                    selected: [...filtersValue?.selected, value],
                };
            } else {
                newData = {
                    all: false,
                    selected: filtersValue?.selected.filter(s => s !== value),
                };
                if (newData.selected.length === 0) {
                    newData.all = true;
                }
            }
        }
        console.log('setting new', newData)
        setFiltersValue(newData);
    };
    return (
        <Box>
            <Box style={containerStyle}>
                <Box style={styles.headerBar}>
                    <Box>
                        <Text
                            fontFamily={Fonts.bold}
                            fontWeight={700}
                            color={colors.primary}
                            fontSize={14}
                        >
                            {title}
                        </Text>
                    </Box>
                    <Pressable hitSlop={5} onPress={toggleExpand}>
                        <FontAwesome
                            name={!isExpanded ? "chevron-down" : "chevron-up"}
                            color={colors.primary}
                            size={14}
                        />
                    </Pressable>
                </Box>
                {isExpanded && (
                    <Box style={styles.chipGroup}>
                        <ChipX
                            key="all"
                            text="All"
                            selected={filtersValue?.all === true ? true : false}
                            onPress={() => onPressChip('All')}
                        />
                        {
                            data && data.map(s => {
                                const selected = filtersValue?.selected?.includes(s);
                                return (
                                    <ChipX
                                        key={s}
                                        text={s}
                                        selected={selected}
                                        onPress={() => onPressChip(s)}
                                    />
                                );
                            })
                        }

                    </Box>
                )}

            </Box>
            <Divider />
        </Box>
    );
};
export default ExpandableItem;

const styles = StyleSheet.create({
    headerBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    chipGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: 20,
    },
});
