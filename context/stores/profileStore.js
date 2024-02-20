import { getRoot, types } from "mobx-state-tree"
import { api_get_user_dramas } from "../../queries/drama"
import { api_get_user_stats } from "../../queries/user"
import Drama from "../models/Drama"
import Channel from '../models/Channel'
import User from "../models/User"
import { RANKS } from "../../constants/ranking"

const ProfileStore = types
  .model('ProfileStore', {
    user: types.maybeNull(
      types.reference(
        User
      )
    ),
    dramas: types.optional(
      types.array(
        types.reference(Drama)
      ), []
    ),
    dramaCount: types.maybeNull(types.number),
    winsCount: types.maybeNull(types.number),
    channel: types.maybeNull(
      types.reference(
        Channel
      )
    ),

    page: 1,
    itm_per_p: 9,
    empty: false,
    loading: true
  })
  .views(self => ({
    get mine() {
      return self.user?.id === getRoot(self).accountStore?.user?.id
    },
    get wins() {
      return self.winsCount
    },
    get numberOfDramas() {
      return self.dramaCount
    },
    get verified() {
      return self.user.verified
    },
    get token() {
      return getRoot(self).authStore.token
    },
    get dramasFactory() {
      return getRoot(self).dramasFactory
    },
    get homeStore() {
      return getRoot(self).homeStore
    },
    get reactionStore() {
      return getRoot(self).reactionStore
    },
    get hasChannel() {
      return self.channel !== null && self.channel?.status !== 'HIDDEN'
    },
    get rank() {
      if (self.dramaCount >= RANKS[0].challenges && self.dramaCount < RANKS[1].challenges) return [ RANKS[0].status, RANKS[0].img ]
      else if (self.dramaCount >= RANKS[1].challenges && self.dramaCount < RANKS[2].challenges) return [ RANKS[1].status, RANKS[1].img ]
      else if (self.dramaCount >= RANKS[2].challenges && self.dramaCount < RANKS[3].challenges) return [ RANKS[2].status, RANKS[2].img ]
      else if (self.dramaCount >= RANKS[3].challenges && self.dramaCount < RANKS[4].challenges) return [ RANKS[3].status, RANKS[3].img ]
      else if (self.dramaCount >= RANKS[4].challenges && self.dramaCount < RANKS[5].challenges && self.winsCount <= RANKS[4].wins) return [ RANKS[4].status, RANKS[4].img ]
      else if (self.dramaCount >= RANKS[5].challenges && self.dramaCount < RANKS[6].challenges && self.winsCount <= RANKS[5].wins) return [ RANKS[5].status, RANKS[5].img ]
      else if (self.dramaCount >= RANKS[6].challenges && self.dramaCount < RANKS[7].challenges && self.winsCount <= RANKS[6].wins) return [ RANKS[6].status, RANKS[6].img ]
      else if (self.dramaCount >= RANKS[7].challenges && self.dramaCount < RANKS[8].challenges && self.winsCount <= RANKS[7].wins) return [ RANKS[7].status, RANKS[7].img ]
      else if (self.dramaCount >= RANKS[8].challenges && self.dramaCount < RANKS[9].challenges && self.winsCount <= RANKS[8].wins) return [ RANKS[8].status, RANKS[8].img ]
      else if (self.dramaCount >= RANKS[9].challenges && self.winsCount <= RANKS[9].wins) return [ RANKS[9].status, RANKS[9].img ]
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
          self.set('page', 1)
          self.set('empty', false)
        }

        const res = await api_get_user_dramas(self.token, self.user.id, self.page, self.itm_per_p, self.homeStore.app_open)
        if (res.error) throw res
        
        const ids = self.dramasFactory.addUpdateDramas(res.data)

        self.reactionStore.getReactionsById().then(() => {
          self.homeStore.updateFlatListData()
        })

        self.pushDramas(ids, reset)

        self.set('loading', false)

        return res.data
      } catch (err) {
        self.set('loading', false)
        return err
      }
    },
    async getUserStats() {
      try {
        const res = await api_get_user_stats(self.token, self.user.id)
        if (res.error) throw res

        self.set('dramaCount', res.data.dramas)
        self.set('winsCount', res.data.wins)

        return res.data
      } catch (err) { 
        return err
      }
    },
    pushDramas(ids, reset) {
      if (!reset && ids.length < 9) self.set('empty', true)
      if (reset) return self.set('dramas', ids)
      return self.dramas.push(...ids)
    },
    update(pr) {
      self.set('user', pr.user)
      self.set('channel', pr.channel)
      if (pr.dramas) self.set('dramas', pr.dramas)
      if (pr.dramaCount) self.set('dramaCount', pr.dramaCount)
      if (pr.winsCount) self.set('winsCount', pr.winsCount)
    },
    set(key, value) {
      self[key] = value
    }
  }))

export default ProfileStore