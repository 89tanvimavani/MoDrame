import React from 'react'
import {
  View, StyleSheet
} from 'react-native'
import LottieView from 'lottie-react-native';
import colors from '../../constants/colors';
import Text from '../typography/Text'

const UploadingStatus = (props) => {
  return (
    <View style={styles.wrapper}>
      <LottieView 
        style={styles.lottie}
        source={require('../../animations/loading.json')} 
        autoPlay 
        loop
      />
      <Text style={styles.statusText}>uploading {props.progress}%</Text>
    </View>
  )
}

export default UploadingStatus

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.WHITE,
    height: 24,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 16,
    borderRadius: 32,
    paddingLeft: 16
  },
  statusText: {
    fontSize: 12,
    color: colors.BLACK
  },
  lottie: { 
    height: 30, 
    width: 30
  }
})