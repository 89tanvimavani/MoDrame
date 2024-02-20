import axios from "axios"
import { getRoot, types } from "mobx-state-tree"
import { USER_STATUS, VERIFICATION_METHOD } from "../../constants/types"
import { api_login, api_logout, api_resend, api_terminate_account, api_verify, api_verify_phone } from "../../queries/auth"
import PasswordReset from "../../screens/PasswordReset"
import { _throw } from "../../services/error-service"

const AuthStore = types
  .model('AuthStore', {
    token: types.maybeNull(types.string),
    
    email: types.optional(types.string, ''),
    phone: types.optional(types.string, ''),
    areaCode: types.optional(types.string, ''),

    password: types.optional(types.string, ''),
    verificationMethod: 'PHONE',

    // password reset
    newPassword: types.optional(types.string, ''),
    code: types.optional(types.string, ''),

    authError: types.frozen(),
    onboardingStatus: types.maybeNull(types.string),

    verifyingPhone: false,
    loading: false,
    submitted: false
  })
  .views(self => ({
    get authenticated() {
      return self.token
    },
    get followupOnboarding() {
      return self.onboardingStatus === 'PROFILE_PICTURE'
    },
    get validEmail() {
      if (self.verificationMethod === 'PHONE') return true

      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(self.email).toLowerCase());
    },
    get validPhone() {
      if (self.verificationMethod === 'EMAIL') return true
      return self.phone
    },
    get validPassword() {
      return self.password
    },
    get valid() {
      return self.validEmail && self.validPhone && self.validPassword
    },
    get validNewPassword() {
      return self.newPassword
    },
    get validCode() {
      return self.code.length === 6
    },
    get allowResendCode() {
      return self.validEmail && self.validPhone
    },
    get validPasswordReset() {
      return self.validCode && self.validNewPassword
    },
    // errors
    get passwordError() {
      if (self.authError?.message) return self.authError.message
      if (self.authError) return 'Ooops, try again please.'
      return null
    },
    get phoneError() {
      if (self.validPhone) return null
      else return `The number is not valid.`
    },
    get usersFactory() {
      return getRoot(self).usersFactory
    },
    get accountStore() {
      return getRoot(self).accountStore
    },
    get settingsStore() {
      return getRoot(self).settingsStore
    }
  }))
  .actions(self => ({
    async checkPhoneNumber(phone) {
      try {
        self.set('verifyingPhone', true)

        if(!self.areaCode) self.set('areaCode', '+1')
        const res = await api_verify_phone(`${self.areaCode}${phone}`)

        if (res.error || !res.valid) throw res

        self.set('phone', `${res.phone}`)
        
        self.set('verifyingPhone', false)
        return res.data
        
      } catch (err) {
        self.set('verifyingPhone', false)
        self.set('phone', '')
        return err
      }
    },
    async login() {

      try {

        self.set('loading', true)
        self.set('sumbitted', true)

        self.resetOnboardingStatus()

        let data = {
          password: self.password
        };

        if (self.verificationMethod === 'PHONE') data = { ...data, phone: self.phone }
        else data = { ...data, email: self.email }

        const res = await api_login(data)
        if (res.error) throw res

        const { user, token } = res.data

        self.updateSettings(user.settings)

        const userId = self.usersFactory.addUpdateUser(user)

        self.accountStore.set('user', userId)

        if ((user?.emailVerif === USER_STATUS.ACTIVE && 
          self.verificationMethod === 'EMAIL') || 
          (user?.phoneVerif === USER_STATUS.ACTIVE && 
          self.verificationMethod === 'PHONE')) self.authenticate(token)

        self.accountStore.setOneSignalId()
        getRoot(self).getInitialData()

        self.set('loading', false)
        self.settingsStore.set('areaCode', self.areaCode)

        return res

      } catch (err) {
        self.set('loading', false)
        self.set('authError', err.data)
        return {
          error: true,
          ...err
        }
      }
    },
    async passwordReset() {
      try {
        self.set('loading', true)
        let data = {
          code: self.code
        }

        self.resetOnboardingStatus()

        if (self.verificationMethod === VERIFICATION_METHOD.PHONE) data = {...data, phone: self.phone}
        else data = {...data, email: self.email}
        const res = await api_verify({
          ...data,
          password: self.newPassword
        })

        if (res.error) throw res

        const { user, token } = res.data
        self.updateSettings(user.settings)

        const userId = self.usersFactory.addUpdateUser(user)
        self.accountStore.set('user', userId)

        if (user.status === USER_STATUS.ACTIVE) self.authenticate(token)

        self.set('loading', false)

        return res.data
      } catch (err) {
        self.set('loading', false)
        return {
          ...err,
          error: true
        }
      }
    },
    async resendCode() {
      try {
        self.set('loading', true)
        let data = {
          email: self.email
        }
        if (self.verificationMethod === VERIFICATION_METHOD.PHONE) data = {phone: self.phone}

        const res = await api_resend(data)
        if (res.error) throw res
        
        self.set('loading', false)
        return res.data
      } catch (err) {
        self.set('loading', false)
        return {
          ...err,
          error: true
        }
      }
    },
    authenticate(token) {
      self.set('token', token)
    },
    clearError() {
      self.set('authError', null)
    },
    updateSettings(settings) {
      self.settingsStore.update(settings)
    },
    resetOnboardingStatus() {
      self.set('onboardingStatus', null)
    },
    clear() {
      self.set('verificationMethod', 'PHONE')
      self.set('email', '')
      self.set('phone', '')
      self.set('password', '')
      self.set('code', '')
      self.set('newPassword', '')
      self.set('onboardingStatus', null)
      self.set('verifyingPhone', false)
      self.set('loading', false)
      self.set('submitted', false)
    },

    logout() {
      api_logout(self.token)
      self.set('token', null)
      self.accountStore.clear()
      setTimeout(() => getRoot(self).resetStore(), 500)
    },
    terminateAccount() {
      api_logout(self.token)
      api_terminate_account(self.token)
      self.set('token', null)
      self.accountStore.clear()
      setTimeout(() => getRoot(self).resetStore(), 500)
    },
    set(key, value) {
      self[key] = value
    }
  }))

export default AuthStore