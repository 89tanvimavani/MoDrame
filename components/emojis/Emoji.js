import React, { useRef } from 'react'
import { View, StyleSheet, Image, Pressable, Platform, Animated } from 'react-native'
import colors from '../../constants/colors'
import Text from '../typography/Text'

const Emoji = props => {
  const selectedAnim = useRef(new Animated.Value(1)).current

  const animate = () => {
    if (props.channelReactions) return
    Animated.sequence([
      Animated.timing(selectedAnim, {
        toValue: 1.15,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(selectedAnim, {
        toValue: 0.85,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(selectedAnim, {
        toValue: 1.05,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(selectedAnim, {
        toValue: 0.95,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(selectedAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start()
  }

  function onPress() {
    animate()
    props.onPress()
  }

  return (
      <Pressable 
        style={[
          !props.channelReactions && { marginTop: 12 },
          {
            left: props.left,
            position: props.left ? 'absolute' : 'relative'
          }
        ]} 
        onPress={onPress}>
        { props.counter > 0 &&
            <View style={styles.counter}>
              <Text style={[
                styles.label,
                Platform.OS === 'ios' && { marginTop: 2 }
                ]}>{props.counter}</Text>
            </View>
        }
        <View 
          style={
            props.active && styles.active,
            { borderRadius: 50}
          }>
          
            <Animated.View 
              style={[styles.shadow, { transform: [{ scale: selectedAnim }] }]}>
              <Image 
                style={
                  props.active && styles.active,
                  { borderRadius: 50}
                } 
                source={props.source} 
              />
            </Animated.View>
      
        </View>
      </Pressable>
  )
}

export default Emoji

const styles = StyleSheet.create({
  active: {
    transform: [{ scale: 1.15 }]
  },
  label: {
    fontSize: 9,
    color: colors.BLACK
  },
  shadow: {
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5
  },
  counter: {
    backgroundColor: colors.WHITE,
    minWidth: 12,
    minHeight: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    position: 'absolute',
    zIndex: 10,
    right: -4,
    top: -4,
    paddingLeft: 3,
    paddingRight: 3
  }
})