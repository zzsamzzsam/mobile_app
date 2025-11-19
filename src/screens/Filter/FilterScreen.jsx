/* eslint-disable prettier/prettier */
import { StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Box, Divider, Pressable, ScrollView, Text } from 'native-base';
import Fonts from '../../themes/Fonts';
import colors from '../../themes/Colors';
import FontAwesomeIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ExpandableItem from '../../components/common/ExpandableList';
import ButtonX from '../../components/common/BottonX';
import metrics from '../../themes/Metrics';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { useNavigation } from '@react-navigation/native';
import { TrackingEventTypes, initialScheduleFilters } from '../../constant';
import { useMutation } from '@apollo/client';
import { UPDATE_ACTIVITIES } from '../../Apollo/Mutations/User';
import { GET_ME_USER } from '../../Apollo/Queries';
import LoadingModal from '../../components/common/LoadingModal';
import { trackUserEvent } from '../../utils';

const activities = [
    "Swimming",
    "Walking",
    'Archery',
    "Aquafit",
    'Cricket',
    "Fitness",
    "Climbing",
    "Badminton",
    "Soccer",
    "Arts",
    "Cycling",
    "Volleyball",
    "Badminton/Table Tennis",
    "Table Tennis",
    "Yoga",
    "Martial Arts",
    "Family",
    "Basketball",
    "Dance",
    "Guitar",
    'Performing Arts',
    "Pickleball",
    'Ultimate Frisbee',
    'Ball/Floor Hocke'
]
const programs = [
    "Drop-in",
    "Group Fitness Class",
    "Instructional Class",
    "Clubs",
    "Sports & Recreation"
]
const audiences = [
    'City of Toronto',
    'Toronto Pan Am Sports Centre Member',
    'U of T Scarborough',
];


const FilterScreen = ({ navigation }) => {
    let totalFilterCount = 0;
    const [loading, setLoading] = useState(false);
    const [clearLoading, setClearLoading] = useState(false);

    const [filterActivities, setFilterActivities] = useState({
        all: true,
        selected: [],
    });
    const [filterPrograms, setFilterPrograms] = useState({
        all: true,
        selected: [],
    });
    const [filterAudiences, setFilterAudiences] = useState({
        all: true,
        selected: [],
    });
    const [filterLocations, setFilterLocations] = useState({
        all: true,
        selected: [],
    });
    const [filterTrainers, setFilterTrainers] = useState({
        all: true,
        selected: [],
    });
    const { scheduleFilters, actualUser } = useStoreState(state => ({
        scheduleFilters: state.schedule.scheduleFilters,
        actualUser: state.login.actualUser,
    }));
    const { setScheduleFilters, setShowAllowedScheduleByBarcode } = useStoreActions(action => ({
        setScheduleFilters: action.schedule.setScheduleFilters,
        setShowAllowedScheduleByBarcode: action.schedule.setShowAllowedScheduleByBarcode
    }));

    useEffect(() => {
        setFilterActivities({
            all: scheduleFilters?.activities?.all ? true : false,
            selected: scheduleFilters?.activities?.selected,
        });
        setFilterPrograms({
            all: scheduleFilters?.programs?.all ? true : false,
            selected: scheduleFilters?.programs?.selected,
        });
        setFilterAudiences({
            all: scheduleFilters?.audiences?.all ? true : false,
            selected: scheduleFilters?.audiences?.selected,
        });
        setFilterLocations({
            all: scheduleFilters?.locations?.all ? true : false,
            selected: scheduleFilters?.locations?.selected,
        });
        setFilterTrainers({
            all: scheduleFilters?.trainers?.all ? true : false,
            selected: scheduleFilters?.trainers?.selected,
        });
    }, [scheduleFilters]);


    const onClearFilters = async () => {
        try {
            setClearLoading(true)
            setFilterActivities({
                all: true,
                selected: [],
            });
            setFilterPrograms({
                all: true,
                selected: [],
            });
            setFilterAudiences({
                all: true,
                selected: [],
            });
            setFilterLocations({
                all: true,
                selected: [],
            });
            setFilterTrainers({
                all: true,
                selected: [],
            });
            setScheduleFilters(initialScheduleFilters);
            setClearLoading(false)
        } catch (err) {
            setClearLoading(false)
            console.log(err.toString())
        }
    };
    const onApplyFilters = async () => {
        setLoading(true);
        try {
            setScheduleFilters({
                activities: filterActivities,
                programs: filterPrograms,
                audiences: filterAudiences,
                locations: filterLocations,
                trainers: filterTrainers,
            });
            trackUserEvent(TrackingEventTypes.filter_changed, {
                activities: filterActivities,
                programs: filterPrograms,
                audiences: filterAudiences,
                locations: filterLocations,
                trainers: filterTrainers,
            });
            setTimeout(() => {
                setLoading(false);
                navigation.goBack();
            }, 2000);
        } catch (err) {
            setLoading(false);
            console.log("error", err.toString());
        }
    };
    return (
        <Box style={styles.container}>
            <Box>
                <Box style={styles.headerBox}>
                    <Text
                        fontFamily={Fonts.bold}
                        color={colors.primary}
                        fontSize={16}
                    >
                        {`Filters`}
                    </Text>
                    <Pressable
                        onPress={() => navigation.goBack()}
                        hitSlop={5}
                    >
                        <FontAwesomeIcon
                            size={30}
                            color={colors.primary}
                            name="close-thick"
                        />
                    </Pressable>
                </Box>
                <Divider style={{ backgroundColor: colors.gray, height: 2 }} />
            </Box>
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <ExpandableItem
                    title={`Activities(${filterActivities?.selected?.length})`}
                    data={activities}
                    containerStyle={{ marginHorizontal: 20, paddingVertical: 15 }}
                    filtersValue={filterActivities}
                    setFiltersValue={setFilterActivities}
                />
                <ExpandableItem
                    title={`Programs(${filterPrograms?.selected?.length})`}
                    data={programs}
                    containerStyle={{ marginHorizontal: 20, paddingVertical: 15 }}
                    filtersValue={filterPrograms}
                    setFiltersValue={setFilterPrograms}
                />
                <ExpandableItem
                    title={`Access(${filterAudiences?.selected?.length})`}
                    data={audiences}
                    containerStyle={{ marginHorizontal: 20, paddingVertical: 15 }}
                    filtersValue={filterAudiences}
                    setFiltersValue={setFilterAudiences}
                />
                {/* <ExpandableItem
                    title={`Locations(${filterLocations?.selected?.length})`}
                    data={programs}
                    containerStyle={{ marginHorizontal: 20, paddingVertical: 15 }}
                    filtersValue={filterLocations}
                    setFiltersValue={setFilterLocations}
                /> */}
                {/* <ExpandableItem
                    title={`Trainer(${filterTrainers?.selected?.length})`}
                    data={programs}
                    containerStyle={{ marginHorizontal: 20, paddingVertical: 15 }}
                    filtersValue={filterTrainers}
                    setFiltersValue={setFilterTrainers}
                />  */}
            </ScrollView>
            <Box style={{ paddingHorizontal: metrics.s20, paddingVertical: metrics.s10, backgroundColor: colors.homeBg }}>
                {/* <ButtonX
                    // isLoading={loading}
                    // isLoadingText="Applying"
                    title="Show Schedule Allowed By My Barcode"
                    onPress={() => {
                        setShowAllowedScheduleByBarcode(true);
                        navigation.goBack();
                    }}
                    style={{ marginBottom: 10 }}
                /> */}
                <Box style={styles.groupButton}>

                    <ButtonX
                        isLoading={clearLoading}
                        isLoadingText="Clearing"
                        title="Clear Filters"
                        textColor={colors.primary}
                        onPress={onClearFilters}
                        variant='outline'
                        style={{ backgroundColor: colors.white, color: colors.danger, borderColor: colors.primary }}
                    />
                    <ButtonX
                        isLoading={loading}
                        isLoadingText="Applying"
                        title="Apply Filters"
                        onPress={onApplyFilters}
                    />
                </Box>
            </Box>
        </Box>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between'
    },
    headerBox: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    groupButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
})

export default FilterScreen;
