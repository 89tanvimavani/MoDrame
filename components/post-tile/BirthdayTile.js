import React from 'react'
import { Pressable, StyleSheet, View, Image } from 'react-native'
import { WIDTH } from '../../constants/mesures'
import Text from '../../components/typography/Text'
import Button from '../../components/button/Button'
import { ICONS } from '../../constants/images'
import colors from '../../constants/colors'

const BirthdayTile = (props) => {
  return (
    <Pressable
      style={styles.wrapper}
      onPress={props.onPress}
    >
      <View style={styles.buttonWrapper}>
        <Button
          width={50}
          height={50}
          shadow
          iconStyle={{ marginLeft: 6 }}
          onlyIconButton
          onPress={props.birthdayTileClick}
          icon={ICONS['upload']}/>
      </View>
      <Text style={styles.description}>
        Tap here to upload your birthday celebration video to <Text style={styles.bold}>win prizes!</Text>
      </Text>
      <Text style={styles.description}>
        Due date: <Text style={styles.bold}>{props.dueDate}</Text>
      </Text>
    </Pressable>
  )
}

export default BirthdayTile

const styles = StyleSheet.create({
  wrapper: {
    width: WIDTH/3,
    height: WIDTH/3*1.56,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: colors.DARK_GRAY
  },
  buttonWrapper: {
    paddingBottom: 16
  },
  description: {
    fontSize: 9,
    textAlign: 'center',
    color: colors.WHITE,
    lineHeight: 14,
  },
  bold: {
    fontWeight: 'bold'
  }
})