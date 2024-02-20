import React from 'react'
import { Linking, StyleSheet, View } from 'react-native'
import Toast from 'react-native-toast-message'
import colors from '../../constants/colors'
import { WIDTH } from '../../constants/mesures'
import Modal from '../modal/Modal'
import Link from '../typography/Link'
import { inject, observer } from 'mobx-react'
import { REPORT_TYPE } from '../../constants/types'

const ProfileMenuModal = (props) => {
  const { accountStore } = props.store

  function onReport() {
    props.onRequestClose()
    accountStore.report(REPORT_TYPE.USER, 'Report user', props.userId)

    Toast.show({
      type: 'info',
      text1: 'User reported',
      text2: "We'll check it out, thanks for keeping our community awesome!"
    })
  }

  function onBlock() {
    props.onRequestClose()
    accountStore.block(props.handle)

    props.onBlock()

    Toast.show({
      type: 'info',
      text1: 'User block requested',
      text2: `We have blocked @${props.handle} from Versuz. Thanks for reporting and keeping Versuz a safe place!`,
      visibilityTime: 5000
    })
  }

  function onUnblock() {
    props.onUnblock()
    props.onRequestClose()
  }

  function contact() {
    Linking.openURL(`mailto:support@versuz.app`)
  }

  return (
    <Modal
      open={props.open}
      onRequestClose={props.onRequestClose}
    >
      <View style={styles.wrapper}>
        <View>
            <Link
              onPress={() => onReport()}
              height={60}
            >Report @{props.handle}</Link>
            {props.blocked ?
              <Link
                onPress={() => onUnblock()}
                height={60}
              >Unblock @{props.handle}</Link> :
              <Link
                onPress={() => onBlock()}
                height={60}
              >Block @{props.handle}</Link>
            }
            <View style={{ opacity: .5 }}>
              <Link
                onPress={() => ({})}
                height={60}
              >@{props.handle}</Link>
            </View>
            <Link
              height={60}
              onPress={() => contact()}
            >Contact versuz</Link>
        </View>
      </View>
    </Modal>
  )
}

export default inject('store')(observer(ProfileMenuModal))

const styles = StyleSheet.create({
  wrapper: {
    width: WIDTH,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: colors.BLACK,
    display: 'flex',
    paddingLeft: 16,
    paddingRight: 16,
  }
})