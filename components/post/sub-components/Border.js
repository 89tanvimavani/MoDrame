import React, { memo } from 'react'
import { StyleSheet } from 'react-native'
import { Image } from 'react-native';

const Border = (props) => {
  return <>
          <Image 
            style={styles.topBorder}
            resizeMode='stretch'
            source={{ uri: props.topBorder}}/>
          <Image 
            style={styles.bottomBorder}
            resizeMode='stretch'
            source={{ uri: props.bottomBorder}}/>
        </>
}

function propsAreEqual(prevProps, nextProps) {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
}

export default memo(Border, propsAreEqual)

const styles = StyleSheet.create({

  topBorder: {
    width: '66%',
    aspectRatio: 0.55,
    position: 'absolute',
    top: 0,
    left: 0
  },
  bottomBorder: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: '66%',
    aspectRatio: 0.55
  }
})