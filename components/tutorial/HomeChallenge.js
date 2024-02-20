import React from 'react'
import {
  View, 
  StyleSheet
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import colors from '../../constants/colors'
import Text from '../typography/Text'
import LottieView from 'lottie-react-native'

const HomeChallenge = props => {
  const insets = useSafeAreaInsets()

  return (
    <View style={[
      styles.wrapper,
      { paddingTop: insets.top }
    ]}>
      <LottieView 
        style={{ height: 50, width: 50}}
        source={require('../../animations/tap.json')} 
        autoPlay 
        loop
      />
      <Text style={styles.text}>
        Participate in challenges and <Text style={styles.white}>earn amazing prizes.</Text>
      </Text>
      <Text style={styles.info}>
        Tap the button
      </Text>
    </View>
  )
}

export default HomeChallenge

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingLeft: 32,
    paddingRight: 22,
    marginTop: 10
  },
  text: {
    color: colors.BRIGHT_SUN,
    fontSize: 22,
    fontWeight: '600',
    marginTop: 20,
    textAlign: 'right'
  },
  white: {
    color: colors.WHITE
  },
  info: {
    color: colors.WHITE,
    fontSize: 16,
    marginTop: 5
  }
})