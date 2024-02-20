import React from 'react'
import { ICONS } from '../../constants/images'
import {
  View,
  StyleSheet,
  Image
} from 'react-native'
import colors from '../../constants/colors'

const DoneCheck = (props) => {
  return (
    <View style={[
      props.positionStyle,
      styles.wrapper
    ]}>
      <Image source={ICONS['done-mini']}/>
    </View>
  )
}

export default DoneCheck

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 54,
    width: 54,
    backgroundColor: colors.WHITE,
    borderRadius: 108
  }
})