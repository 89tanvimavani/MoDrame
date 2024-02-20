import React from 'react'
import {
  StyleSheet,
  View,
  Pressable
} from 'react-native'
import colors from '../../constants/colors'
import Text from '../typography/Text'

const Radio = (props) => {
  return (
    <Pressable 
      onPress={props.onPress} 
      style={styles.row}>
      <View 
        style={[
          styles.dot,
          props.active && styles.active
        ]}
      />
      <Text style={styles.label}>{props.label}</Text>
    </Pressable>
  )
}

export default Radio

const styles = StyleSheet.create({
  dot: {
    height: 16,
    width: 16,
    borderWidth: 4,
    borderRadius: 32,
    borderColor: colors.WHITE,
    marginRight: 5,
    backgroundColor: colors.WHITE
  },
  active: {
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.WHITE
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row'
  }
})