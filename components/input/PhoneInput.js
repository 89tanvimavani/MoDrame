import React, { useState } from 'react'
import {
  View, 
  StyleSheet,
  ActivityIndicator,
  Platform
} from 'react-native'
import colors from '../../constants/colors'
import { textStyles } from '../../styles-main/texts'
import Select from '../select/Select'
import Text from '../typography/Text'
import Input from './Input'
import {AREACODES} from '../../data/areacodes'

const PhoneInput = (props) => {
  const [ touched, setTouched ] = useState(false)

  function onChange(e) {
    setTouched(true)
    return props.onPhoneChange(`${e}`)
  }

  return (
    <View style={styles.container}>
      <Text>
        <Text style={textStyles.inputLabel}>{props.label}</Text>
        <Text style={textStyles.required}> (required)</Text>
      </Text>
      <View style={styles.wrapper}>
        <View style={styles.selectWrap}>
          <Select
            onChange={e => {
              props.onAreaCodeChange(e)
              setTouched(true)
            }}
            options={AREACODES}
            value={props.areacode}
          />
        </View>
        <View style={{ width: 5 }}/>
        <View style={{ 
          ...Platform.select({
            android: {
              marginTop: -10,
              width: '100%'
            },
            ios: {
              marginTop: -4
            }
          })
        }}>
          <Input 
            // label={props.label}
            placeholder={props.placeholder}
            onChangeText={onChange}
            value={props.value}
            keyboardType="phone-pad"
            submitted={props.submitted}
            // loading={props.loading}
            borderBottomWidth={0}
          />
        </View>
      </View>
      {props.error && touched && !props.loading && 
        <Text style={textStyles.inputError}>{props.error}</Text> }
      {props.loading && 
        <View style={styles.infoLoading}>
          <ActivityIndicator
            color={colors.SCORPION}
          />
          <Text style={[
            textStyles.inputInfo, 
            { marginLeft: 5 }
          ]}>Verifying...</Text>
        </View>
      }
    </View>
  )
}

export default PhoneInput

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: colors.DUSTY_GRAY,
    marginBottom: 4
  },
  selectWrap: {
  },
  infoLoading: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  }
})