import React from 'react'
import {
  StyleSheet,
  Pressable
} from 'react-native'
import { HEIGHT, WIDTH } from '../../constants/mesures'
import { TUTORIAL_SCREEN } from '../../constants/types'
import Intro from './Intro'
import HomeChallenge from './HomeChallenge'
import Challenge from './Challenge'

const Tutorial = (props) => {
  function renderScreen() {
    if (props.screen === TUTORIAL_SCREEN.INTRO)
      return <Intro />
    if (props.screen === TUTORIAL_SCREEN.HOME_CHALLENGE)
      return <HomeChallenge />
    if (props.screen === TUTORIAL_SCREEN.CHALLENGE_SCREEN)
      return <Challenge />
  }

  return (
    <Pressable onPress={props.dismiss} style={styles.wrapper}>
      { renderScreen() }
    </Pressable>
  )
}

export default Tutorial

const styles = StyleSheet.create({
  wrapper: {
    height: HEIGHT,
    width: WIDTH,
    position: 'absolute',
    zIndex: 1000,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, .63)'
  }
})