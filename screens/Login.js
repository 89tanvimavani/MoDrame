import React, { useEffect, useState, useRef } from 'react'
import {
  View, 
  StyleSheet,
  Image
} from 'react-native'
import {
  inject, observer
} from 'mobx-react'
import Input from '../components/input/Input'
import PhoneInput from '../components/input/PhoneInput'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Text from '../components/typography/Text'
import { textStyles, titleStyles } from '../styles-main/texts'
import Link from '../components/typography/Link'
import colors from '../constants/colors'
import Radio from '../components/radio/Radio'
import KeyboardAvoidingView from '../components/layout/KeyboardAvoidingView'
import debounce from 'lodash/debounce'
import { BRAND } from '../constants/images'
import Button from '../components/button/Button'

const Login = props => {
  const { authStore, accountStore } = props.store
  const [ phoneNumber, setPhoneNumber ] = useState('')
  const [ areacode, setAreacode ] = useState('+1')
  
  const debouncedPhone = useRef(debounce(checkPhoneExistance, 800))
  const insets = useSafeAreaInsets()

  useEffect(() => {
    authStore.clear()
  }, [])

  useEffect(() => {
    if (authStore.areaCode) setAreacode(authStore.areaCode)
  }, [ authStore.areaCode ])

  function login() {
    authStore
      .login()
      .then(res => {
        if (!res.error) 
          props.navigation.navigate(accountStore.onboardingStep)
      })
  }

  function register() {
    props.navigation.navigate('Register')
  }

  function checkPhoneExistance(number) {
    authStore.checkPhoneNumber(number, areacode)
  }

  function onPhoneChange(phone)  {
    authStore.clearError()
    setPhoneNumber(phone)
    debouncedPhone.current(`${phone}`)
  }

  function onAreaCodeChange(areacode) {
    setAreacode(areacode)
    authStore.set('areaCode', areacode)
    checkPhoneExistance(phoneNumber)
  }

  function onChangeEmail(email) {
    authStore.clearError()
    authStore.set('email', email)
  }

  function onChangePass(pass) {
    authStore.clearError()
    authStore.set('password', pass)
  }

  function forgotPassword() {
    props.navigation.navigate('PasswordResetSendCode')
  }

  return (
    <KeyboardAvoidingView>
      <View style={[
        styles.wrapper,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom
        }
      ]}>
        <View>
          <View style={styles.head}>
            <Image 
              source={BRAND['versuz']}
              style={styles.image}
            />
            <View>
              <Link
                onPress={() => register()}
                underline>
                Register
              </Link>
            </View>
          </View>
          <View style={styles.body}>
            <Text style={titleStyles.onboardingTitle}>Welcome back</Text>
            <View style={styles.onboardingTitle}/>
            <View style={styles.radioGroup}>
              <Text style={textStyles.inputLabel}>I'M REGISTERED IN WITH</Text>
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
            </View>
            <View style={[styles.inputWrap]}>
              { authStore.verificationMethod === 'PHONE' ?
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
                  onChangeText={email => onChangeEmail(email)}
                  value={authStore.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  submitted={authStore.submitted}
                />
              }
            </View>
            <View style={styles.inputWrap}>
              <Input 
                label="PASSWORD"
                placeholder="Password"
                onChangeText={password => onChangePass(password)}
                value={authStore.password}
                autoCapitalize="none"
                secureTextEntry={true}
                error={authStore.passwordError}
                submitted={authStore.submitted}
              />
            </View>
          </View>
          <View style={styles.foot}>
            <Link
              height={50}
              onPress={() => forgotPassword()}
            >Forgot password</Link>
            <Button
              onPress={login}
              height={50}
              width={70}
              next
              loading={authStore.loading}
              disabled={!authStore.valid}
            >Login</Button>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

export default inject('store')(observer(Login))

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },
  head: {
    paddingLeft: 20,
    paddingRight: 20,
    height: 65,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  body: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  foot: {
    paddingLeft: 16,
    paddingRight: 30,
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: colors.SCORPION,
    paddingTop: 20,
  },
  inputWrap: {
    marginBottom: 20
  },
  radioGroup: {
    marginTop: 32,
    marginBottom: 32
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 16
  },
  image: {
    height: 35, 
    width: 55
  }
})