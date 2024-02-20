import React from 'react'
import Modal from '../modal/Modal'
import {
  View, StyleSheet
} from 'react-native'
import { HEIGHT, WIDTH } from '../../constants/mesures'
import FastImage from 'react-native-fast-image'
import { ResizeMode, Video } from 'expo-av'

const VideoPlayer = (props) => {
  return (
    <Modal
      noMargin
      open={props.open}
      onRequestClose={props.onRequestClose}
    >
      <View style={styles.wrapper}>
        <FastImage 
          source={{ uri: props.thumbnail }}
          style={styles.background}
        />
          <Video 
            style={styles.video}
            source={{ uri: props.src }}
            shouldPlay={true}
            isLooping={props.looping}
            resizeMode={ResizeMode.COVER}
            useNativeControls={false}
            ignoreSilentSwitch={"ignore"}
          />
      </View>
    </Modal>
  )
}

export default VideoPlayer

const styles = StyleSheet.create({
  wrapper: {
    width: WIDTH,
    height: HEIGHT
  },
  video: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0
  }
})