import React from 'react'
import { StyleSheet, View, Image, Pressable } from 'react-native'
import colors from '../../constants/colors'
import Text from '../typography/Text'
import { ICONS } from '../../constants/images'
import { WIDTH } from '../../constants/mesures'

const FyiCard = (props) => {
  return (

    <View style={styles.wrapper}>
      <View style={styles.innerWrapper}>
        <Pressable 
          style={styles.infoButton}
          onPress={props.openInfo}>
          <Image source={ICONS['info']}/>
        </Pressable>
        <Text style={[
          styles.info,
          props.onClose && { maxWidth: '85%' }
        ]}>
          {props.text}
        </Text>
        { props.onClose &&
          <Pressable 
            style={{ marginLeft: 10 }}
            onPress={props.onClose}>
            <Image source={ICONS['close-info']} height={22} width={22}/>
          </Pressable>
        }
      </View>
      {
        props.onRules && 
        <Pressable onPress={props.onRules}>
          <Text style={styles.rulesText}>VIEW RULES & GUIDELINES</Text>
        </Pressable>
      }
    </View>
  )
}

export default FyiCard

const styles = StyleSheet.create({
  wrapper: {
    width: WIDTH - 30,
    maxWidth: "100%",
    marginTop: 5,
    marginBottom: 15,
    padding: 20,
    backgroundColor: colors.COD_SHAFT,

    borderRadius: 6
  },
  innerWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoButton: {
    paddingRight: 10
  },
  info: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.WHITE,
    marginLeft: 10,
  },
  rulesText: {
    color: colors.LIGHTNING_YELLOW,
    marginLeft: 28,
    marginTop: 8,
    fontWeight: "bold"
  }
})