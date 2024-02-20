import React from 'react'
import { TouchableOpacity, StyleSheet, Image } from 'react-native'
import { ICONS } from '../../constants/images'
import { textStyles } from '../../styles-main/texts'
import Text from './Text'
import LottieView from 'lottie-react-native';

const Link = props => {
  return (
    <TouchableOpacity 
      activeOpacity={.8}
      onPress={() => {
        if (!props.disabled) return props.onPress()
        else props.onDisabledPress()
      }}
      style={[
        styles.default,
        props.height && { height: props.height },
        props.width && { width: props.width },
        props.center && { alignSelf: 'center' }
      ]}
    >
      {props.loading ?
        <LottieView 
          style={{ height: props.height, width: props.height}}
          source={require('../../animations/loading.json')} 
          autoPlay 
          loop
        />
      :
        <>
          <Text style={[
            textStyles.link,
            props.underline && {
              textDecorationLine: 'underline',
            },
            props.fontSize && {
              fontSize: props.fontSize
            },
            props.color && {
              color: props.color
            },
            props.disabled && styles.disabled,
            props.customStyle
          ]}>{props.children}</Text>
          { props.next &&
            <Image style={styles.next} source={ICONS.next}/> }
          { props.open &&
            <Image style={styles.next} source={ICONS.open}/> }
        </>
      }
    </TouchableOpacity>
  )
}

export default Link

Link.defaultProps = {
  onDisabledPress: () => ({}),
  customStyle: {}
}

const styles = StyleSheet.create({
  default: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 0
  },
  next: {
    marginLeft: 8
  },
  disabled: {
    opacity: .3
  }
})