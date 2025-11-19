/* eslint-disable prettier/prettier */
import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import ItemCard from './ItemCard';
import { Divider } from 'native-base';

const FoodList = ({ data }) => {
    const renderItem = useCallback(({ item, index }) => (
        <ItemCard item={item} index={index} />
    ), []);

    const ItemSeparator = useCallback(() => {
        return (
            <Divider
                style={styles.divider}
            />
        );
    }, []);

    return (
        <View>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item, idx) => item.id + idx}
                ItemSeparatorComponent={ItemSeparator}
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 10 }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    divider: {
        marginVertical: 5,
        backgroundColor: 'transparent',
    },
});

export default FoodList;