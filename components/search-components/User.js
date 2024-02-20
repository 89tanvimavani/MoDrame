import React from 'react'
import {
  View, 
  StyleSheet,
  Pressable
} from 'react-native'
import colors from '../../constants/colors'
import Text from '../typography/Text'
import Avatar from '../avatar/Avatar'

const User = (props) => {
  return (
    <Pressable
      style={({ pressed }) => [
        { backgroundColor: pressed
            ? colors.DOVE_GRAY
            : colors.COD_SHAFT
        },
        styles.wrapper
      ]}
      onPress={props.onProfile}>
      <Avatar src={props.avatar}/>
      <View style={styles.userData}>
        <Text style={styles.name}>{props.name}</Text>
        <Text style={styles.handle}>{props.handle}</Text>
      </View>
    </Pressable>
  )
}

export default User

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10
  },
  userData: {
    paddingLeft: 10
  },
  name: {
    fontSize: 16,
    color: colors.WHITE
  },
  handle: {
    fontSize: 14,
    color: colors.SILVER
  }
})