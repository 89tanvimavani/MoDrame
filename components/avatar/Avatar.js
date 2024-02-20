import React, { useState } from 'react'
import { View, Image, StyleSheet } from 'react-native'
import { ICONS } from '../../constants/images'
import AnimatedLinearGradient from 'react-native-animated-linear-gradient'

const Avatar = (props) => {
  const [ error, setError ] = useState(false)

  return (
    <View style={styles.wrapper}>
      { error || !props.src ?
        <Image 
          style={styles.avatar}
          source={ICONS['placeholder-grey']}
        /> :
        <Image 
          source={{ uri: props.src }}
          style={styles.image}
          onSuccess={() => setError(false)}
          onError={() => setError(true)}
        /> 
      }
      {props.src && !error && <AnimatedLinearGradient 
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
  )
}

export default Avatar

const styles = StyleSheet.create({
  wrapper: {
    width: 44,
    height: 54,
    backgroundColor: 'transparent',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: 44,
    height: 54,
    position: 'absolute',
    zIndex: 1
  }, 
  avatar: {
    height: 54,
    width: 44,
    position: 'absolute'
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  }
})