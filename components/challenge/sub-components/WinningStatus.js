import React from 'react'
import { StyleSheet, View, Image } from 'react-native'
import colors from '../../../constants/colors'
import { ICONS } from '../../../constants/images'
import { PRIZE_STATUS } from '../../../constants/types'
import Text from '../../typography/Text'

const WinningStatus = (props) => {
  function returnStatus() {
    switch (props.status) {
      case PRIZE_STATUS.WON:
        return 'Won'
      case PRIZE_STATUS.COLLECTED:
        return 'Won'
    }
  }

  return (
    <View style={styles.wrapper}>
      <Image 
        source={ICONS['crown']}
        style={styles.image}
      />
      <Text style={[
        styles.text,
        { color: colors.WHITE }
      ]}>{returnStatus()}</Text>
    </View>
  )
}

export default WinningStatus

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
  },
  image: {
    height: 12, 
    width: 12
  }
})