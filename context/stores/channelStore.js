import { getRoot, types } from "mobx-state-tree"
import Channel from "../models/Channel"
import { v4 as uuid } from 'uuid'
import { api_follow_channel, api_get_channel_posts, api_update_channel } from "../../queries/channels"

const ChannelStore = types
  .model('ChannelStore', {
    channel: types.maybeNull(
      types.reference(Channel)
    ),
    editDescription: types.maybeNull(types.string),
    editWebsite: types.maybeNull(types.string),

    postsLength: types.optional(types.number, 0),

    update: types.maybeNull(types.string),
    page: 1,
    itm_per_p: 9,
    empty: false,
    loading: false,
    refreshing: false,
  })
  .views(self => ({
    get mine() {
      return self.channel?.user?.id === getRoot(self).accountStore?.user?.id
    },
    get channelsFactory() {
      return getRoot(self).channelsFactory
    },
    get accountStore() {
      return getRoot(self).accountStore
    },
    get dramasFactory() {
      return getRoot(self).dramasFactory
    },
    get token() {
      return getRoot(self).authStore.token
    },
    get homeStore() {
      return getRoot(self).homeStore
    },
    get reactionStore() {
      return getRoot(self).reactionStore
    },
    get validUrl() {
      var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i') // fragment locator
      return !!pattern.test(self.editWebsite)
    },
  }))
  .actions(self => ({
    async setChannel(id) {
      if (!self.accountStore.seenChannel(id))
        self.accountStore.addSeenChannel(id)
      let res = await self.channelsFactory.fetch(id)
      self.set('channel', res)
    },
    async nextPage() {
      try {
        self.set('loading', true)
        self.set('page', self.page+1)
        await self.getPosts()
      } catch (err) {
      }
    },
    async getPosts(reset=false) {
      try {
        self.set('loading', true)

        if (reset) {
          self.set('refreshing', true)
          self.set('page', 1)
          self.set('empty', false)
          self.homeStore.set('app_open', new Date().toISOString())
        }

        const res = await api_get_channel_posts(self.token, self.channel?.id, self.page, self.itm_per_p, self.homeStore.app_open)
        if (res.error) throw res

        self.set('postsLength', res.data.count)

        const ids = self.dramasFactory.addUpdateDramas(res.data.rows)
        
        self.pushDramas(ids, reset)
        self.reactionStore.getReactionsById(ids).then(() => {
          self.updateFlatListData()
        })

        self.set('loading', false)
        self.set('refreshing', false)
        return res.data
      } catch (err) {
        self.set('refreshing', false)
        self.set('loading', false)
        return err
      }
    },
    async updateChannel() {
      try { 
        self.set('loading', true)
      
        const res = await api_update_channel(self.token, 
          self.channel?.id, {
            websiteLink: self.editWebsite,
            description: self.editDescription,
        })
        if (res.error) throw res

        self.populateChannelInfo()
        self.set('loading', false)

        return res.data
      } catch (err) {
        return err
      }
    },
    async follow() {
      try { 
        const res = await api_follow_channel(self.token, self.channel?.id)
        if (res.error) throw res

        let status = res.status === "Channel unfollowed" ? false : true
        self.channel.setFollowing(status)
        return res.data
      } catch (err) {
        return err
      }
    },
    attachPost(id) {
      self.channel.addToTop(id)
      self.set('update', uuid())
    },
    pushDramas(ids, reset) {
      if (!reset && ids.length < 10) self.set('empty', true)
      if (reset) return self.channel.setDramas(ids)
      return self.channel.pushDramas(ids)
    },
    populate() {
      self.set('editDescription', self.channel.description)
      self.set('editWebsite', self.channel.websiteLink)
    },
    populateChannelInfo() {
      self.channel.set('description', self.editDescription)
      self.channel.set('websiteLink', self.editWebsite)
    },
    updateFlatListData() {
      self.set('update', uuid())
    },
    set(key, value) {
      self[key] = value
    }
  }))

export default ChannelStore