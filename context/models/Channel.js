import { types, getRoot } from "mobx-state-tree"
import Drama from './Drama'
import User from './User'

const Channel = types
  .model('Channel', {
    id: types.identifierNumber,
    name: types.maybeNull(types.string),
    status: types.maybeNull(types.string),
    description: types.maybeNull(types.string),
    websiteLink: types.maybeNull(types.string),
    isFollowing: types.maybeNull(types.boolean),
    followers: types.maybeNull(types.number),
    dramas: types.optional(
      types.array(types.reference(Drama)), []),
    user: types.maybeNull(
      types.reference(User)),
  })
  .views(self => ({
    get mine() {
      return self?.user?.id === getRoot(self).accountStore?.user?.id
    },
    get channelStore() {
      return getRoot(self).channelStore
    },
    get postIds() {
      return self.dramas?.map(a => a.id)
    },
    get channelFollowers() {
      return self.channel?.followers ? self.channel?.followers : 0
    }
  }))
  .actions(self => ({
    pushDramas(ids) {
      self.dramas.push(...ids)
    },
    setDramas(ids) {
      self.set('dramas', ids)
    },
    setFollowing(isFollowing) {
      self.set('isFollowing', isFollowing)
    },
    addToTop(id) {
      self.dramas.unshift(id)
    },
    update(channel) {
      self.set('name', channel.name)
      self.set('description', channel.description)
      self.set('websiteLink', channel.websiteLink)
      self.set('dramas', channel.dramas)
      self.set('isFollowing', channel.isFollowing)
      self.set('followers', channel.followers)
      self.set('status', channel.status)
    },
    set(key, value) {
      self[key] = value
    }
  }))

export default Channel