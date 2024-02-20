import React from 'react'
import {
  View,
  StyleSheet,
  Image
} from 'react-native'
import colors from '../../../constants/colors'
import { ICONS } from '../../../constants/images'
import Text from '../../typography/Text'

const Prize = (props) => {
  return (
    <View style={styles.wrapper}>
      <Image source={ICONS['dollar']}/>
      <View style={styles.textWrapper}>
        <Text style={styles.text}>{props.children}</Text>
        <View style={styles.line}/>
      </View>
    </View>
  )
}

export default Prize

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 8,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    color: colors.CANDLELIGHT,
    fontSize: 18,
  },
  textWrapper: {
    marginLeft: 13,
    width: '100%'
  },
  line: {
    marginTop: 8,
    borderBottomColor: colors.DOVE_GRAY,
    borderBottomWidth: 1,
    width: '70%'
  }
})