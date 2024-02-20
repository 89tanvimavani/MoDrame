import { toJS } from "mobx"
import { getRoot, types } from "mobx-state-tree"
import { ASSET_TYPE, USER_STATUS, VERIFICATION_METHOD } from "../../constants/types"
import { api_verify } from "../../queries/auth"
import { api_claim_reward } from "../../queries/reward"
import Asset from "../models/Asset"
import User from "../models/User"
import Toast from 'react-native-toast-message';
import { api_post_drama_views } from "../../queries/drama"
import { api_get_winning_dramas, api_update_onesignalid } from "../../queries/user"
import Drama from "../models/Drama"
import map from "lodash/map";
import DeviceInfo from 'react-native-device-info';
import { Platform } from "react-native"
import { api_block_user, api_content_report } from "../../queries/settings"


const AccountStore = types
  .model('AccountStore', {
    user: types.maybeNull(
      types.reference(User)
    ),
    tempAvatar: types.optional(Asset, {}),
    seenChannels: types.optional(
      types.array(types.number), []),
    seenChannelsModals: types.optional(
      types.array(types.number), []),

    // claim reward
    name: types.maybeNull(types.string),
    address: types.maybeNull(types.string),
    city: types.maybeNull(types.string),
    state: types.maybeNull(types.string),
    post: types.maybeNull(types.string),
    phone: types.maybeNull(types.string),
    email: types.maybeNull(types.string),

    // birthday modal
    birthdayModal: true,

    // views
    views: types.optional(
      types.array(types.number), []
    ),

    // winning dramas
    winningDramas: types.optional(
      types.array(types.reference(Drama)), []
    ),

    // loading
    loading: false
  })
  .views(self => ({
    get token() {
      return getRoot(self).authStore.token
    },
    get settingsStore() {
      return getRoot(self).settingsStore
    },
    get dramasFactory() {
      return getRoot(self).dramasFactory
    },
    get homeStore() {
      return getRoot(self).homeStore
    },
    get guiStore() {
      return getRoot(self).guiStore
    },
    get authStore() {
      return getRoot(self).authStore
    },
    get onboardingStore() {
      return getRoot(self).onboardingStore
    },
    get winningChallengesIds() {
      return map(self.winningDramas, d => d.challenge.id)
    },
    get onboardingStep() {
      if ((self.user?.emailVerif === USER_STATUS.VERIFICATION && 
        self.authStore.verificationMethod === 'EMAIL') || 
        (self.user?.phoneVerif === USER_STATUS.VERIFICATION && 
        self.authStore.verificationMethod === 'PHONE')) return 'Verification'
    },
    get registerStep() {
      if ((self.user?.emailVerif === USER_STATUS.VERIFICATION && 
        self.onboardingStore.verificationMethod === 'EMAIL') || 
        (self.user?.phoneVerif === USER_STATUS.VERIFICATION && 
        self.onboardingStore.verificationMethod === 'PHONE')) return 'Verification'
    },
    get uploadingAvatar() {
      return self.tempAvatar.loading
    },
    get uploadedAvatar() {
      return self.tempAvatar.uploaded
    },
    get validName() {
      return self.name
    },
    get validAddress() {
      return self.address
    },
    get validCity() {
      return self.city
    },
    get validState() {
      return self.state
    },
    get validCountry() {
      return self.country
    },
    get validPost() {
      return self.post
    },
    get validPhone() {
      return self.phone
    },
    get validEmail() {
      return self.email
    },
    get validRewardClaim() {
      return (
        self.validName &&
        self.validAddress &&
        self.validCity &&
        self.validState &&
        self.validCountry &&
        self.validPost &&
        self.validPhone &&
        self.validEmail 
      )
    },
    get birthdayModalOpen() {
      return self.birthdayModal && self.user?.birthdayMonth && !self.guiStore.grandPrizeModal
    }
  }))
  .actions(self => ({
    populate() {
      self.user.set('name', self.settingsStore.name)
      self.user.set('phoneCountryCode', self.settingsStore.areaCode)
      self.user.set('handle', self.settingsStore.handle)
      self.user.set('email', self.settingsStore.email)
      self.user.set('phone', self.settingsStore.phone)
      self.user.set('country', self.settingsStore.country)
      self.user.set('webpage', self.settingsStore.webpage)
      self.user.set('bio', self.settingsStore.bio)
      self.user.set('birthday', self.settingsStore.birthday)
    },
    async changeAvatar(file) {
      try {
        const res = await self.tempAvatar.upload(
          self.user.id,
          self.user.handle,
          self.authStore.token,
          file,
          ASSET_TYPE.USER_AVATAR
        )
        if (res.error) throw res
        self.user.set('avatar', toJS(self.tempAvatar))
        return res
      } catch (err) {
        Toast.show({
          type: 'error',
          text1: 'Error uploading file',
          text2: err.data
        })
        return err
      }
    },
    async verify(code) {
      try {
        let data = {
          code
        }

        if (self.user.verificationMethod === VERIFICATION_METHOD.EMAIL) 
          data = { ...data, email: self.user.email }
        else data = { ...data, phone: self.user.phone }

        const res = await api_verify(data)

        if (res.error) throw res

        const { user, token } = res.data

        self.user.update(user)
        self.authStore.authenticate(token)
        self.setOneSignalId()

        return res
      } catch (err) {
        return {
          error: true,
          ...err
        }
      }
    },
    async resend() {
      if (self.user.verificationMethod === VERIFICATION_METHOD.EMAIL) {
        self.authStore.set('verificationMethod', VERIFICATION_METHOD.EMAIL)
        self.authStore.set('email', self.user.email)
      } else {
        self.authStore.set('verificationMethod', VERIFICATION_METHOD.PHONE)
        self.authStore.set('email', self.user.phone)
      }
      self.authStore.resendCode()
    },
    populatePrizeClaim() {
      self.set('email', self.user.email)
      self.set('phone', self.user.phone)
    },
    async claimPrize(dramaId) {
      try {
        self.set('loading', true)
        const res = await api_claim_reward(self.token, {
          contact: {
            name: self.name,
            address: self.address,
            city: self.city,
            state: self.state,
            country: self.country,
            post: self.post,
            phone: self.phone,
            email: self.email
          },
          dramaId
        })
        if (res.error) throw res

        self.getWinningDramas()

        self.set('loading', false)
        return res.data

      } catch(err) {
        self.set('loading', false)
        Toast.show({
          type: 'error',
          text1: 'Reward could not be claimed',
          text2: 'Please check if all data below is correct!'
        })
        return err
      }
    },
    async postViews() {
      try {
        const res = await api_post_drama_views(self.token, {
          ids: toJS(self.views)
        })
        if (res.error) throw res
        self.set('views', [])
        return res
      } catch (err) {
        return err
      }
    },
    pushView(dramaId) {
      self.views.push(dramaId)
    },
    async setOneSignalId() {
      try {
        
        let os = Platform.OS === 'ios' ? 'ios' : 'android'
        const version = `${DeviceInfo.getVersion()}${DeviceInfo.getBuildNumber()}`.replace('.', '')

        const res = await api_update_onesignalid(self.token, {
          newUser: {
            oneSignalId: getRoot(self).oneSignalId,
            appVersion: parseInt(version),
            platform: `${os}`
          }
        })
        if (res.error) throw res

        return res.data
      } catch (err) {
        return err
      }
    },
    async getWinningDramas() {
      try {
        const res = await api_get_winning_dramas(self.token)
        if (res.error) throw res
        const ids = self.dramasFactory.addUpdateDramas(res.data)

        self.set('winningDramas', ids)
        return res.data
      } catch (err) {
        return err
      }
    },
    async report(type, message, id) {
      try {
        const res = await api_content_report(self.token, {
          report: {
            type,
            id,
            message
          }
        })
        if (res.error) throw res
        return res.data
      } catch(err) {
        return err
      }
    },
    async block(handle) {
      try {
        const res = await api_block_user(self.token, {
          handle
        })
        if (res.error) throw res
        return res.data
      } catch(err) {
        return err
      }
    },
    addSeenChannel(id) {
      self.seenChannels.push(id)
    },
    addSeenChannelModal(id) {
      self.seenChannelsModals.push(id)
    },
    seenChannel(id) {
      return self.seenChannels?.includes(id)
    },
    seenChannelModal(id) {
      return self.seenChannelsModals?.includes(id)
    },
    closeBirthdayModal() {
      self.set('birthdayModal', !self.birthdayModal)
    },
    clear() {
      self.set('seenChannels', [])
      self.set('seenChannelsModals', [])
    },
    set(key, value) {
      self[key] = value
    }
  }))

export default AccountStore