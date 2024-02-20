import { getRoot, types } from "mobx-state-tree";
import { api_signup_email, api_signup_phone, api_find_handle, api_verify_phone } from "../../queries/auth";
import DeviceCountry from 'react-native-device-country'
import { logRegister } from "../../services/log-event-service";

const OnboardingStore = types
  .model('OnboardingStore', {
    handle: types.optional(types.string, ''),
    name: types.optional(types.string, ''),
    phone: types.optional(types.string, ''),
    areaCode: types.optional(types.string, ''),
    country: types.optional(types.string, ''),
    birthday: types.optional(types.string, ''),

    email: types.optional(types.string, ''),
    password: types.optional(types.string, ''),
    verificationMethod: 'PHONE',

    loading: false,
    verifyingPhone: false,
    onboardingError: types.frozen(),
    submitted: false,
    freeHandle: true
  })
  .views(self => ({
    get validEmail() {
      if (self.verificationMethod === 'PHONE') return true

      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(self.email).toLowerCase());
    },
    get validName() {
      return self.name
    },
    get nameWhiteSpacesOnly() {
      if(!self.name?.trim()) return true
      else return false
    },
    get validPhone() {
      if (self.verificationMethod === 'EMAIL') return true
      return self.phone
    },
    get validHandle() {
      const regex = /^[a-zA-Z0-9]*$/
      return regex.test(self.handle)
    },
    get validPassword() {
      const emptyspace = /\s/;
      if (self.password.length < 5) return false
      if (emptyspace.test(self.password)) return false
      return self.password
    },
    get valid() {
      return (
        self.validHandle &&
        self.validName &&
        self.validPhone &&
        self.validEmail &&
        self.validPassword
      )
    },
    // errors
    get handleError() {
      if (!self.freeHandle) return 'This handle is already taken'
      if (!self.validHandle) return 'Only letters and numbers are allowed. No special characters or empty spaces.'
      else return null
    },
    get nameError() {
      if (!self.validName) 
        return "Display name is required."
      if (self.nameWhiteSpacesOnly) 
        return "Name can not contain white spaces only."
      if (self.name.length > 30) return "Use less than 30 characters."
      else return null
    },
    get phoneError() {
      if (self.onboardingError?.group === 'SIGNUP_PHONE')
        return self.onboardingError.message
      if (!self.validPhone) 
        return "Not a valid phone number"
      else return null
    },
    get emailError() {
      if (self.onboardingError?.group === 'SIGNUP_EMAIL')
        return self.onboardingError.message
      if (!self.validEmail) 
        return "Not a valid email address"
      else return null
    },
    get passwordError() {
      if (!self.validPassword)
        return `Password needs to be at least 5 chars long. Can't contain empty spaces.`
      else if (self.onboardingError && !self.onboardingError.group) return 'Ooops, something went wrong, please try again.'
      else return null
    },
    // shortcuts
    get usersFactory() {
      return getRoot(self).usersFactory
    },
    get accountStore() {
      return getRoot(self).accountStore
    },
    get authStore() {
      return getRoot(self).authStore
    },
    get settingsStore() {
      return getRoot(self).settingsStore
    }
  }))
  .actions(self => ({    
    set(key, value) {
      self[key] = value
    },
    async register() {
      try {
        self.set('loading', true)
        self.authStore.set('onboardingStatus', 'PROFILE_PICTURE')
        self.set('submitted', true)

        await DeviceCountry.getCountryCode()
          .then((result) => {
            self.set('country', result.code)
          })
          .catch((e) => {
            throw e
          });
        
        const data = {
          handle: self.handle,
          name: self.name,
          password: self.password,
          country: self.country,
          ...self.verificationMethod === 'PHONE' ? {
            phone: self.phone
          } : {
            email: self.email
          }
        }

        if (self.birthday.length > 0)
          data.birthday = self.birthday
        
        let res;
        if (self.verificationMethod === 'PHONE') {
          res = await api_signup_phone(data) 
        } else 
          res = await api_signup_email(data)
        if (res.error) throw res

        logRegister(self.verificationMethod)

        // push new user to the users factory

        const { user } = res.data

        self.authStore.updateSettings(user.settings)

        const userId = self.usersFactory.addUpdateUser(user)

        self.accountStore.set('user', userId)

        self.accountStore.setOneSignalId()
        getRoot(self).getInitialData()

        self.set('loading', false)
        self.settingsStore.set('areaCode', self.areaCode)
        return res

      } catch (err) {
        self.set('loading', false)
        self.set('onboardingError', err.data)
        return {
          error: true,
          ...err
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
        self.set('handle', '')
        return err
      }
    },
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
        return err
      }
    },
    clear() {
      self.set('handle', '')
      self.set('name', '')
      self.set('phone', '')
      self.set('email', '')
      self.set('password', '')
      self.set('country', '')
      self.set('verificationMethod', 'PHONE')
      self.set('loading', false)
      self.set('verifyingPhone', false)
      self.set('onboardingError', null)
      self.set('submitted', false)
      self.set('freeHandle', true)
    }
  }))


export default OnboardingStore