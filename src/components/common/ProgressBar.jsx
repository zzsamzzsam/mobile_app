import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import colors from '../../themes/Colors';
import AppText from './Text';

const ProgressBar = ({totalSlots, filledSlots, Label}) => {
  // Calculate the progress ratio (filled slots / total slots)
  const progress = filledSlots / totalSlots;

  return (
    <View style={styles.container}>
      <AppText color={colors.primary} bold fontSize={14} style={styles.text}>
        {Label} {filledSlots} / {totalSlots}
      </AppText>

      <View style={styles.progressBarBackground}>
        <View
          style={[
            styles.progressBarFill,
            {width: `${(progress * 100).toFixed(2)}%`}, // Set width dynamically based on progress
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  progressBarBackground: {
    height: 20,
    width: '80%',
    backgroundColor: colors.gray,
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
});

export default ProgressBar;
