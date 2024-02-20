import React, { useState, useEffect } from 'react'
import {
  View, 
  StyleSheet,
} from 'react-native'
import {
  inject, observer
} from 'mobx-react'
import Input from '../components/input/Input'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Text from '../components/typography/Text'
import { textStyles, titleStyles } from '../styles-main/texts'
import colors from '../constants/colors'
import Code from '../components/code/Code'
import KeyboardAvoidingView from '../components/layout/KeyboardAvoidingView'
import { VERIFICATION_METHOD, SCREEN } from '../constants/types'

const Verification = props => {
  const insets = useSafeAreaInsets()

  const { accountStore, settingsStore } = props.store

  const [ error, setError ] = useState('')
  const [ phone, setPhone ] = useState('')
  const [ email, setEmail ] = useState('')
  const [ verificationMethod, setVerifMethod ] = useState('')

  useEffect(() => {
    if (props.route.params?.currentScreen === SCREEN.SETTINGS) {
      setVerifMethod(settingsStore.verificationMethod)
      setEmail(settingsStore.email)
      setPhone(settingsStore.phone)
    } else {
      setVerifMethod(accountStore.user.verificationMethod)
      setEmail(accountStore.user.email)
      setPhone(accountStore.user.phone)
    }
  }, [])

  function go(code) {
    if (props.route.params?.currentScreen === SCREEN.SETTINGS || 
      props.route.params?.currentScreen === SCREEN.HOME) {
      settingsStore.verify(code.join(''))
        .then(res => {
          if (res.error) {
            if (res.data?.message) setError(res.data?.message)
            else setError('Oops, something went wrong.')
          } else {
            setError('')
            if (props.route.params?.currentScreen === SCREEN.SETTINGS) 
              props.navigation.navigate('PROFILE', { screen: 'Settings'})
            else props.navigation.navigate('HOME', {
              scrollTop: true
          })
          }
        })
    } else {
      accountStore.verify(code.join(''))
        .then(res => {
          if (res.error) {
            if (res.data?.message) setError(res.data?.message)
            else setError('Oops, something went wrong.')
          }
        })
    }
  }

  function resend() {
    setError('')
    if (props.route.params?.currentScreen === SCREEN.SETTINGS ||
      props.route.params?.currentScreen === SCREEN.HOME) settingsStore.resend()
    else accountStore.resend()
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
          <View style={styles.body}>
            <Text style={titleStyles.onboardingTitle}>
              { verificationMethod === VERIFICATION_METHOD.PHONE ?
                'Please verify your phone' :
                'Please verify your email'
              }
            </Text>
            <Text style={[textStyles.inputInfo, styles.input]}>
              { verificationMethod === VERIFICATION_METHOD.PHONE ?
                'We have send you a verification code to your phone number below.' :
                'We have send you a verification code to your email address below.'
              }
            </Text>
            <View>
              { verificationMethod === VERIFICATION_METHOD.PHONE ?
                <Input 
                  label="PHONE NUMBER"
                  placeholder="Phone"
                  value={phone}/> :
                <Input 
                  label="EMAIL"
                  placeholder="Email"
                  value={email}/>
              }
            </View>
          </View>
        </View>

        <Code 
          onChange={go}
          error={error}
          resend={resend}
        />

      </View>
    </KeyboardAvoidingView>
  )
}

export default inject('store')(observer(Verification))

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  head: {
    paddingLeft: 20,
    paddingRight: 20,
    height: 65,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  body: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 16,
    paddingBottom: 80
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
  input: {
    marginTop: 15, 
    marginBottom: 15
  }
})