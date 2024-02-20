import { ResizeMode, Video } from 'expo-av'
import React from 'react'
import {
  StyleSheet,
  Pressable
} from 'react-native'

const VideoPreview = (props) => {
  if (!props.src || props.hide) return null
  return (
    <Pressable
      style={styles.wrapper} 
      onPress={props.onPlay}
    >
      <Video 
        style={styles.video}
        source={{ uri: props.src }}
        shouldPlay={true}
        resizeMode={ResizeMode.COVER}
        isLooping={true}
        isMuted={true}
      />
    </Pressable>
  )
}

export default VideoPreview

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  video: {
    width: "100%",
    height: "100%"
  }
})