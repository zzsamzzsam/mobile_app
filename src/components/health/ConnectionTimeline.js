import React from 'react';
import {View, Text, FlatList, ScrollView} from 'react-native';
import {StyleSheet} from 'react-native';
function ConnectionTimeline({data, direction, customStyle = {}} = {}) {
  const {
    container = {},
    leftColumn = {},
    rightColumn = {},
    dotContainer = {},
    dot = {},
    connector = {},
    dotConnectorHorizontalWrapper = {},
    containerHorizontal = {},
    dotContainerHorizontal = {},
    dotHorizontal = {},
    connectorHorizontal = {},
    textStyle = {},
  } = customStyle;

  const renderItem = ({item, index}) => {
    let lastIndex = index === data.length - 1;

    return (
      <View key={index} style={[styles.container, container]}>
        <View style={[styles.leftColumn, leftColumn]}>
          <View style={[styles.dotContainer, dotContainer]}>
            <View style={[styles.dot, dot]} />
          </View>
          {!lastIndex && <View style={[styles.connector, connector]} />}
        </View>
        <View style={[styles.rightColumn, rightColumn]}>
          <Text style={[styles.txtStatus, textStyle.txtStatus]}>
            {item?.status}
          </Text>
          <Text style={[styles.txtDate, textStyle.txtDate]}>{item?.date}</Text>
        </View>
      </View>
    );
  };

  if (direction == 'horizontal') {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            height: 100,
          }}>
          {data.map((item, index) => {
            let lastIndex = index === data.length - 1;

            return (
              <View
                key={index}
                style={[styles.containerHorizontal, containerHorizontal]}>
                <View
                  style={[
                    styles.dotConnectorHorizontalWrapper,
                    dotConnectorHorizontalWrapper,
                  ]}>
                  <View
                    style={[
                      styles.dotContainerHorizontal,
                      dotContainerHorizontal,
                    ]}>
                    <View style={[styles.dotHorizontal, dotHorizontal]} />
                  </View>
                  {!lastIndex && (
                    <View
                      style={[styles.connectorHorizontal, connectorHorizontal]}
                    />
                  )}
                </View>
                <View style={customStyle.containerHorizontalText}>
                  <Text style={[styles.txtStatus, textStyle.txtStatus]}>
                    {item?.status}
                  </Text>
                  <Text style={[styles.txtDate, textStyle.txtDate]}>
                    {item?.date}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    );
  } else {
    return <FlatList data={data} renderItem={renderItem} />;
  }
}

export default ConnectionTimeline;
export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    paddingHorizontal: 10,
  },
  leftColumn: {
    zIndex: 999,
    position: 'relative',
    top: 15,
    alignItems: 'center',
    marginRight: 10,
  },
  rightColumn: {},
  connector: {
    height: 40,
    width: 2,
    backgroundColor: 'gray',
  },
  dotContainer: {
    backgroundColor: '#D9F3FD',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: 18,
    height: 18,
  },
  dot: {
    backgroundColor: '#408E91',
    borderRadius: 50,
    width: 10,
    height: 10,
  },
  txtStatus: {
    color: '#000000',
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  txtDate: {
    color: '#000000',
    fontSize: 14,
  },

  containerHorizontal: {
    flex: 1,
    width: 100,
  },
  connectorHorizontal: {
    flex: 1,
    height: 2,
    backgroundColor: 'gray',
  },
  dotContainerHorizontal: {
    backgroundColor: '#D9F3FD',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
  },
  dotHorizontal: {
    backgroundColor: '#FFD966',
    borderRadius: 50,
    width: 10,
    height: 10,
  },
  dotConnectorHorizontalWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
});
