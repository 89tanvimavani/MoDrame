import React from 'react'
import { StyleSheet, View } from 'react-native'
import Toast from 'react-native-toast-message'
import colors from '../../constants/colors'
import { WIDTH } from '../../constants/mesures'
import Modal from '../modal/Modal'
import Link from '../typography/Link'
import { inject, observer } from 'mobx-react'
import { REPORT_MESSAGE, REPORT_TYPE } from '../../constants/types'

const ReportModal = (props) => {
  const {accountStore} = props.store

  function report(message) {
    props.onRequestClose()
    accountStore.report(REPORT_TYPE.DRAMA, message, props.dramaId)
    Toast.show({
      type: 'info',
      text1: `Post reported`,
      text2: "We'll check it out, thanks for keeping our community awesome!"
    })
  }

  return (
    <Modal
      open={props.open}
      onRequestClose={props.onRequestClose}
    >
      <View style={styles.wrapper}>
        <View>
          <Link
            onPress={() => report(REPORT_MESSAGE.OFFENSIVE)}
            height={60}
          >This video is offensive</Link>
          <Link
            onPress={() => report(REPORT_MESSAGE.VIOLENT)}
            height={60}
          >This video is violent</Link>
          <Link
            height={60}
            onPress={() => report(REPORT_MESSAGE.NUDITY)}
          >This video shows nudity</Link>
        </View>
      </View>
    </Modal>
  )
}

export default inject('store')(observer(ReportModal))

const styles = StyleSheet.create({
  wrapper: {
    width: WIDTH,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: colors.BLACK,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
})