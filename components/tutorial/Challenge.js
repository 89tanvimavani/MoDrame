import React from 'react'
import {
  View, 
  StyleSheet
} from 'react-native'
import colors from '../../constants/colors'
import Text from '../typography/Text'
import LottieView from 'lottie-react-native'
import { HEIGHT } from '../../constants/mesures'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const Challenge = props => {
  const insets = useSafeAreaInsets()

  return (
    <View style={[ 
        styles.wrapper, 
        { paddingTop: insets.top}
      ]}>
      <View>
        <View style={styles.half}>
          <Text style={styles.title}>1. View challenge instructions.</Text>
          <Text style={styles.info}>Tap the play button.</Text>
          <View style={styles.animationWrapper}>
            <LottieView 
              style={styles.lottie}
              source={require('../../animations/tap.json')} 
              autoPlay 
              loop
            />
          </View>
        </View>
        <View style={[
            styles.half, 
            styles.bottom, 
            { paddingBottom: insets.bottom }
          ]}>
          <Text style={styles.title}>2. Upload up to 60s video, participate and win prizes!</Text>
          <Text style={styles.info}>Tap the upload button.</Text>
          <View style={styles.animationWrapper}>
            <LottieView 
              style={styles.lottie}
              source={require('../../animations/tap.json')} 
              autoPlay 
              loop
            />
          </View>
        </View>
      </View>
    </View>
  )
}

export default Challenge

const styles = StyleSheet.create({
  wrapper: {
    paddingLeft: 32,
    paddingRight: 32,
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  text: {
    color: colors.WHITE
  },
  half: {
    height: HEIGHT/2,
    flex: 1,
    marginTop: 20
  },
  title: {
    color: colors.BRIGHT_SUN,
    fontWeight: 'bold',
    fontSize: 22
  },
  info: {
    color: colors.WHITE,
    fontSize: 13,
    marginTop: 5
  },
  animationWrapper: {
    alignSelf: 'center',
    marginTop: 20,
    paddingBottom: 40
  },
  bottom: {
    justifyContent: 'flex-end'
  },
  lottie: { 
    height: 50, 
    width: 50
  }
})