import React from 'react'
import {
  View,
  StyleSheet,
  Image,
  Linking,
  Platform,
} from 'react-native'
import {
  inject, observer
} from 'mobx-react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Button from '../components/button/Button'
import Text from '../components/typography/Text'
import { BACKGROUND } from '../constants/images'
import colors from '../constants/colors'
import { HEIGHT, WIDTH } from '../constants/mesures'

const LINK = 'https://itunes.apple.com/app/1566137338'
const LINK_ANDROID = 'market://details?id=com.app.modrama'

const UpdateApp = (props) => {

  function onPress() {
    let link = Platform.OS === 'ios' ? LINK : LINK_ANDROID
    Linking.canOpenURL(link).then(supported => {
      supported && Linking.openURL(link)
    });
  }

  return (
    <View style={styles.wrapper}>
      <Image 
        style={styles.background} 
        source={BACKGROUND['background']}/>
      <View style={styles.head}>
        <Text style={styles.title}>
          Your app is out of fashion
        </Text>
        <Text style={styles.text}>
          Please update the app
        </Text>
      </View>
      <View style={styles.bottom}>
        <Button
          width={185}
          height={50}
          center={true}
          onPress={onPress}>
          Go to the app store
        </Button>
      </View>
    </View>
  )
}

export default inject('store')(observer(UpdateApp))

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'relative'
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
  background: {
    position: 'absolute',
    left: 0,
    height: HEIGHT,
    width: WIDTH
  },
  title: {
    fontSize: 28,
    color: colors.WHITE,
    fontWeight: 'bold',
    paddingBottom: 24
  },
  text: {
    color: colors.WHITE,
    fontWeight: 'bold',
    paddingBottom: 24,
    fontSize: 14
  }
})