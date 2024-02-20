import React from 'react'
import { StyleSheet, View, Image, Pressable } from 'react-native'
import colors from '../../../constants/colors'
import Text from '../../typography/Text'
import { ICONS } from '../../../constants/images'
import { WIDTH } from '../../../constants/mesures'

const FyiCard = (props) => {
  return (
    <View style={styles.wrapper}>
      <Pressable 
        onPress={props.onPress}>
        <Image source={ICONS['info']}/>
      </Pressable>
      <Text style={styles.info}>
        Adding a description about your channel helps your followers learn about the type
        of content you create, you can also use this space to add links to your personal website,
        and other social media platforms.
      </Text>
      <Pressable 
        style={{ marginLeft: 10 }}
        onPress={props.onPress}>
        <Image source={ICONS['close']}/>
      </Pressable>
    </View>
  )
}

export default FyiCard

const styles = StyleSheet.create({
  wrapper: {
    width: WIDTH - 30,
    marginTop: 5,
    marginBottom: 15,
    padding: 20,
    backgroundColor: colors.COD_SHAFT,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    borderRadius: 6
  },
  info: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.WHITE,
    marginLeft: 10,
    maxWidth: '80%'
  }
})