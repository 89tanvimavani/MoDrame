import { inject, observer } from 'mobx-react'
import React, { useState, useRef, useEffect } from 'react'
import { View, StyleSheet, Image, Linking } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Input from '../components/input/Input'
import PhoneInput from '../components/input/PhoneInput'
import KeyboardAvoidingScroll from '../components/layout/KeyboardAvoidingScroll'
import Radio from '../components/radio/Radio'
import Link from '../components/typography/Link'
import Text from '../components/typography/Text'
import colors from '../constants/colors'
import { textStyles, titleStyles } from '../styles-main/texts'
import debounce from 'lodash/debounce'
import { BRAND } from '../constants/images'
import { useIsFocused } from '@react-navigation/native'
import Button from '../components/button/Button'
import DatePicker_ from '../components/date-picker/DatePicker'

const Register = props => {
  const insets = useSafeAreaInsets()
  const isFocused = useIsFocused()
  const debounced = useRef(debounce(checkExistance, 300))
  const debouncedPhone = useRef(debounce(checkPhoneExistance, 800))

  const { onboardingStore, accountStore } = props.store

  const [ handle, setHandle ] = useState('')
  const [ openDatePicker, setOpenDatePicker] = useState(false)
  const [ phoneNumber, setPhoneNumber ] = useState('')
  const [ areacode, setAreacode ] = useState('+1')

  useEffect(() => {
    if (isFocused)
      onboardingStore.clear()
  }, [ isFocused ])

  function next() {
    onboardingStore.register()
      .then(res => {
        if (!res.error) 
          props.navigation.navigate(accountStore.registerStep)
      })
  }

  function checkPhoneExistance(number) {
    onboardingStore.checkPhoneNumber(number)
  } 

  function checkExistance(value) {
    onboardingStore.checkHandle(value)
  }

  function onPhoneChange(phone) {
    setPhoneNumber(phone)
    debouncedPhone.current(`${phone}`)
  }

  function onAreaCodeChange(areacode) {
    setAreacode(areacode)
    onboardingStore.set('areaCode', areacode)
    checkPhoneExistance(phoneNumber)
  }

  function onUsernameChange(handle) {
    setHandle(handle)
    debounced.current(handle)
  }

  function openPrivacyPolicy() {
    Linking.openURL('https://versuz.app/privacy-policy.html')
  }

  function confirmDate(date) {
    setOpenDatePicker(false)
    if (date)
      onboardingStore.set('birthday', date.toString())
    else onboardingStore.set('birthday', '')
  }

  return (
    <KeyboardAvoidingScroll>
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
                onPress={() => props.navigation.navigate('Login')}
                underline>
                Log in
              </Link>
            </View>
          </View>
          <View style={styles.body}>
            <Text style={titleStyles.onboardingTitle}>Let's create you a profile</Text>
            <View style={[styles.inputWrap, {paddingTop: 20}]}>
              <Input 
                required
                label="USERNAME"
                info="Unique identifier"
                placeholder="Your username"
                onChangeText={handle => onUsernameChange(handle)}
                value={handle}
                autoCapitalize="none"
                error={onboardingStore.handleError}
                submitted={onboardingStore.submitted}
              />
            </View>
            <View style={styles.inputWrap}>
              <Input 
                required
                label="DISPLAY NAME"
                info="This will be shown on your profile page"
                placeholder="Display name"
                onChangeText={name => onboardingStore.set('name', name)}
                value={onboardingStore.name}
                autoCapitalize="none"
                submitted={onboardingStore.submitted}
                maxLength={30}
              />
            </View>
            <View style={styles.inputWrap}>
              <DatePicker_
                label="Birthday"
                enableDelete
                showInput={true}
                open={openDatePicker}
                confirmDate={confirmDate}
                closeDatePicker={() => setOpenDatePicker(false)}
                openDatePicker={() => setOpenDatePicker(true)}
                date={onboardingStore.birthday}
                info="Add to win birthday prizes. Not required."
              />
            </View>
            <View style={styles.radioGroup}>
              <Text style={textStyles.inputLabel}>VERIFICATION METHOD (required)</Text>
              <View style={styles.row}>
                <Radio 
                  onPress={() => onboardingStore.set('verificationMethod', 'PHONE')}
                  label="Phone"
                  active={onboardingStore.verificationMethod === 'PHONE'}
                />
                <View style={{ width: 20 }}/>
                <Radio 
                  onPress={() => onboardingStore.set('verificationMethod', 'EMAIL')}
                  label="Email"
                  active={onboardingStore.verificationMethod === 'EMAIL'}
                />
              </View>
            </View>
            {onboardingStore.verificationMethod === 'PHONE' ?
              <View style={styles.inputWrap}>
                <PhoneInput
                  required
                  label="PHONE NUMBER"
                  placeholder="Phone"
                  onPhoneChange={(phone) => onPhoneChange(phone)}
                  onAreaCodeChange={(areacode) => onAreaCodeChange(areacode)}
                  value={phoneNumber}
                  areacode={areacode}
                  keyboardType="phone-pad"
                  submitted={onboardingStore.submitted}
                  loading={onboardingStore.verifyingPhone}
                  error={onboardingStore.phoneError}
                />
              </View>
            :
              <View style={styles.inputWrap}>
                <Input 
                  required
                  label="EMAIL"
                  info="We will use this only for verification."
                  placeholder="Email"
                  onChangeText={phone => onboardingStore.set('email', phone)}
                  value={onboardingStore.email}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  error={onboardingStore.emailError}
                  submitted={onboardingStore.submitted}
                />
              </View>
            }
            <View style={styles.inputWrap}>
              <Input 
                required
                label="PASSWORD"
                info="Try not to use your birthday"
                placeholder="Password"
                onChangeText={password => onboardingStore.set('password', password)}
                value={onboardingStore.password}
                autoCapitalize="none"
                secureTextEntry={true}
                error={onboardingStore.passwordError}
                submitted={onboardingStore.submitted}
              />
            </View>
          </View>
        </View>
        <View style={styles.foot}>
          <View style={styles.terms}>
            <Text style={[textStyles.inputInfo, styles.text]}>
              By Signing in you agree to our{'\u00A0'}
            </Text>
            <Link
              underline
              fontSize={14}
              onPress={() => openPrivacyPolicy()}
            >Terms</Link>
            <Text style={textStyles.inputInfo}>{'\u00A0'}and{'\u00A0'}</Text>
            <Link
              underline
              fontSize={14}
              onPress={() => openPrivacyPolicy()}
            >Privacy Policy</Link>
          </View>
          <View style={styles.button}>
            <Button
              onPress={next}
              height={50}
              width={120}
              next
              disabled={!onboardingStore.valid}
              loading={onboardingStore.loading}
            >Save and go</Button>
          </View>
        </View>
      </View>
    </KeyboardAvoidingScroll>
  )
}

export default inject('store')(observer(Register))

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
    paddingLeft: 30,
    paddingRight: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    borderTopWidth: 1,
    borderColor: colors.SCORPION,
    paddingTop: 20,
    maxHeight: 150
  },
  terms: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    maxWidth: 250,
    marginBottom: 8
  },
  inputWrap: {
    marginBottom: 20
  },
  radioGroup: {
    marginBottom: 32,
    marginTop: 8
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 16
  },
  button: {
    alignSelf: 'flex-end',
    marginBottom: 8,
    marginTop: 15
  },
  text: { 
    textAlign: 'center', 
    lineHeight: 20 
  },
  image: { 
    height: 35, 
    width: 55
  }
})