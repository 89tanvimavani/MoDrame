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
import { useEffect, useState } from 'react'
import { VERIFICATION_METHOD, SCREEN, ERROR_TYPE, USER_STATUS } from '../constants/types'
import ConfirmationModal from '../components/modals/ConfirmationModal'

const UpdateEmail = (props) => {
  const isFocused = useIsFocused()

  const { settingsStore, accountStore, authStore } = props.store

  const [ error, setError ] = useState(null)
  const [ confirmation, setConfirmation ] = useState(false)

  useEffect(() => {
    if (isFocused) settingsStore.populate()
  }, [isFocused])

  useEffect(() => {
    settingsStore.set('verificationMethod', VERIFICATION_METHOD.EMAIL)
  }, [])

  function confirm() {
    setError(null)
    if (settingsStore.email === accountStore.user.email) 
      return setError('Change your email!')
    if (settingsStore.validEmail) {
      setConfirmation(true)
    }
    else setError('This email is invalid')
  }

  function save() {
    settingsStore.updateEmail().then(res => {
      setConfirmation(false)
      if (res.data?.CODE && res.data.CODE === ERROR_TYPE.EMAIL_TAKEN) {
        return setError('This email is taken!')
      } else if (res.error) {
        if (res.data.message) setError(res.data.message)
        else setError('Oops, something went wrong!')
      } else {
        settingsStore.resend()
        if (!settingsStore.phone || accountStore.user.phone === USER_STATUS.VERIFICATION) {
          authStore.set('token', null)
          props.navigation.navigate('Onboarding', 
            { screen: 'Verification', params: { currentScreen: SCREEN.SETTINGS}})
        } else {
          accountStore.user.set('emailVerif', USER_STATUS.VERIFICATION)
          props.navigation.navigate('Verification', { currentScreen: SCREEN.SETTINGS})
        }
      } 
    })
  }

  return (
    <>
    <View style={styles.wrapper}>
      <SettingsHeader 
        onBack={() => props.navigation.goBack()}
        title="Email"
        right={{
          label: 'Save',
          action: () => confirm(),
          loading: settingsStore.loading
        }}
      />
      <View style={styles.inputWrap}>
        <Input 
          value={settingsStore.email || ''}
          placeholder="Email"
          label="EMAIL"
          error={error}
          onChangeText={val => settingsStore.set('email', val)}
          borderBottomWidth={1}
        />
      </View>
      <Text style={styles.info}>Change your email.</Text>
      <Text style={styles.info}>In order to change it, you will need to verify yourself again.</Text>
    </View>
    <ConfirmationModal
      open={confirmation}
      type="email"
      email={settingsStore.email}
      onRequestClose={() => setConfirmation(false)}
      save={() => save()}/>
    </>
  )
}

export default inject('store')(observer(UpdateEmail))

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