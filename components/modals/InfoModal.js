import React from 'react'
import { StyleSheet, View } from 'react-native'
import Text from '../../components/typography/Text'
import colors from '../../constants/colors'
import Modal from '../modal/Modal'
import Button from '../button/Button'
import Link from '../typography/Link'

const InfoModal = (props) => {
  return (
    <Modal
      open={props.open}
      onRequestClose={props.onRequestClose}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>{props.title}</Text>
        <Text style={styles.description}>
          {props.info}
        </Text>
        <View style={styles.flex}>
          <Button
            height={50}
            width={80}
            onPress={props.onRequestClose}
            >Ok</Button>
        </View>
      </View> 
    </Modal>
  )
}

export default InfoModal

const styles = StyleSheet.create({
  wrapper: {
    maxHeight: "80%",
    width: "100%",
    backgroundColor: colors.MINE_SHAFT,
    borderRadius: 11,
    alignItems: 'center',
    padding: 20
  },
  title: {
    fontSize: 20,
    color: colors.WHITE,
    margin: 20,
    fontWeight: 'bold'
  },
  description: {
    fontSize: 14,
    color: colors.WHITE,
    paddingBottom: 30,
    lineHeight: 20
  },
  flex: {
    width: "100%",
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  }
})