import { getRoot, types } from "mobx-state-tree"
import { api_check_version, api_update_settings } from "../../queries/settings"
import { api_find_handle, api_verify, api_verify_phone, api_resend } from "../../queries/auth"
import DeviceInfo from 'react-native-device-info';
import { VERIFICATION_METHOD, ERROR_TYPE, USER_STATUS } from "../../constants/types";

const SettingsStore = types
  .model('SettingsStore', {
    name: types.maybeNull(types.string),
    handle: types.maybeNull(types.string),
    email: types.maybeNull(types.string),
    phone: types.maybeNull(types.string),
    areaCode: types.maybeNull(types.string),
    country: types.maybeNull(types.string),
    webpage: types.maybeNull(types.string),
    bio: types.maybeNull(types.string),
    birthday: types.maybe(types.string),
    
    pushNotifications: types.maybeNull(types.boolean),
    emailNotifications: types.maybeNull(types.boolean),
    
    verificationMethod: types.maybeNull(types.string),
    authError: types.frozen(),
    
    phoneValid: true,
    loading: false,
    submitted: false,
    verifyingPhone: false,
    freeHandle: true
  })
  .views(self => ({
    get accountStore() {
      return getRoot(self).accountStore
    },
    get guiStore() {
      return getRoot(self).guiStore
    },
    get authStore() {
      return getRoot(self).authStore
    },
    get token() {
      return getRoot(self).authStore.token
    },
    get validHandle() {
      const regex = /^[a-zA-Z0-9]*$/
      return regex.test(self.handle)
    },
    get validEmail() {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(self.email).toLowerCase())
    },
    get validUrl() {
      var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i') // fragment locator
      return !!pattern.test(self.webpage)
    },
    //errors
    get handleError() {
      if (self.handle.length < 2) return 'Handle is too short.'
      if (!self.freeHandle) return 'This handle is already taken.'
      if (!self.validHandle) return 'Only letters and numbers are allowed. No special characters or empty spaces.'
      else return null
    }
  }))
  .actions(self => ({
    clearError() {
      self.set('error', null)
    },
    populate() {
      self.set('name', self.accountStore.user.name)
      self.set('handle', self.accountStore.user.handle)
      self.set('email', self.accountStore.user.email)
      self.set('phone', self.accountStore.user.phone)
      self.set('areaCode', self.accountStore.user.phoneCountryCode)
      self.set('country', self.accountStore.user.country)
      self.set('webpage', self.accountStore.user.webpage)
      self.set('bio', self.accountStore.user.bio)
    },
    update(settings) {
      self.set('pushNotifications', settings.pushNotifications)
      self.set('emailNotifications', settings.emailNotifications)
    },
    async updateSettings() {
      try { 
        self.set('loading', true)

        const os = Platform.OS

        const version = `${DeviceInfo.getVersion()}${DeviceInfo.getBuildNumber()}`.replace('.', '')
        
        const res = await api_update_settings(self.token, {
          newUser: {
            firstName: '',
            lastName: '',
            name: self.name,
            handle: self.handle,
            country: self.country,
            webpage: self.webpage,
            birthday: self.birthday,
            bio: self.bio,
            appVersion: parseInt(version),
            platform: `${os}`,
            pushNotifications: self.pushNotifications,
            emailNotifications: self.emailNotifications
          }
        })

        self.set('loading', false)

        if (res.error) throw res

        self.checkForUpdate(res?.data?.supportedVersion)
        self.accountStore.populate()

        return res.data
      } catch (err) {
        if (err.data.CODE !== ERROR_TYPE.EMAIL_TAKEN && err.data.CODE !== ERROR_TYPE.PHONE_TAKEN) self.populate()
        return {
          ...err,
          error: true
        }
      }
    },
    async updatePhone() {
      try { 
        self.set('loading', true)

        const os = Platform.OS

        const version = `${DeviceInfo.getVersion()}${DeviceInfo.getBuildNumber()}`.replace('.', '')

        const res = await api_update_settings(self.token, {
          newUser: {
            phone: self.phone,
            appVersion: parseInt(version),
            platform: `${os}`
          }
        })

        if (res.error) throw res

        self.checkForUpdate(res?.data?.supportedVersion)
        self.accountStore.user.set('phoneVerif', USER_STATUS.VERIFICATION)
        self.accountStore.populate()
        self.set('loading', false)

        return res.data
      } catch (err) {
        self.set('loading', false)
        if (err.data.CODE !== ERROR_TYPE.PHONE_TAKEN) self.populate()
        return {
          ...err,
          error: true
        }
      }
    },
    async updateEmail() {
      try { 
        self.set('loading', true)

        const os = Platform.OS

        const version = `${DeviceInfo.getVersion()}${DeviceInfo.getBuildNumber()}`.replace('.', '')

        const res = await api_update_settings(self.token, {
          newUser: {
            email: self.email,
            appVersion: parseInt(version),
            platform: `${os}`
          }
        })

        if (res.error) throw res

        self.checkForUpdate(res?.data?.supportedVersion)
        self.accountStore.user.set('emailVerif', USER_STATUS.VERIFICATION)
        self.accountStore.populate()
        self.set('loading', false)

        return res.data
      } catch (err) {
        self.set('loading', false)
        if (err.data.CODE !== ERROR_TYPE.EMAIL_TAKEN) self.populate()
        return {
          ...err,
          error: true
        }
      }
    },
    async checkHandle(handle) {
      try {
        const res = await api_find_handle({
          handle
        })
        if (res.error) throw res
        
        self.set('freeHandle', res.data.freeHandle)
        
        if (!res.data.freeHandle) throw res

        self.set('handle', handle)
        return res
        
      } catch (err) {
        return err
      }
    },
    async verify(code) {
      try {
        let data = {
          code
        }

        if (self.verificationMethod === VERIFICATION_METHOD.EMAIL) 
          data = { ...data, email: self.email }
        else data = { ...data, phone: self.phone }

        const res = await api_verify(data)
        if (res.error) throw res

        const { user, token } = res.data

        self.accountStore.user.update(user) 
        self.authStore.authenticate(token)
        self.accountStore.setOneSignalId() 

        return res
      } catch (err) {
        return {
          error: true,
          ...err
        }
      }
    },
    async checkPhoneNumber(phone) {
      try { 
        self.set('verifyingPhone', true)
        
        if(!self.areaCode) self.set('areaCode', '+1')
 
        const res = await api_verify_phone(`${self.areaCode}${phone}`)

        if (res.error) {
          self.set('phoneValid', false)
          self.set('error', 'Something went wrong. Please try again.') 
          throw res
        }

        if (res.valid === false) {
          self.set('phoneValid', false)
          self.set('error', 'Phone number is invalid.') 
          throw res
        }

        self.set('phone', `${res.phone}`)
        self.set('phoneValid', true)
        self.set('verifyingPhone', false)
        return res
      } catch (err) {
        self.set('verifyingPhone', false)
        return err
      }
    },
    async resend() {
      if (self.verificationMethod === VERIFICATION_METHOD.EMAIL) {
        self.authStore.set('verificationMethod', VERIFICATION_METHOD.EMAIL)
        self.authStore.set('email', self.email)
      } else {
        self.authStore.set('verificationMethod', VERIFICATION_METHOD.PHONE)
        self.authStore.set('phone', self.phone)
        self.authStore.set('areaCode', self.areaCode)
      }
      self.authStore.resendCode()
    },
    async checkSupported() {
      try { 
        const os = Platform.OS
        const version = `${DeviceInfo.getVersion()}${DeviceInfo.getBuildNumber()}`.replace('.', '')

        const res = await api_check_version(self.token, { 
          appVersion: version,
          platform: `${os}`})
        if (res.error) throw res

        self.checkForUpdate(res?.data?.supportedVersion)

        return res.data
      } catch (err) {
        return {
          ...err,
          error: true
        }
      }
    },
    checkForUpdate(supportedVersion) {
      if (!supportedVersion) 
        self.guiStore.set('outdatedApp', true)
      else self.guiStore.set('outdatedApp', false)
    },
    set(key, value) {
      self[key] = value
    },
  }))

export default SettingsStore