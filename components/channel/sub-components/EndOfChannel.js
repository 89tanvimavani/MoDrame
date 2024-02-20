import React from 'react'
import { StyleSheet, View, Image, Pressable } from 'react-native'
import colors from '../../../constants/colors'
import Text from '../../typography/Text'
import { ICONS } from '../../../constants/images'

const EndOfChannel = (props) => {
  return (
    <View style={styles.wrapper}>
      <Image source={ICONS['videos-end']}/>
      <Text style={[
        styles.text,
        Platform.OS === 'ios' ? { paddingTop: 4 } : null
      ]}>End of videos from this author</Text>
    </View>
  )
}

export default EndOfChannel

const styles = StyleSheet.create({
  wrapper: {
    width: 240,
    height: 38,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: colors.MANDY,
    borderRadius: 19
  },
  text: {
    height: 20,
    color: colors.WHITE,
  }
})