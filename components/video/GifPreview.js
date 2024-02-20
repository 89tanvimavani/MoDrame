import React from 'react'
import { 
  StyleSheet,
  Pressable,
  View
} from 'react-native'
import FastImage from 'react-native-fast-image'
import colors from '../../constants/colors'
import Play from '../../assets/svg/Play'

const GifPreview = (props) => {
  return (
    <Pressable 
      style={[
        styles.wrapper,
        props.modal && styles.modal
      ]}
      onPress={props.onPlay}
    >
      <FastImage 
        source={{ uri: props.gif }}
        style={styles.gif}
      />
      {!props.noIcon && 
        <View style={styles.play}>
          <Play/>
        </View>
      }
    </Pressable>
  )
}

export default GifPreview

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: 260,
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.EMPEROR
  },
  gif: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  play: {
    height: 54,
    width: 54,
    borderRadius: 108,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modal: { 
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  }
})