import React from 'react'
import Text from '../typography/Text'
import { StyleSheet, View } from 'react-native'
import colors from '../../constants/colors'
import { WIDTH } from '../../constants/mesures'

const Error = (props) => {
  return (
    <View style={[
      styles.toast
    ]}>
      <View style={styles.inner}>
        {props.text1 && 
          <Text style={styles.text1}>{props.text1}</Text> }
        {props.text2 && 
          <Text style={styles.text2}>{props.text2}</Text> }
      </View>
    </View>
  )
}

export default Error

const styles = StyleSheet.create({
  toast: {
    backgroundColor: 'transparent',
    width: WIDTH,
    padding: 16
  },
  text1: {
    color: colors.WHITE,
    fontSize: 17,
    fontWeight: 'bold'
  },
  text2: {
    color: colors.WHITE,
    fontSize: 12
  },
  inner: {
    width: WIDTH - 32,
    backgroundColor: colors.LIGHTNING_YELLOW,
    borderRadius: 8,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 10,
    paddingBottom: 10,
    display: 'flex',
    minHeight: 50,
    justifyContent: 'center'
  }
})