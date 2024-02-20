import React, { useState, useRef } from 'react'
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
import Link from '../components/typography/Link'
import colors from '../constants/colors'
import Code from '../components/code/Code'
import KeyboardAvoidingView from '../components/layout/KeyboardAvoidingView'
import Toast from 'react-native-toast-message'
import { WIDTH } from '../constants/mesures'
import Button from '../components/button/Button'

const PasswordReset = props => {
  const insets = useSafeAreaInsets()

  const [ error, setError ] = useState(false)

  const { authStore, accountStore } = props.store


  function go(c) {
    authStore.set('code', c.join(''))
  }

  function save() {
    authStore.passwordReset()
      .then(res => {
        if (!res.error) {
          setError(null)
          props.navigation.navigate(accountStore.onboardingStep)  
        }
        else setError("Wrong verification code")
      })
  }

  function resend() {
    authStore.resendCode()
  }
  
  function codeSentTo() {
    return authStore.verificationMethod === 'PHONE' ? authStore.phone : authStore.email
  }

  function onDisabledPress() {
    if (!authStore.newPassword)
      Toast.show({
        type: 'error',
        text1: `Password missing`,
        text2: 'Please enter your new password'
      })
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
            <View>
              <Link
                onPress={() => props.navigation.goBack()}
                underline
              >Back</Link>
            </View>
          </View>
          <View style={styles.body}>
            <Text style={[titleStyles.onboardingTitle, {
              maxWidth: WIDTH/2
            }]}>Forgot password</Text>
            <View style={styles.onboardingTitle}/>
            <Text style={[textStyles.inputInfo, styles.input]}>
              We have send you a verification code to {codeSentTo()}
            </Text>
            <View style={styles.inputWrap}>
              <Input 
                label="NEW PASSWORD"
                placeholder="New password"
                onChangeText={password => authStore.set('newPassword', password)}
                value={authStore.newPassword}
                secureTextEntry={true}
                autoCapitalize="none"
              />
            </View>
          </View>

          <Code 
            onChange={go}
            error={error}
            resend={resend}
          />

          <View style={styles.foot}>
            <Button 
              onPress={save}
              height={50}
              next
              disabled={!authStore.validPasswordReset}
              onDisabledPress={onDisabledPress}
            >Save</Button>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

export default inject('store')(observer(PasswordReset))

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between'
  },
  head: {
    paddingLeft: 20,
    paddingRight: 20,
    height: 35,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row'
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
  inputWrap: {
    marginBottom: 20
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
  input: { 
    marginTop: 15, 
    marginBottom: 15 
  }
})