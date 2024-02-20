import React from 'react'
import {
  View, 
  StyleSheet
} from 'react-native'
import SettingsHeader from '../components/settings-header/SettingsHeader'
import { inject, observer } from 'mobx-react'
import debounce from 'lodash/debounce'
import colors from '../constants/colors'
import Text from '../components/typography/Text'
import { useIsFocused } from '@react-navigation/native'
import { useEffect, useState, useRef } from 'react'
import PhoneInput from '../components/input/PhoneInput'
import { VERIFICATION_METHOD, SCREEN, ERROR_TYPE, USER_STATUS } from '../constants/types'
import ConfirmationModal from '../components/modals/ConfirmationModal'

const UpdatePhone = (props) => {
  const isFocused = useIsFocused()
  const debouncedPhone = useRef(debounce(checkPhoneExistance, 800))

  const { settingsStore, authStore, accountStore } = props.store

  const [ phoneNumber, setPhoneNumber ] = useState('')
  const [ confirmation, setConfirmation ] = useState(false)

  useEffect(() => {
    if (isFocused) settingsStore.populate()
  }, [isFocused])

  useEffect(() => {
    if (accountStore.user?.phone) {
      setPhoneNumber(accountStore.user?.phone.replace(accountStore.user?.phoneCountryCodeNum, ""))
      settingsStore.set('areaCode', accountStore.user?.phoneCountryCodeNum)
    } else {
      setPhoneNumber(authStore.phone?.replace(authStore.areaCode, ""))
      settingsStore.set('areaCode', authStore.areaCode)
    }

    if (!settingsStore.areaCode) settingsStore.set('areaCode', '+1')
    settingsStore.set('verificationMethod', VERIFICATION_METHOD.PHONE)
  }, [])

  function save() {
    setConfirmation(false)
    settingsStore.clearError()
    settingsStore.updatePhone().then(res => {
      if (res.data?.CODE && res.data.CODE === ERROR_TYPE.PHONE_TAKEN)
        return settingsStore.set('error', 'This phone number is taken!')
      else if (res.error && res.data?.message) settingsStore.set('error', res.data.message)
      else {
        settingsStore.resend()
        if (!settingsStore.email || accountStore.user?.email === USER_STATUS.VERIFICATION) {
          authStore.set('token', null)
          props.navigation.navigate('Onboarding', 
            { screen: 'Verification', params: { currentScreen: SCREEN.SETTINGS}})
        } else {
          accountStore.user.set('phoneVerif', USER_STATUS.VERIFICATION)
          props.navigation.navigate('Verification', { currentScreen: SCREEN.SETTINGS})
        }
      }
    })
  }
  
  function confirm() {
    if (settingsStore.phone === accountStore.user.phone) 
      return settingsStore.set('error', "Change phone number!")
    if (settingsStore.phoneValid) setConfirmation(true)
  }

  function checkPhoneExistance(number) {
    settingsStore.checkPhoneNumber(number)
  }

  function onPhoneChange(phone) {
    settingsStore.clearError()
    setPhoneNumber(phone)
    debouncedPhone.current(`${phone}`)
  }

  function onAreaCodeChange(areacode) {
    settingsStore.set('areaCode', areacode)
    checkPhoneExistance(phoneNumber)
  }

  return (
    <>
    <View style={styles.wrapper}>
      <SettingsHeader 
        onBack={() => props.navigation.goBack()}
        title="Phone"
        disabled={settingsStore.error !== null}
        right={{
          label: 'Save',
          action: () => confirm(),
          loading: settingsStore.loading
        }}
      />
      <View style={styles.inputWrap}>
        <PhoneInput 
          label="PHONE NUMBER"
          placeholder="Phone"
          onPhoneChange={(phone) => onPhoneChange(phone)}
          onAreaCodeChange={(areacode) => onAreaCodeChange(areacode)}
          value={phoneNumber}
          areacode={settingsStore.areaCode}
          keyboardType="phone-pad"
          submitted={settingsStore.submitted}
          loading={settingsStore.verifyingPhone}
          error={settingsStore.error}
        />
      </View>
      <Text style={styles.info}>
        Change your phone number.
      </Text>
      <Text style={styles.info}>
        In order to change it you will need to verify yourself again.
      </Text>
    </View>
    <ConfirmationModal
      open={confirmation}
      type="phone numer"
      email={settingsStore.phone}
      onRequestClose={() => setConfirmation(false)}
      save={() => save()}/>
    </>
  )
}

export default inject('store')(observer(UpdatePhone))

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