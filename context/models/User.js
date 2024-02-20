import { getRoot, types } from "mobx-state-tree"
import Asset from './Asset'
import { USER_STATUS, VERIFICATION_METHOD } from "../../constants/types"
import { COUNTRYCODES } from "../../data/areacodes"
import Zodiac from "./Zodiac"

const User = types
  .model('User', {
    id: types.identifierNumber,
    handle: types.string,
    email: types.maybeNull(types.string),
    phone: types.maybeNull(types.string),
    birthday: types.maybeNull(types.string),
    name: types.maybeNull(types.string),
    country: types.maybeNull(types.string),
    phoneCountryCode: types.maybeNull(types.string),
    status: types.maybeNull(types.string),
    emailVerif: types.maybeNull(types.string),
    phoneVerif: types.maybeNull(types.string),
    webpage: types.maybeNull(types.string),
    bio: types.maybeNull(types.string),
    zodiac: types.maybeNull(
      types.optional(Zodiac, {})),
    avatar: types.maybeNull(
      types.optional(Asset, {})),
    blocked: false
  })
  .views(self => ({
    get verificationMethod() {
      if (self.emailVerif === USER_STATUS.VERIFICATION) return VERIFICATION_METHOD.EMAIL
      if (self.phoneVerif === USER_STATUS.VERIFICATION) return VERIFICATION_METHOD.PHONE
    },
    get countryLink() {
      return "https://flagcdn.com/48x36/" + self.country.toLowerCase() + ".png"
    },
    get phoneCountryCodeNum() {
      for (let key in COUNTRYCODES) {
        if (COUNTRYCODES[key].value === self.phoneCountryCode)
        return COUNTRYCODES[key].prefix
      }
    },
    get birthdayFormatted() {
      let date = self.birthday ? new Date(self.birthday) : null
      return date ? `${date.toDateString().split(' ').slice(1).join(' ')}` : null
    },
    get birthdayMonthNumber() {
      return (new Date(self.birthday).getMonth() + 1)
    },
    get birthdayMonth() {
      return new Date().getMonth()+1 === self.birthdayMonthNumber
    },
    get topFrame() {
      return self.zodiac?.frameUrl
    },
    get bottomFrame() {
      return self.zodiac?.iconUrl
    }
  }))
  .actions(self => ({
    update(user) {
      self.set('handle', user.handle)
      self.set('name', user.name)
      self.set('email', user.email)
      self.set('phone', user.phone)
      self.set('status', user.status)
      self.set('country', user.country)
      self.set('emailVerif', user.emailVerif)
      self.set('birthday', user.birthday)
      self.set('phoneVerif', user.phoneVerif)
      self.set('avatar', user.avatar)
      self.set('zodiac', user.zodiac)
      self.set('phoneCountryCode', user.phoneCountryCode)
    },
    set(key, value) {
      self[key] = value
    }
  }))

export default User