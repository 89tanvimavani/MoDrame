import React from 'react'
import { StyleSheet, View, Image } from 'react-native'
import colors from '../../../constants/colors'
import Text from '../../typography/Text'
import { ICONS } from '../../../constants/images'
import { DateTime } from 'luxon'

const Expiry = (props) => {
  function returnStatus() {
    if (props.isPast)
      return 'Challenge is over'
    else {
      return 'Expiry ' + props.dueDate
    }
  }

  return (
    <View style={styles.wrapper}>
      <Image source={ICONS['calendar']}/>
      <Text style={styles.text}>
        {returnStatus()}
      </Text>
    </View>
  )
}

export default Expiry

const styles = StyleSheet.create({
  wrapper: {
    height: 32,
    backgroundColor: colors.BLACK,
    borderRadius: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    flexGrow: 0,
    alignSelf: 'flex-start'
  },
  text: {
    color: colors.WHITE,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5
  }
})