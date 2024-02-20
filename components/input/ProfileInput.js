import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import Text from '../typography/Text'
import colors from '../../constants/colors'
import { WIDTH } from '../../constants/mesures'
import TransparentButton from '../button/TransparentButton'
import { ICONS } from '../../constants/images'

const ProfileInput = props => {
  const [ touched, setTouched ] = useState(false)
  const [ focused, setFocused ] = useState(false)

  function onFocus() {
    setTouched(true)
    setFocused(true)
  }

  function onBlur() {
    setFocused(false)
  }

  useEffect(() => {
    if (props.submitted) setTouched(true)
    else setTouched(false)
  }, [props.submitted])

  return (
    <View
      style={[
        styles.inputWrapper,
        props.multipleLines && {alignItems: 'flex-start'}
      ]}
    >
      <Text style={styles.label}>{props.label}</Text>
      { props.value ?
        <Text 
          numberOfLines={props.multipleLines ? 0 : 1}
          style={[
            styles.input, 
            {
              maxWidth: props.maxWidth
            }
          ]}>
          {props.value}
        </Text> :
        <Text 
          style={styles.placeholder}>
          {props.placeholder}
        </Text>
      }
      { !props.notEditable ? 
        <TransparentButton 
          onlyIconButton icon={ICONS['edit']} 
          onPress={props.onPress}/>
      : null } 
    </View>
  )
}

export default ProfileInput

ProfileInput.defaultProps = {
  borderBottomWidth: 0,
  paddingLeft: 0
}


const styles = StyleSheet.create({
  inputWrapper: {
    marginTop: 10,
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: 5,
    alignItems: 'center',
    width: WIDTH - 64
  },
  label: {
    color: colors.DOVE_GRAY,
    fontSize: 14,
    width: "45%"
  },
  input: {
    fontSize: 16,
    color: colors.WHITE,
    fontWeight: 'bold',
    lineHeight: 18
  },
  placeholder: {
    fontSize: 16,
    color: colors.DUSTY_GRAY,
    fontStyle: 'italic'
  }
})