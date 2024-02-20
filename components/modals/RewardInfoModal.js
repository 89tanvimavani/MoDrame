import React from 'react'
import { StyleSheet, View, Image } from 'react-native'
import Text from '../../components/typography/Text'
import colors from '../../constants/colors'
import Modal from '../modal/Modal'
import { ICONS } from '../../constants/images'
import TransparentButton from '../button/TransparentButton'

const RewardInfoModal = (props) => {
  return (
    <Modal
      open={props.open}
      onRequestClose={props.onRequestClose}>
      <View style={styles.wrapper}>
        <TransparentButton
          onlyIconButton
          absoluteRight
          icon={ICONS['close']}
          onPress={props.onRequestClose}
        />
        <Image source={ICONS['prize']}/>
        <Text style={styles.description}>
        If you win a challenge we will let you know via the 
        <Text style={styles.underlined}> notification center</Text><Text> </Text>
        of the app, you can also reach out to us at 
        <Text style={styles.bold}> info@versuz.app </Text> 
        to get your 
        <Text style={styles.underlined}> e-gifts</Text><Text> </Text>
        sent directly to your inbox.
        </Text>
        <TransparentButton
          color={colors.LIGHTNING_YELLOW}
          onPress={props.onRequestClose}>
          Dismiss
        </TransparentButton>
      </View> 
    </Modal>
  )
}

export default RewardInfoModal

const styles = StyleSheet.create({
  wrapper: {
    maxHeight: "80%",
    width: "100%",
    backgroundColor: colors.MINE_SHAFT,
    borderRadius: 11,
    alignItems: 'center',
    padding: 24
  },
  description: {
    fontSize: 14,
    color: colors.WHITE,
    paddingBottom: 16,
    paddingTop: 36,
    lineHeight: 20
  },
  scroll: {
    width: "100%",
    paddingLeft: 30,
    paddingRight: 30
  },
  bold: {
    fontWeight: 'bold'
  },
  underlined: {
    textDecorationLine: 'underline'
  }
})