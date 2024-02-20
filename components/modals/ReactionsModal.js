import React from 'react'
import { StyleSheet, View, Pressable } from 'react-native'
import colors from '../../constants/colors'
import Modal from '../modal/Modal'
import Emojis from '../emojis/Emojis'

const ReactionsModal = (props) => {
  return (
    <Modal
      open={props.open}
      swipeDirection={null}
      backdropColor={colors.TRANSPARENT}
      animationIn='fadeIn'
      animationOut='fadeOut'
      onRequestClose={props.onRequestClose}>
      <Pressable 
        onPress={props.onRequestClose}
        style={styles.wrapper}>
        <View style={{ position: 'absolute', top: props.top-70, left: props.left-20}}>
          <Emojis 
            channelReactions
            onReactionPress={(reactionType, add) => {
              props.react(reactionType, add, props.id)
            }}
            reactions={props.reactions}
            reactionId={props.reactionId}
            id={props.id}
          />
        </View>
      </Pressable> 
    </Modal>
  )
}

export default ReactionsModal

const styles = StyleSheet.create({
  wrapper: {
    height: "100%",
    width: "100%",
    backgroundColor: colors.TRANSPARENT,
    borderRadius: 11,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    position: 'relative'
  }
})