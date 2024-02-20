import React from 'react'
import {
  Pressable,
  StyleSheet,
  Image
} from 'react-native'
import colors from '../../constants/colors'
import Text from '../typography/Text'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const TransparentButton = (props) => {
  const insets = useSafeAreaInsets()

  return (
    <Pressable 
      style={[
        styles.wrapper,
        props.onlyIconButton && { padding: 0 },
        props.width && { width: props.width },
        props.borderWidth && { borderWidth: 1 },
        props.borderColor && { borderColor: props.borderColor },
        props.borderRadius && { borderRadius: props.borderRadius },
        props.iconOnTheLeft && { paddingRight: 20 },
        props.absoluteRight && { 
          position: "absolute",
          top: 0,
          right: 0,
          zIndex: 20,
          padding: 20
        },
        props.screen && { marginTop: insets.top }
      ]} 
      onPress={() => {
        if (!props.disabled) props.onPress()
        else props.onDisabledPress()
      }}
    >
      {props.icon && 
        <Image 
          source={props.icon} 
          style={{ marginLeft: 16, marginRight: 16 }}/>
      }
      { !props.onlyIconButton ?
        <Text 
          numberOfLines={1}
          style=
          {[
            { color: props.color ? props.color : colors.WHITE },
            styles.text
          ]}
        >{props.children}</Text> : null }
    </Pressable>
  )
}

export default TransparentButton

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: null,
    padding: 10,
    fontSize: 15,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
    textTransform: 'uppercase'
  }
})