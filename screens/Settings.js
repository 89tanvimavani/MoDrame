import React from 'react'
import { View, StyleSheet, Switch, Linking, Alert } from 'react-native'
import Text from '../components/typography/Text'
import Link from '../components/typography/Link'
import KeyboardAvoidingScroll from '../components/layout/KeyboardAvoidingScroll'
import UploadAvatar from '../components/button/UploadAvatar'
import { inject, observer } from 'mobx-react'
import ProfileInput from '../components/input/ProfileInput'
import colors from '../constants/colors'
import {env} from '../config'
import DeviceInfo from 'react-native-device-info';
import SettingsHeader from '../components/settings-header/SettingsHeader'
import { useEffect, useState } from 'react'
import CountryPicker from '../components/country-picker/CountryPicker'
import { ICONS } from '../constants/images'
import TransparentButton from '../components/button/TransparentButton'
import InfoModal from '../components/modals/InfoModal'
import { USER_STATUS, SCREEN, VERIFICATION_METHOD } from '../constants/types'
import DatePicker_ from '../components/date-picker/DatePicker'

const Settings = (props) => {
  const { settingsStore, accountStore, authStore } = props.store

  const [ country, setCountry ] = useState('')
  const [ info, setInfo ] = useState('')
  const [ title, setTitleInfo ] = useState('')
  const [ openInfo, setOpenInfo ] = useState('')
  const [ openDatePicker, setOpenDatePicker] = useState(false)

  useEffect(() => {
    settingsStore.populate()
    setCountry(accountStore.user.country)
  }, [])

  function environment() {
    switch (env.ENV) {
      case 'DEBUG':
        return '(Development)'
      case 'STAGING':
        return '(Staging)'
      default:
        return ''
    }
  }

  function deleteUser() {
    Alert.alert(
      'You are requesting account termination.',
      'This is a one-way street, you will be logged out of the app and your account will be terminated. You won\'t be able to use Versuz with this account anymore.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Terminate account',
          style: 'destructive',
          onPress: () => authStore.terminateAccount(),
        },
      ],
      { cancelable: false }
    );
  }



  function onPushChange(e) {
    settingsStore.set('pushNotifications', e)
    settingsStore.updateSettings().then(res => {
      if (res.error) settingsStore.set('pushNotifications', !e)
    })
  }

  function onEmailChange(e) {
    settingsStore.set('emailNotifications', e)
    settingsStore.updateSettings().then(res => {
      if (res.error) settingsStore.set('emailNotifications', !e)
    })
  }

  function onCountryChange(e) {
    settingsStore.set('country', e)
    setCountry(e)
    settingsStore.updateSettings()
  }

  function updateEmail() {
    if (accountStore.user?.phone && accountStore.user.phoneVerif !== USER_STATUS.VERIFICATION
      && accountStore.user.emailVerif !== USER_STATUS.VERIFICATION)
      props.navigation.navigate('UpdateEmail')
    else if (accountStore.user.emailVerif === USER_STATUS.VERIFICATION) {
      settingsStore.set('verificationMethod', VERIFICATION_METHOD.EMAIL)
      props.navigation.navigate('Verification', { currentScreen: SCREEN.SETTINGS})
    } else {
      setTitleInfo('Add your phone number')
      setInfo('Please add and verify your phone number first. After that you can freely change your email address.')
      setOpenInfo(true)
    }
  }

  function updatePhone() {
    if (accountStore.user?.email && accountStore.user.emailVerif !== USER_STATUS.VERIFICATION 
      && accountStore.user.phoneVerif !== USER_STATUS.VERIFICATION) 
      props.navigation.navigate('UpdatePhone')
    else if (accountStore.user.phoneVerif === USER_STATUS.VERIFICATION) {
      settingsStore.set('verificationMethod', VERIFICATION_METHOD.PHONE)
      props.navigation.navigate('Verification', { currentScreen: SCREEN.SETTINGS})
    } else {
      setTitleInfo('Add your email address')
      setInfo('Please add and verify your email address first. After that you can freely change your phone number.')
      setOpenInfo(true)
    }
  }

  function logout() {
    authStore.logout()
  }

  function confirmDate(date) {
    setOpenDatePicker(false)
    settingsStore.set('birthday', date.toString())
    settingsStore.updateSettings()
  }

  return (
    <>
      <KeyboardAvoidingScroll
        menu={true}
      >
        <SettingsHeader 
          onBack={() => props.navigation.goBack()}
          title={"Edit profile"}
        />
        <View style={[
          styles.wrapper
        ]}>

          <UploadAvatar 
            src={accountStore.user?.avatar?.url}
            loading={accountStore.tempAvatar.loading}
            progress={accountStore.tempAvatar.progress}
            onChange={file => accountStore.changeAvatar(file)}
          />
          <ProfileInput 
            label="DISPLAY NAME"
            placeholder="Name"
            value={accountStore.user?.name}
            onPress={() => props.navigation.navigate('UpdateName')}
          />
          <ProfileInput 
            label="USERNAME"
            value={accountStore.user?.handle}
            onPress={() => props.navigation.navigate('UpdateUsername')}
          />
          <ProfileInput 
            label={ accountStore.user?.phoneVerif === USER_STATUS.VERIFICATION ? "PHONE (VERIFY)" : "PHONE NUMBER" }
            placeholder="Phone"
            value={accountStore.user?.phone}
            onPress={() => updatePhone()}
          />
          <ProfileInput 
            label={ accountStore.user?.emailVerif === USER_STATUS.VERIFICATION ? "EMAIL (VERIFY)" : "EMAIL ADDRESS" }
            placeholder="Email"
            value={accountStore.user?.email}
            maxWidth="50%"
            onPress={() => updateEmail()}
          />
          <ProfileInput 
            label="BIRTHDAY"
            notEditable={accountStore.user?.birthday}
            placeholder="Add birthday"
            value={accountStore.user?.birthdayFormatted}
            onPress={() => setOpenDatePicker(true)}
          />
          <CountryPicker
            onCountryChange={onCountryChange}
            country={country}
          />

          <View 
            style={styles.line}
          />

          <ProfileInput 
            label="WEBPAGE"
            maxWidth="50%"
            placeholder="Add webpage link"
            value={accountStore.user?.webpage}
            onPress={() => props.navigation.navigate('UpdateWebsite')}
          />
          <ProfileInput 
            label="BIO"
            multipleLines
            maxWidth="50%"
            placeholder="Add bio here"
            value={accountStore.user?.bio}
            onPress={() => props.navigation.navigate('UpdateBio')}
          />

          <View 
            style={styles.line}
          />

          <View style={styles.toggle}>
            <Text style={styles.toggleLabel}>Push notifications</Text>
            <Switch 
              thumbColor={settingsStore.pushNotifications ? colors.LIGHTNING_YELLOW : colors.WHITE}
              trackColor={{true: colors.WHITE, false: colors.TUNDORA}}
              ios_backgroundColor={colors.WHITE}
              value={settingsStore.pushNotifications}
              onValueChange={onPushChange}
            />
          </View>
          <View style={styles.toggle}>
            <Text style={styles.toggleLabel}>Email notifications</Text>
            <Switch 
              thumbColor={settingsStore.emailNotifications ? colors.LIGHTNING_YELLOW : colors.WHITE}
              trackColor={{true: colors.WHITE, false: colors.TUNDORA}}
              ios_backgroundColor={colors.WHITE}
              value={settingsStore.emailNotifications}
              onValueChange={onEmailChange}
            />
          </View>

          <View 
            style={styles.line}
          />

          <View style={styles.logoutWrapper}>
            <TransparentButton
              icon={ICONS['logout']}
              iconOnTheLeft
              borderWidth={1}
              borderColor={colors.WHITE}
              borderRadius={20}
              width={150}
              onPress={logout}
            >LOGOUT</TransparentButton>
          </View>

          <View 
            style={styles.line}
          />
          
          <View style={styles.linkWrapper}>
            <Link
              fontSize={18}
              open
              onPress={() => Linking.openURL('https://versuz.app/privacy-policy.html')}
            >Frequently asked questions</Link>
          </View>
          <View style={styles.linkWrapper}>
            <Link
              fontSize={18}
              open
              onPress={() => Linking.openURL('https://versuz.app/privacy-policy.html')}
            >Privacy Policy</Link>
          </View>
          <View style={styles.linkWrapper}>
            <Link
              fontSize={18}
              open
              onPress={() => Linking.openURL('https://versuz.app/terms-of-use.html')}
            >Terms</Link>
          </View>
          <View style={styles.linkWrapper}>
            <Link
              onPress={() => Linking.openURL('mailto:hello@versuz.app')}
              open
              fontSize={18}
            >Contact us</Link>
          </View>
          <View style={styles.linkWrapper}>
            <Link
              onPress={() => deleteUser()}
              open
              fontSize={18}
            >Request account deletion</Link>
          </View>
          <View style={styles.center}>
            <Text style={styles.version}>
              Version {DeviceInfo.getVersion()}.{DeviceInfo.getBuildNumber()} {environment()}
            </Text>
          </View>
        </View>
      </KeyboardAvoidingScroll>
      <DatePicker_
        label="Birthday"
        open={openDatePicker}
        closeDatePicker={() => setOpenDatePicker(false)}
        openDatePicker={() => setOpenDatePicker(true)}
        confirmDate={confirmDate}
        date={settingsStore.birthday}
      />
      <InfoModal
        info={info}
        title={title}
        open={openInfo}
        onRequestClose={() => setOpenInfo(false)}
      />
    </>
  )
}

export default inject('store')(observer(Settings))

const styles = StyleSheet.create({
  wrapper: {
    paddingLeft: 16,
    paddingRight: 16
  },
  title: {

  },
  head: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30
  },
  linkWrapper: {
    marginBottom: 25,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutWrapper: {
    marginBottom: 10,
    marginTop: 10
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  version: {
    color: colors.GRAY,
    marginTop: 20,
    marginBottom: 20,
    fontSize: 12
  },
  line: {
    height: 1,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: colors.DOVE_GRAY,
    marginBottom: 20,
    marginTop: 20
  },
  toggle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    color: colors.WHITE
  }
})