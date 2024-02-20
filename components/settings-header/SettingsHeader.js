import React from 'react'
import {
  View, StyleSheet, TouchableOpacity
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import colors from '../../constants/colors'
import TransparentButton from '../button/TransparentButton'
import Text from '../typography/Text'
import { ICONS } from '../../constants/images'

const SettingsHeader = (props) => {
  const insets = useSafeAreaInsets()

  return (
    <View style={[
        styles.wrapper, 
        { paddingTop: insets.top > 0 && !props.modal ? insets.top + 10 : 20 }
      ]}>
      <TransparentButton
        onlyIconButton
        icon={ICONS['backarrow']}
        onPress={props.onBack}
      />
      <View>
        <Text style={styles.title}>{props.title}</Text>
      </View>
      {!props.loading ?
        <TouchableOpacity
          disable={props.disabled}
          onPress={props.right?.action}
          style={[
            styles.right, 
            props.disabled && styles.disabled
          ]}
        >
          <Text style={[
            styles.actionlabel, 
            props.disabled && styles.disabled
          ]}>
            {props.right?.label}
          </Text>
        </TouchableOpacity> :
        <View style={styles.right}>
          <LottieView 
            style={{ height: props.height, width: props.height}}
            source={require('../../animations/loading.json')} 
            autoPlay 
            loop
          />
        </View>
      }
    </View>
  )
}

export default SettingsHeader

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: colors.WHITE
  },
  right: {
    height: 20,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 10
  },
  actionlabel: {
    fontSize: 17,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: colors.LIGHTNING_YELLOW,
  },
  disabled: {
    color: colors.WHITE_OPACITY_5
  }
})
