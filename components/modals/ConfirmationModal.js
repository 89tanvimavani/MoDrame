import React from 'react'
import { StyleSheet, View } from 'react-native'
import Text from '../../components/typography/Text'
import colors from '../../constants/colors'
import Modal from '../modal/Modal'
import Button from '../button/Button'
import Link from '../typography/Link'

const ConfirmationModal = (props) => {
  return (
    <Modal
      open={props.open}
      onRequestClose={props.onRequestClose}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>Warning</Text>
        <Text style={styles.description}>This action will permanently change your {props.type} to
        <Text style={{fontWeight: "bold"}}> {props.email}. {"\n"}</Text> 
        You will receive a confirmation code to your new {props.type}.</Text>
        <View style={styles.flex}>
          <Link
            center
            onPress={props.onRequestClose}
            >Cancel</Link>
          <Button
            height={50}
            width={80}
            onPress={props.onRequestClose, props.save}
            >Confirm</Button>
        </View>
      </View> 
    </Modal>
  )
}

export default ConfirmationModal

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
    justifyContent: 'space-around'
  }
})