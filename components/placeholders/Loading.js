import React from 'react'
import { View, StyleSheet } from 'react-native'
import LottieView from 'lottie-react-native';
import Text from '../typography/Text';
import colors from '../../constants/colors';
import { WIDTH } from '../../constants/mesures';

const Loading = (props) => {
  return (
    <View style={[
      styles.wrapper,
      props.absolute && styles.absolute,
      props.height && { height: props.height },
    ]}>
      <LottieView 
        style={styles.lottie}
        source={require('../../animations/loading.json')} 
        autoPlay 
        loop
      />
      { !props.iconOnly && 
        <Text style={styles.text}>Loading ...</Text>
      }
    </View>
  )
}

export default Loading

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 20,
    height: 80,
    width: WIDTH,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: colors.WHITE,
    marginTop: 10,
    fontSize: 17,
    fontWeight: 'bold'
  },
  lottie: { 
    height: 40, 
    width: 40 
  },
  absolute: { 
    position: 'absolute', 
    top: 0, 
    backgroundColor: colors.MINE_SHAFT 
  }
})