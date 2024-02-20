import React, { useState } from 'react'
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

const UpdateWebsiteChannel = (props) => {
  const isFocused = useIsFocused()

  const [ error, setError ] = useState(null)

  const { channelStore } = props.store

  useEffect(() => {
    if (isFocused) channelStore.populate()
  }, [isFocused])

  function save() {
    setError(null)
    if (channelStore.validUrl)
      channelStore.updateChannel().then(res => {
        props.navigation.goBack()
      })
    else 
      setError("Link is invalid")
  }

  return (
    <View style={styles.wrapper}>
      <SettingsHeader 
        onBack={() => props.navigation.goBack()}
        title="Webpage"
        right={{
          label: 'Save',
          action: () => save(),
          loading: channelStore.loading
        }}
      />
      <View style={styles.inputWrap}>
        <Input 
          value={channelStore.editWebsite || ''}
          placeholder="Add webpage link"
          label="Add webpage link"
          error={error}
          onChangeText={val => channelStore.set('editWebsite', val)}
          borderBottomWidth={1}
        />
      </View>
      <Text style={styles.info}>Add link to your personal or business webpage.</Text>
    </View>
  )
}

export default inject('store')(observer(UpdateWebsiteChannel))

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