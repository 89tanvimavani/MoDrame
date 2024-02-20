import React from 'react'
import {
  View,
  StyleSheet,
  Image,
  Pressable
} from 'react-native'
import Text from '../components/typography/Text'
import Link from '../components/typography/Link'
import { BACKGROUND, BRAND, ICONS } from '../constants/images'
import colors from '../constants/colors'
import { HEIGHT, WIDTH } from '../constants/mesures'

const Welcome = (props) => {
  function register() {
    props.navigation.navigate('Register')
  }

  function login() {
    props.navigation.navigate('Login')
  }

  return (
    <View style={styles.wrapper}>
      <Image 
        style={styles.background} 
        source={BACKGROUND['background']}/>
      <View style={styles.head}>
        <Image 
          source={BRAND.versuz} 
          style={styles.image}
        />
      </View>
      <View style={styles.bottom}>
        <Pressable 
          style={styles.register}
          onPress={() => register()}
        >
          <Text style={styles.registerText}>Register</Text>
          <Image source={ICONS['next-big']} />
        </Pressable>
        <View>
          <Link
            onPress={() => login()}
            underline
          >Log in</Link>
        </View>
      </View>
    </View>
  )
}

export default Welcome

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'relative'
  },
  image: {
    height: 120, 
    width: 210
  },
  head: {
    flex: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bottom: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  register: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30
  },
  registerText: {
    fontSize: 39,
    fontWeight: 'bold',
    marginRight: 12,
    color: colors.CANDLELIGHT,
    textDecorationLine: 'underline'
  },
  background: {
    position: 'absolute',
    left: 0,
    height: HEIGHT,
    width: WIDTH
  }
})