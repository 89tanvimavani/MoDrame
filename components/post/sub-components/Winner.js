import React from 'react'
import { memo } from 'react';
import { View, StyleSheet, Image } from 'react-native'
import { BADGES } from '../../../constants/images';

const Winner = (props) => {
  return (
    <View style={styles.winner}>
      <Image 
        source={BADGES['big-winner']}
      />
    </View>
  )
}

function propsAreEqual(prevProps, nextProps) {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
}

export default memo(Winner, propsAreEqual)

const styles = StyleSheet.create({
  winner: {
    paddingTop: 16,
    zIndex: 100
  }
})