import React from 'react'
import {
  View,
  StyleSheet
} from 'react-native'
import { WIDTH } from '../../constants/mesures'
import AnimatedLinearGradient from 'react-native-animated-linear-gradient'

const LoadingTile = (props) => {
  return (
    <View style={styles.wrapper}>
      <AnimatedLinearGradient 
        customColors={[
          '#1F1F1F',
          '#1F1F1F',
          '#1F1F1F',
          '#000000',
        ]} 
        speed={1500}
      />
    </View>
  )
}

export default LoadingTile

const styles = StyleSheet.create({
  wrapper: {
    width: WIDTH/3,
    height: WIDTH/3*1.56,
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
})