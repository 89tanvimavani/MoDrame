import React from 'react'
import Modal from 'react-native-modal';
import {
  StyleSheet
} from 'react-native'

const M = (props) => {
  return (
    <Modal
      propagateSwipe
      backdropColor={props.backdropColor}
      isVisible={props.open}
      style={[
        styles.modal,
        props.noMargin && { margin: 0 },
        props.borderRadius && { borderRadius: props.borderRadius }
      ]}
      animationIn={props.animationIn}
      useNativeDriver={true}
      hideModalContentWhileAnimating={true}
      animationOut={props.animationOut}
      swipeDirection={props.swipeDirection}
      onBackdropPress={props.onRequestClose}
      onBackButtonPress={props.onRequestClose}
      onSwipeComplete={props.onRequestClose}
    >
      {props.children}
    </Modal>
  )
}

M.defaultProps = {
  swipeDirection: "down"
}

export default M

const styles = StyleSheet.create({
  modal: {
    padding: 16,
    zIndex: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
})