import React, { memo } from 'react'
import {
  Pressable,
  StyleSheet,
  View,
  Image
} from 'react-native'
import colors from '../../constants/colors'
import Text from '../typography/Text'
import LottieView from 'lottie-react-native'
import { ICONS } from '../../constants/images'
import LinearGradient from 'react-native-linear-gradient'
import { Shadow } from 'react-native-shadow-2'

const Button = (props) => {
  if (props.loading) return <View>
    <LottieView 
      style={{ height: 50, width: 50}}
      source={require('../../animations/loading.json')} 
      autoPlay 
      loop
    />
  </View>

  return (
    <Pressable 
      style={[
        styles.wrapper,
        props.style,
        props.height && { height: props.height },
        props.disabled && styles.disabled,
        props.maxWidth && { maxWidth: props.maxWidth },
        props.center && { alignSelf: 'center' },
        props.borderColor && { 
          borderColor: props.borderColor,
          borderWidth: 1
        },
        props.borderRadius && { borderRadius: props.borderRadius },
        props.backgroundColor && { backgroundColor: props.backgroundColor }
      ]} 
      onPress={() => {
        if (!props.disabled) props.onPress()
        else props.onDisabledPress()
      }}
    > 
      <Shadow
        startColor={props.shadow ? colors.BLACK_OPACITY_2 : colors.TRANSPARENT} 
        finalColor={colors.TRANSPARENT} 
        offset={[1, 1]}>
        <LinearGradient
          start={{ x: 0.0, y: 0.5 }}
          end={{ x: 1.0, y: 0.5 }}
          locations={[0.30,0.7]}
          style={[
            styles.gradient,
            props.borderRadius && { borderRadius: props.borderRadius },
            props.onlyIconButton && {
              width: props.width,
              height: props.height
            }
          ]}
          colors={!props.backgroundColor ? 
            [colors.LIGHTNING_YELLOW, colors.GOLDEN_GRASS] : 
            [props.backgroundColor, props.backgroundColor]}
        >
          {props.icon && 
            <Image 
              source={props.icon} 
              style={[ {marginRight: 5}, props.iconStyle ]}/>
          }
          { !props.onlyIconButton && <Text 
            numberOfLines={1}
            style={[
              styles.text,
              {
                color: props.color ? props.color : colors.BLACK,
                fontWeight: props.fontWeight,
                fontSize: props.fontSize,
                width: props.width,
                textShadowColor: props.textShadow ? 'rgba(0, 0, 0, 0.30)' : 'rgba(0, 0, 0, 0.0)',
                textShadowOffset: {width: 1, height: 2},
                textShadowRadius: 3
              }
            ]}
          >{props.children}</Text>
          }
          {props.next &&
            <Image
              source={ICONS['upload']} 
              style={{
                transform: [{ rotate: "90deg" }], 
                marginLeft: 5,
                marginBottom: 2,
                height: 24,
                width: 24
              }}/>
          }
          {props.share &&
            <Image 
              source={ICONS['share-arrows']}
              style={{
                height: 23,
                width: 23
              }}/>
          }
        </LinearGradient>
      </Shadow>
    </Pressable>
  )
}

Button.defaultProps = {
  onDisabledPress: () => ({})
}

function propsAreEqual(prevProps, nextProps) {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
}

export default memo(Button, propsAreEqual)

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 32,
    height: 32,
    alignSelf: 'flex-start',
    zIndex: 10,
  },
  gradient: {
    height: "100%",
    display: 'flex',
    alignItems: 'center',
    borderRadius: 32,
    justifyContent: 'center',
    flexDirection: 'row',
    paddingLeft: 12,
    paddingRight: 12
  },
  text: {
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  next: {
    marginLeft: 8
  },
  disabled: {
    opacity: .1
  }
})