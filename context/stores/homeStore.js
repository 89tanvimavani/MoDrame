import { getRoot, types } from "mobx-state-tree"
import { api_get_dramas } from "../../queries/drama"
import { api_get_drama_by_hash_id } from "../../queries/drama"
import 'react-native-get-random-values'
import Drama from "../models/Drama"
import { v4 as uuid } from 'uuid'
import { MAX_SESSION, Y_SESSION } from "../../constants/globals"
import GrandPrize from "../models/GrandPrize"
import { api_get_new_channels } from "../../queries/channels"
import Channel from '../models/Channel'
import { api_get_grand_prize } from "../../queries/notifications"

const HomeStore = types
  .model('HomeStore', {
    dramas: types.optional(
      types.array(
        types.reference(Drama)
      ), []
    ),
    update: types.maybeNull(types.string),
    firstDramas: types.maybeNull(types.array(types.number)),
    loadedFirstDramas: types.maybeNull(types.array(types.boolean)),
    
    app_open: types.maybeNull(types.string),
    appOpenNumber: types.maybeNull(types.number),

    grandPrize: types.maybeNull(
      types.optional(GrandPrize, {})),
    newChannel: types.maybeNull(types.reference(Channel)),

    page: 1,
    itm_per_p: 10,
    refreshing: false,
    seenChallengePress: false,
    seenChallengesScreen: false,
    empty: false,
    loading: true
  })
  .views(self => ({
    get token() {
      return getRoot(self).authStore.token
    },
    get logout() {
      return getRoot(self).authStore
    },
    get dramasFactory() {
      return getRoot(self).dramasFactory
    },
    get authStore() {
      return getRoot(self).authStore
    },
    get accountStore() {
      return getRoot(self).accountStore
    },
    get channelsFactory() {
      return getRoot(self).channelsFactory
    },
    get reactionStore() {
      return getRoot(self).reactionStore
    },
    get guiStore() {
      return getRoot(self).guiStore
    },
    get hasGrandPrize() {
      return self.grandPrize.id !== null
    },
    get activateButtonAnimation() {
      return self.appOpenNumber % Y_SESSION === 0 && self.appOpenNumber < MAX_SESSION && !self.seenChallengePress
    }
  }))
  .actions(self => ({
    async nextPage() {
      try {
        self.set('loading', true)
        self.set('page', self.page+1)
        await self.getDramas()
        self.set('loading', false)
      } catch (err) {
        self.set('loading', false)
      }
    },
    async getDramas(reset=false) {
      try {
        self.set('loading', true)

        if (reset) {
          self.set('refreshing', true)
          self.set('page', 1)
          self.set('empty', false)
          self.set('app_open', new Date().toISOString())
        }
        
        const res = await api_get_dramas(
          self.token,
          self.page, 
          self.itm_per_p,
          reset
        )

        if (res.error) throw res

        const ids = self.dramasFactory.addUpdateDramas(res.data)
        self.pushDramas(ids, reset)

        self.reactionStore.getReactionsById().then(() => {
          self.updateFlatListData()
        })
        
        // SHOW LOADER TILL FIRST THREE DRAMAS ARE LOADED
        // REMOVE LOADER AFTER 2s
        if (reset) {
          self.set('firstDramas', ids.slice(0, 3))
          self.set('loadedFirstDramas', [false, false, false])
          await self.timeout(2000)
          self.set('refreshing', false)
        }

        self.set('loading', false)

        return res.data
      } catch (err) {
        self.set('loading', false)
        self.set('refreshing', false)
        if (err.status === 401) {
          self.authStore.logout()
        }
        return err
      }
    },
    async getDramaByHashId(hashId) {
      try {
        const res = await api_get_drama_by_hash_id(
          self.token,
          hashId
        )
        return res.data
      } catch(err) {
        return err
      }
    },
    async getNewChannels() {
      try {
        self.set('loading', true)
        
        const res = await api_get_new_channels(self.token)
        if (res.error) throw res

        const id = self.channelsFactory.addUpdateChannel(res.data.channel)
        self.set('newChannel', id)

        if (!self.guiStore.grandPrizeModal && 
          self.appOpenNumber !== 0 && self.appOpenNumber !== null &&
          !self.accountStore.seenChannel(id) && 
          !self.accountStore.seenChannelModal(id) &&
          self.newChannel?.user !== null)
          self.guiStore.set('channelLaunchModal', true)

        self.set('loading', false)
        return res.data
      } catch (err) {
        self.set('loading', false)
        return err
      }
    },
    async getGrandPrize() {
      try {
        self.set('loading', true)
        
        const res = await api_get_grand_prize(self.token)
        if (res.error) throw res

        self.grandPrize.setPrize(res.data.prize)
        
        if (self.appOpenNumber%6 === 0 && self.grandPrize.title !== null && 
            self.appOpenNumber !== 0 && self.appOpenNumber !== null)
          self.guiStore.set('grandPrizeModal', true)

        self.set('loading', false)
        return res.data
      } catch (err) {
        self.set('loading', false)
        return err
      }
    },
    timeout(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },
    firstDrama(id) {
      return self.firstDramas && self.firstDramas.indexOf(id) !== -1
    },
    setLoaded(value, id) {
      let index = self.firstDramas.indexOf(id)
      self.loadedFirstDramas[index] = value

      if (self.loadedFirstDramas.every(v => v === true))
        self.set('refreshing', false)
    },
    pushDramas(ids, reset) {
      if (!reset && ids.length < 10) self.set('empty', true)
      if (reset) return self.set('dramas', ids)
      return self.dramas.push(...ids)
    },
    updateFlatListData() {
      self.set('update', uuid())
    },
    addToTheTop(id) {
      self.dramas.unshift(id)
      self.updateFlatListData()
    },
    increaseAppOpen() {
      if (self.appOpenNumber === null) self.set('appOpenNumber', 0)
      else self.set('appOpenNumber', self.appOpenNumber+1)
    },
    set(key, value) {
      self[key] = value
    }
  }))

export default HomeStore