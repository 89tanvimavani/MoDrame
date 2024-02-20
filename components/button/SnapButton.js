import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import colors from '../../constants/colors'

const SnapButton = (props) => {
  return (
    <Pressable 
      style={[
        styles.wrapper, 
        props.disabled && styles.disabled]} 
      onPress={() => {
        if (!props.disabled) props.onPress()
      }}
      disabled={props.disabled}
    >
      <View style={styles.inner}>
        {props.children}
      </View> 
    </Pressable>
  )
}

export default SnapButton

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(253, 58, 105, .4)',
    width: 78,
    height: 78,
    borderRadius: 156
  },
  disabled: {
    opacity: .5
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.LIGHTNING_YELLOW,
    width: 52,
    height: 52,
    borderRadius: 104
  }
})