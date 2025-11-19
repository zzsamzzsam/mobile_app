/* eslint-disable prettier/prettier */
import { Box, Divider } from 'native-base';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { RefreshControl } from 'react-native-gesture-handler';
import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import HomeNotification from '../../components/screens/HomeNotification';
import metrics from '../../themes/Metrics';
import { useMutation, useQuery } from '@apollo/client';
import { GET_NOTIFICATIONS } from '../../Apollo/Queries';
import colors from '../../themes/Colors';
import LoadingCircle from '../../components/LoadingCircle';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { SwipeListView } from 'react-native-swipe-list-view';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { DELETE_NOTIFICATION } from '../../Apollo/Mutations';
import { showMessage } from 'react-native-flash-message';

const RenderHiddenItemWithActions = (props) => {
  const { onDelete } = props;
  return (
    <Box style={styles.rowBack}>
      <TouchableOpacity
        onPress={onDelete}
      >
        <MaterialIcon name="delete" size={30} color={colors.danger} />
      </TouchableOpacity>
    </Box>
  );
};

const PAGE_LIMIT = 90;
const NoticeScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [limitToShow, setLimitToShow] = useState(15);
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);

  const { refetchNotification } = useStoreState(st => ({
    refetchNotification: st.app.refetchNotification,
  }));
  const { setRefetchNotification } = useStoreActions(action => ({
    setRefetchNotification: action.app.setRefetchNotification,
  }));
  const [deleteNotificationMutation] = useMutation(DELETE_NOTIFICATION);

  const { data: notifications, loading, refetch } = useQuery(GET_NOTIFICATIONS, {
    variables: {
      limit: PAGE_LIMIT,
      page: page,
    },
  });

  const [listData, setListData] = useState(notifications?.myNotifications?.items.map((s, idx) => ({
    key: `${idx}`,
    title: s?.title,
    description: s?.description,
    date: s?.date,
    resource: s?.resource,
    isRead: s?.isRead,
    resource_id: s?.resource_id,
    _id: s?._id,
  }) || []));

  useEffect(() => {
    setListData(notifications?.myNotifications?.items);
  }, [notifications?.myNotifications?.items]);

  useEffect(() => {
    refetch();
  }, [refetchNotification, refetch]);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await refetch();
      setRefreshing(false)
    } catch (err) {
      console.log("err", err);
    }
  };

  const onEndReached = async () => {
    if (!notifications?.myNotifications?.items) return;
    if (notifications?.myNotifications?.total > limitToShow) {
      setShowLoadingIndicator(true);
      setTimeout(() => {
        setLimitToShow(prev => prev + 10);
        setShowLoadingIndicator(false);
      }, 2000);
    }
  };

  const _listFooterComp = useCallback(() => {
    return (
      <Box style={styles.flatlistFooter}>
        <ActivityIndicator size={24} color={colors.secondary} />
      </Box>
    );
  }, []);
  const _renderItem = (rowData, rowMap) => {
    return (
      <HomeNotification singleNotice={rowData?.item} index={rowData?.index} />
    );
  };
  const closeRow = (rowMap, rowKey) => {
    rowMap[`undefined-${rowKey}`].closeRow();
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };
  const deleteRow = async (rowMap, rowData, rowKey) => {
    try {
      await deleteNotificationMutation({
        variables: {
          _id: rowData?.item?._id,
        },
        onCompleted: () => { // notification was not being refetched
          refetch();
        },
        refetchQueries: [{ query: GET_NOTIFICATIONS }],
      });
    } catch (err) {
      console.log(err)
      showMessage({
        message: "Error",
        description: 'Unable to Delete message',
        type: 'danger',
        icon: 'danger',
      });
    }
    closeRow(rowMap, rowKey);
    setRefetchNotification();
    const newData = [...listData];
    const prevIndex = listData.findIndex(item => item?.key === rowKey);
    newData.splice(prevIndex, 1);
    setListData(newData);
  }
  const renderHiddenItem = (rowData, rowMap) => {
    return (
      <RenderHiddenItemWithActions
        data={rowData}
        rowMap={rowMap}
        onDelete={() => deleteRow(rowMap, rowData, rowData?.item?.key)}
      />
    );
  };

  const _itemSeperatorComp = useCallback(() => {
    return <Divider style={{ marginVertical: 5, backgroundColor: 'transparent' }} />;
  }, []);

  return (
    <Box style={styles.container}>
      {
        loading ? (<LoadingCircle />) : (
          <SwipeListView
            data={listData?.slice(0, limitToShow)}
            renderItem={_renderItem}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderHiddenItem={renderHiddenItem}
            contentContainerStyle={{ paddingHorizontal: 20, paddingTop: metrics.s10, paddingBottom: !showLoadingIndicator ? 10 : 0 }}
            ItemSeparatorComponent={_itemSeperatorComp}
            onEndReachedThreshold={0.2}
            onEndReached={onEndReached}
            keyExtractor={(item, idx) => `${item.itemId}-${idx}`}
            leftOpenValue={75}
            rightOpenValue={-75}
            disableRightSwipe={true}
            ListFooterComponent={showLoadingIndicator && _listFooterComp}
          />
        )
      }
    </Box>
  );
};

export default NoticeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  flatlistFooter: {
    paddingVertical: metrics.s5,
  },
  rowBack: {
    flex: 1,
    height: '100%',
    paddingRight: 25,
    justifyContent: 'center',
    alignItems: 'flex-end'
  }
});
