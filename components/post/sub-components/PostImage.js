import React from 'react'
import { memo } from 'react';
import { StyleSheet, Image } from 'react-native'

const PostImage = (props) => {
  return (
    <Image
      source={{
        uri: props.poster
      }}
      style={styles.video}
    />
  )
}

function propsAreEqual(prevProps, nextProps) {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
}

export default memo(PostImage, propsAreEqual)

const styles = StyleSheet.create({
  video: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0
  }
})