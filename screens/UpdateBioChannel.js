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

const UpdateBioChannel = (props) => {
  const { channelStore } = props.store

  const isFocused = useIsFocused()

  useEffect(() => {
    if (isFocused) channelStore.populate()
  }, [isFocused])

  function save() {
    channelStore.updateChannel().then(res => {
      props.navigation.goBack()
    })
  }

  return (
    <View style={styles.wrapper}>
      <SettingsHeader 
        onBack={() => props.navigation.goBack()}
        title="Description"
        right={{
          label: 'Save',
          action: () => save(),
          loading: channelStore.loading
        }}
      />
      <View style={styles.inputWrap}>
        <Input 
          multiLine
          value={channelStore.editDescription || ''}
          placeholder="Add your channel description"
          label="Add your channel description"
          onChangeText={val => channelStore.set('editDescription', val)}
          borderBottomWidth={1}
        />
      </View>
      <Text style={styles.info}>Tell the world a little bit about yourself.</Text>
    </View>
  )
}

export default inject('store')(observer(UpdateBioChannel))

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