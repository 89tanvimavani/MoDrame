import React from 'react'
import { KeyboardAvoidingView, ScrollView, Platform, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { HEIGHT } from '../../constants/mesures'

const KeyboardAvoidingScroll = (props) => {
  const insets = useSafeAreaInsets()
  const menu = props.menu ? 50 : 0
  const substract = insets.bottom + menu

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? "padding" : 'none'}
      style={styles.wrapper}
    >
      <ScrollView
        contentContainerStyle={{ minHeight: HEIGHT - substract }}
        alwaysBounceVertical={false}
        keyboardShouldPersistTaps="handled"
        scrollIndicatorInsets={{ right: 1 }}
      >
        {props.children}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default KeyboardAvoidingScroll

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  }
})