import React, { memo, useEffect, useRef, useState } from 'react'
import { StyleSheet, Pressable, Animated } from 'react-native'
import colors from '../../../constants/colors';
import Text from '../../typography/Text';
import LinearGradient from 'react-native-linear-gradient'

const ChallengeButton = (props) => {
  const selectedAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (props.animate) animate()
  }, [props.animate])

  const animate = () => {
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

  return (
    <Animated.View 
      style={[{transform: [{ scale: selectedAnim }]}]}>
      <Pressable
        onPress={props.onPress}
        style={styles.wrapper}
      >
        <LinearGradient
            start={{ x: 0.0, y: 0.5 }}
            end={{ x: 1.0, y: 0.5 }}
            locations={[0.4 ,0.9]}
            style={styles.gradient}
            colors={[colors.LIGHTNING_YELLOW, colors.GOLDEN_GRASS]}
          >
          <Text style={styles.buttonText}>PARTICIPATE</Text>
          <Text style={styles.infoText}>{"& WIN PRIZES"}</Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  )
}

function propsAreEqual(prevProps, nextProps) {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
}

export default memo(ChallengeButton, propsAreEqual)

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 23
  },
  gradient: {
    height: 46,
    backgroundColor: colors.LIGHTNING_YELLOW,
    borderRadius: 23,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 16,
    paddingRight: 16
  },
  buttonText: {
    color: colors.BLACK,
    fontSize: 13,
    lineHeight: 15,
    fontWeight: 'bold'
  },
  infoText: {
    fontSize: 9,
    color: colors.BLACK,
    paddingTop: 2
  }
})