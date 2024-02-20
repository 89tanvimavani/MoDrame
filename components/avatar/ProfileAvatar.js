import React, { useState } from 'react'
import FastImage from 'react-native-fast-image'
import {
  StyleSheet, Image, View
} from 'react-native'
import colors from '../../constants/colors'
import { ICONS } from '../../constants/images'
import LinearGradient from 'react-native-linear-gradient'
import AnimatedLinearGradient from 'react-native-animated-linear-gradient'

const ProfileAvatar = (props) => {
  const [ loaded, setLoaded ] = useState(false)

  return (
    <LinearGradient 
      colors={['#f07223', '#f2c240']} 
      style={styles.linearWrapper}
      useAngle={true} angle={80} angleCenter={{x:0.1,y:0.1}}> 
      <View style={styles.wrapper}>
        <FastImage 
          source={{ uri: props.src }}
          style={styles.image}
          onLoadEnd={() => setLoaded(true)}
        />
        <View style={styles.placeholder}>
          <Image 
            style={styles.avatar}
            source={ICONS['placeholder']}
          />
        </View>
        {!loaded && props.src && <AnimatedLinearGradient 
          style={styles.loading}
          customColors={[
            '#1F1F1F',
            '#1F1F1F',
            '#1F1F1F',
            '#000000',
          ]} 
          speed={1500}
        />}
      </View>
    </LinearGradient>
  )
}

export default ProfileAvatar

const styles = StyleSheet.create({
  wrapper: {
    height: 108,
    width: 88,
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    position: 'relative',
    borderRadius: 4
  },
  linearWrapper: {
    height: 114,
    width: 94,
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
    backgroundColor: 'transparent',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4
  },
  image: {
    height: 108,
    width: 88,
    position: 'absolute',
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
    zIndex: 1
  },
  placeholder: {
    height: 108,
    width: 88,
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
    backgroundColor: colors.CANDLELIGHT,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'absolute'
  },
  avatar: {
    height: 108,
    width: 88,
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  }
})