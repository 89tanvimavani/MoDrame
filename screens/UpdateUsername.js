import React from 'react'
import {
  View, 
  StyleSheet
} from 'react-native'
import Input from '../components/input/Input'
import SettingsHeader from '../components/settings-header/SettingsHeader'
import { inject, observer } from 'mobx-react'
import colors from '../constants/colors'
import debounce from 'lodash.debounce'
import Text from '../components/typography/Text'
import { useIsFocused } from '@react-navigation/native'
import { useEffect, useRef } from 'react'

const UpdateUsername = (props) => {
  const debounced = useRef(debounce(checkExistance, 300))
  const isFocused = useIsFocused()

  const { settingsStore } = props.store

  useEffect(() => {
    if (isFocused) settingsStore.populate()
  }, [isFocused])

  function save() {
    if (settingsStore.handleError === null) {
      settingsStore.updateSettings().then(res => {
        props.navigation.goBack()
      })
    }
  }

  function checkExistance(value) {
    settingsStore.checkHandle(value)
  }

  return (
    <View style={styles.wrapper}>
      <SettingsHeader 
        onBack={() => props.navigation.goBack()}
        title="Username"
        right={{
          label: 'Save',
          action: () => save(),
          loading: settingsStore.loading
        }}
      />
      <View style={styles.inputWrap}>
        <Input 
          value={settingsStore.handle || ''}
          placeholder="Username"
          label="USERNAME"
          error={settingsStore.handleError}
          onChangeText={val => {
            settingsStore.set('handle', val)
            debounced.current(val)
          }}
          borderBottomWidth={1}
        />
      </View>
      <Text style={styles.info}>Choose your username. </Text>
      <Text style={styles.info}>Only letters and numbers are allowed. No special characters or empty spaces.</Text>
    </View>
  )
}

export default inject('store')(observer(UpdateUsername))

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  }, 
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  },
  inputWrap: {
    marginLeft: 20,
    marginRight: 16,
    marginBottom: 15
  },
  info: {
    fontSize: 14,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    color: colors.SILVER_CHALICE,
    marginBottom: 10,
    paddingLeft: 20,
    paddingRight: 16
  }
})