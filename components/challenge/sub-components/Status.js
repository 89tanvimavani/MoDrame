import React from 'react'
import { StyleSheet, View, Image } from 'react-native'
import colors from '../../../constants/colors'
import { ICONS } from '../../../constants/images'
import { CHALLENGE_STATUS } from '../../../constants/types'
import Text from '../../typography/Text'

const Status = (props) => {

  function returnStatus() {
    switch (props.status) {
      case CHALLENGE_STATUS.ACTIVE:
        return 'Active'
      case CHALLENGE_STATUS.PAST:
        return 'Past'
      case CHALLENGE_STATUS.REVIEW:
        return 'Review'
      case CHALLENGE_STATUS.NOT_CONSIDERING:
        return 'Not considering'
      case CHALLENGE_STATUS.DECLINED:
        return 'Declined'
    }
  }

  return (
    <View style={styles.wrapper}>
      <Image 
        source={ICONS['lightning']}
        style={{
          ...props.status !== CHALLENGE_STATUS.ACTIVE && {
            tintColor: colors.SCORPION
          }
        }}
      />
      <Text style={[
        styles.text,
        {
          color: props.status === CHALLENGE_STATUS.ACTIVE ? colors.WHITE : colors.SCORPION
        }
      ]}>{returnStatus()}</Text>
    </View>
  )
}

export default Status

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