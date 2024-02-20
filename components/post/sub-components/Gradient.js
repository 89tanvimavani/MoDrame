import React, { memo } from 'react'
import { StyleSheet } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

const Gradient = (props) => {
  return (
    <LinearGradient 
      style={{...styles.gradient, height: props.height}}
      colors={['rgba(0, 0, 0, 0)',  'rgba(0, 0, 0, .99)']}
    />
  )
}

function propsAreEqual(prevProps, nextProps) {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
}

export default memo(Gradient, propsAreEqual)

const styles = StyleSheet.create({
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  }
})