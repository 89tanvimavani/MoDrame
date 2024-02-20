import { getRoot, types } from "mobx-state-tree"
import Channel from "../models/Channel"
import differenceBy from 'lodash/differenceBy'
import intersectionBy from 'lodash/intersectionBy'
import filter from 'lodash/filter'
import find from 'lodash/find'
import map from 'lodash/map'
import { api_get_channel } from "../../queries/channels"

const ChannelsFactory = types
  .model('ChannelsFactory', {
    channels: types.optional(
      types.array(Channel), []
    )
  })
  .views(self => ({
    get usersFactory() {
      return getRoot(self).usersFactory
    },
    get token() {
      return getRoot(self).authStore.token
    }
  }))
  .actions(self => ({
    addUpdateChannels(channels) {
      const add = differenceBy(channels, self.channels, 'id')
      const update = intersectionBy(self.channels, channels, 'id')
      map(update, ch => ch.update(
        filter(channels, chnl => chnl.id === ch.id)[0]
      ))
      const parsed = map(add, c => {
        return (self.parseChannel(c))
      })
      self.channels.push(...parsed)
      return map(channels, a => a.id)
    },
    addUpdateChannel(ch) {
      const ids = self.addUpdateChannels([ch])
      return ids[0]
    },
    getChannel(id) {
      return find(self.channels, u => u.id === id)
    },
    parseChannel(c) {
      return ({
        ...c,
        user: c.user && self.usersFactory.addUpdateUser(c.user)
      })
    },
    async fetch(id) {
      try {
        const res = await api_get_channel(self.token, id)
        if (res.error) throw res

        self.addUpdateChannel(res.channel)
        return self.getChannel(id)
      } catch (err) {
        return err
      }
    }
  }))

export default ChannelsFactory