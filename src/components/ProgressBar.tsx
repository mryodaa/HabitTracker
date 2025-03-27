import React from 'react';
import {View, StyleSheet} from 'react-native';

interface Props {
  progress: number;
}

const ProgressBar = ({progress}: Props) => {
  return (
    <View style={styles.container}>
      <View style={[styles.bar, {width: `${progress * 100}%`}]} />
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({
  container: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    backgroundColor: '#4caf50',
  },
});
