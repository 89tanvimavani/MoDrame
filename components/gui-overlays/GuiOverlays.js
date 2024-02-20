import { inject, observer } from 'mobx-react'
import React from 'react'
import {
  View,
  StyleSheet,
  Image,
  Text
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import colors from '../../constants/colors'
import { ICONS } from '../../constants/images'
import { HEIGHT, WIDTH } from '../../constants/mesures'

const GuiOverlays = (props) => {
  const { guiStore } = props.store
  const insets = useSafeAreaInsets()

  return (
    !guiStore.connected && 
      <View style={styles.overlay}>
        <View style={[
          styles.toast,
          { marginTop: 15 + insets.top}
        ]}>
          <View style={styles.row}>
            <Image source={ICONS['plug']} />
            <Text style={styles.text}>
              Your intenet connection is not collaborating.
            </Text>
          </View>
        </View>
      </View>
  )
}

export default inject('store')(observer(GuiOverlays))

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    width: WIDTH,
    height: HEIGHT,
    left: 0,
    top: 0,
    backgroundColor: 'backgroundColor: "rgba(0, 0, 0, 0.67)"',
    zIndex: 1000
  },
  toast: {
    width: WIDTH - 30,
    minHeight: 47,
    backgroundColor: colors.WHITE,
    margin: 15,
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'center',
    paddingLeft: 22, 
    paddingRight: 22,
    paddingTop: 10,
    paddingBottom: 10
  },
  text: {
    fontSize: 17,
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#fd3a69",
    marginLeft: 10
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
})