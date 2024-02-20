import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import Text from '../../components/typography/Text'
import colors from '../../constants/colors'
import Modal from '../modal/Modal'
import Ranking from '../ranking/Ranking'
import { RANKS } from '../../constants/ranking'
import TransparentButton from '../button/TransparentButton'
import { ICONS } from '../../constants/images'

const RankingModal = (props) => {
  return (
    <Modal
      open={props.open}
      swipeDirection={null}
      onRequestClose={props.onRequestClose}>
      <View style={styles.wrapper}>
        <TransparentButton
          onlyIconButton
          absoluteRight
          icon={ICONS['close']}
          onPress={props.onRequestClose}
        />
        <Text style={styles.title}>Versuz score table</Text>
        <Text style={styles.description}>How ranking works</Text>
        <ScrollView 
          style={styles.scroll}
          scrollEnabled={true}
          contentContainerStyle={{ flexGrow: 1 }}>
            <Ranking ranks={RANKS}/>
            <TransparentButton
              onPress={props.onRequestClose}>
              Dismiss
            </TransparentButton>
        </ScrollView>
      </View> 
    </Modal>
  )
}

export default RankingModal

const styles = StyleSheet.create({
  wrapper: {
    maxHeight: "80%",
    width: "100%",
    backgroundColor: colors.MINE_SHAFT,
    borderRadius: 11,
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    color: colors.WHITE,
    margin: 20,
    paddingTop: 20
  },
  description: {
    fontSize: 14,
    color: colors.WHITE,
    paddingBottom: 10
  },
  scroll: {
    width: "100%",
    paddingLeft: 30,
    paddingRight: 30
  }
})