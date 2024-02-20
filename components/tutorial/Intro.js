import React from 'react'
import {
  View, 
  StyleSheet
} from 'react-native'
import colors from '../../constants/colors'
import Text from '../typography/Text'
import LottieView from 'lottie-react-native'

const Intro = props => {
  return (
    <View style={styles.wrapper}>
      <View>
        <LottieView 
          style={styles.lottie}
          source={require('../../animations/scroll.json')} 
          autoPlay 
          loop
        />
        <Text style={styles.text}>
          List through participants and <Text style={styles.white}>vote by reacting.</Text>
        </Text>  
        <Text style={styles.info}>
          Scoll up and down
        </Text>
      </View>
    </View>
  )
}

export default Intro

const styles = StyleSheet.create({
  wrapper: {
    paddingLeft: 28,
    paddingRight: 28,
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  text: {
    color: colors.BRIGHT_SUN,
    fontSize: 22,
    fontWeight: '600',
    marginTop: 20
  },
  white: {
    color: colors.WHITE
  },
  info: {
    color: colors.WHITE,
    fontSize: 16,
    marginTop: 5
  },
  lottie: { 
    height: 70, 
    width: 10
  }
})