import React from 'react'
import { KeyboardAvoidingView as KAV, StyleSheet, Platform} from 'react-native'

const KeyboardAvoidingView = (props) => {
  return (
    <KAV
      behavior={Platform.OS === 'ios' ? "padding" : 'none'}
      style={styles.wrapper}
    >
      {props.children}
    </KAV>
  )
}

export default KeyboardAvoidingView

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  }
})