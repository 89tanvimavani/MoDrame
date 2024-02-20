import React, { useState, useRef } from 'react'
import KeyboardAvoidingView from '../components/layout/KeyboardAvoidingView'
import {
  View,
  StyleSheet
} from 'react-native'
import Text from '../components/typography/Text'
import { textStyles, titleStyles } from '../styles-main/texts'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Radio from '../components/radio/Radio'
import { inject, observer } from 'mobx-react'
import { VERIFICATION_METHOD } from '../constants/types'
import Input from '../components/input/Input'
import Link from '../components/typography/Link'
import colors from '../constants/colors'
import Toast from 'react-native-toast-message';
import debounce from 'lodash/debounce'
import Button from '../components/button/Button'
import { WIDTH } from '../constants/mesures'
import PhoneInput from '../components/input/PhoneInput'

const PasswordResetSendCode = (props) => {
  const insets = useSafeAreaInsets()
  const debouncedPhone = useRef(debounce(checkPhoneExistance, 800))

  const { authStore } = props.store

  const [ phoneNumber, setPhoneNumber ] = useState('')
  const [ areacode, setAreacode ] = useState('+1')

  async function save() {
    const res = await authStore.resendCode()
    if (res.error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: res.data
      })
    }
    else props.navigation.navigate('PasswordReset')
  }


  function checkPhoneExistance(number) {
    authStore.checkPhoneNumber(number)
  }

  function onPhoneChange(phone) {
      authStore.clearError()
      setPhoneNumber(phone)
      debouncedPhone.current(`${phone}`)
  }

  function onAreaCodeChange(areacode) {
    setAreacode(areacode)
    authStore.set('areaCode', areacode)
    checkPhoneExistance(phoneNumber)
  }

  return (
    <KeyboardAvoidingView>
      <View style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom
      }}>
        <View>
          <View style={styles.head}>
            <View>
              <Link
                onPress={() => props.navigation.goBack()}
                underline
              >Back</Link>
            </View>
          </View>
          <View style={styles.body}>
            <Text style={[
              titleStyles.onboardingTitle, 
              {
                maxWidth: WIDTH/2
              }]}>Forgot password</Text>

            <Text style={[
              textStyles.inputInfo,
              styles.input
            ]}>We have send you a verification code to your phone number below. </Text>

            <View style={styles.radioGroup}>
              <Text style={textStyles.inputLabel}>VERIFICATION METHOD</Text>
              <View style={styles.row}>
                <Radio 
                  onPress={() => authStore.set('verificationMethod', 'PHONE')}
                  label="Phone"
                  active={authStore.verificationMethod === 'PHONE'}
                />
                <View style={{ width: 20 }}/>
                <Radio 
                  onPress={() => authStore.set('verificationMethod', 'EMAIL')}
                  label="Email"
                  active={authStore.verificationMethod === 'EMAIL'}
                />
              </View>

              <View style={[styles.inputWrap]}>
                {authStore.verificationMethod === VERIFICATION_METHOD.PHONE ?
                  <PhoneInput 
                    label="PHONE NUMBER"
                    placeholder="Phone"
                    onPhoneChange={(phone) => onPhoneChange(phone)}
                    onAreaCodeChange={(areacode) => onAreaCodeChange(areacode)}
                    value={phoneNumber}
                    areacode={areacode}
                    keyboardType="phone-pad"
                    submitted={authStore.submitted}
                    loading={authStore.verifyingPhone}
                    error={authStore.phoneError}
                  /> :
                  <Input 
                    label="EMAIL"
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={email => authStore.set('email', email)}
                    value={authStore.email}
                  />
                }
              </View>
            </View>
          </View>
          <View style={styles.foot}>
            <Button 
              onPress={save}
              height={50}
              next
              loading={authStore.loading}
              disabled={!authStore.allowResendCode || authStore.loading}
            >Send me a code</Button>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

export default inject('store')(observer(PasswordResetSendCode))

const styles = StyleSheet.create({
  body: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 16,
  },  
  row: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 20
  },
  inputWrap: {
    marginBottom: 16,
    marginTop: 8
  },
  radioGroup: {
    marginBottom: 16
  },
  foot: {
    paddingLeft: 16,
    paddingRight: 30,
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderColor: colors.SCORPION,
  },
  head: {
    paddingLeft: 20,
    paddingRight: 20,
    height: 35,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  input: {
    marginTop: 15,
    marginBottom: 15
  }
})