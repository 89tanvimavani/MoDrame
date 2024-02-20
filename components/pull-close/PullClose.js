import { useIsFocused } from '@react-navigation/native'
import React from 'react'
import { useEffect, useState, useRef } from 'react'
import {
  PanResponder,
  Animated
} from 'react-native'

const PullClose = (props) => {
  const [ closing, setClosing ] = useState(false)

  const isFocused = useIsFocused()

  useEffect(() => {
    if (isFocused) setClosing(false)
  }, [ isFocused ])

  const animatedOffsetY = useRef(new Animated.Value(0)).current

  const panResponder = useRef(
    PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!
        // gestureState.d{x,y} will be set to zero now
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}
        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
        animatedOffsetY.setValue(
          Math.abs(gestureState.dy)
        )
      },
      onPanResponderTerminationRequest: (evt, gestureState) =>
        true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
        if (Math.abs(gestureState.dy) > 100) return close()
        else return reset()

      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return false;
      }
    })
  ).current;

  function close() {
    if (!closing) props.onAction()
    setClosing(true)
  }

  function reset() {
    animatedOffsetY.setValue(0)
  }

  return (
    <Animated.View
      {...props.lock ? {} : panResponder.panHandlers}
      style={{ 
        flex: 1,
        transform: [{ 
          scale: animatedOffsetY.interpolate({
            inputRange: [ 0, 100, 5000 ],
            outputRange: [ 1, .9, 0 ],
          })
        }]
      }}
    >
      {props.children}
    </Animated.View>
  )
}

export default PullClose