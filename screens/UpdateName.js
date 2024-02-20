import React from 'react'
import {
  View, 
  StyleSheet
} from 'react-native'
import Input from '../components/input/Input'
import SettingsHeader from '../components/settings-header/SettingsHeader'
import { inject, observer } from 'mobx-react'
import colors from '../constants/colors'
import Text from '../components/typography/Text'
import { useIsFocused } from '@react-navigation/native'
import { useEffect } from 'react'

const UpdateName = (props) => {
  const { settingsStore } = props.store

  const isFocused = useIsFocused()

  useEffect(() => {
    if (isFocused) settingsStore.populate()
  }, [isFocused])


  function save() {
    settingsStore.updateSettings().then(res => {
      props.navigation.goBack()
    })
  }

  return (
    <View style={styles.wrapper}>
      <SettingsHeader 
        onBack={() => props.navigation.goBack()}
        title="Name"
        right={{
          label: 'Save',
          action: () => save(),
          loading: settingsStore.loading
        }}
      />
      <View style={styles.inputWrap}>
        <Input 
          value={settingsStore.name || ''}
          placeholder="Name"
          label="NAME"
          onChangeText={val => settingsStore.set('name', val)}
          borderBottomWidth={1}
        />
      </View>
      <Text style={styles.info}>Choose your Name. This can be a Firstname, nickname or something else.</Text>
      <Text style={styles.info}>Name needs to be at least two characters long.</Text>
    </View>
  )
}

export default inject('store')(observer(UpdateName))

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