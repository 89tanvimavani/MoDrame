import React from 'react'
import {
  StyleSheet, Image
} from 'react-native'
import colors from '../../constants/colors'
import Text from '../typography/Text'
import LinearGradient from 'react-native-linear-gradient'
import { ICONS } from '../../constants/images'

const UploadingStatusFinished = (props) => {
  return (
    <LinearGradient 
      colors={props.error ? ['#e35252', '#e35252'] : ['#1dd91d', '#14b13e']} 
      style={styles.wrapper}
      useAngle={true} angle={45} angleCenter={{x:0.1,y:0.1}}> 
        {!props.error ?
          <Image source={ICONS['check-mark']}/> :
          null
        }
        <Text style={styles.statusText}>{props.text}</Text>
    </LinearGradient>
  )
}

export default UploadingStatusFinished

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.BLACK,
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
    color: colors.WHITE,
    paddingLeft: 5
  },
  icon: {
    marginRight: 5
  }
})