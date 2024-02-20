import { types, getRoot } from "mobx-state-tree"
import ProfileStore from "../stores/profileStore"
import { api_get_user } from "../../queries/user"
import find from 'lodash/find'

const ProfileFactory = types
  .model("ProfileFactory", {
    profiles: types.optional(
      types.array(ProfileStore), []
    )
  })
  .views(self => ({
    get accountStore() {
      return getRoot(self).accountStore
    },
    get usersFactory() {
      return getRoot(self).usersFactory
    },
    get channelsFactory() {
      return getRoot(self).channelsFactory
    },
    get token() {
      return getRoot(self).authStore.token
    }
  }))
  .actions(self => ({
    findProfile(userId) {
      return find(self.profiles, p => p.user?.id === userId)
    },
    async getProfile(userId) {
      try {
        const res = await api_get_user(self.token, userId)
        if (res.error) throw res

        let profile = {
          channel: res.data?.channel && 
              self.channelsFactory.addUpdateChannel(
                {...res.data?.channel, user: {...res.data, id: userId}}),
          user: self.usersFactory.addUpdateUser({...res.data, id: userId})
        }

        const existing = self.findProfile(userId)
        if (existing) existing.update(profile)
        else self.pushProfile(profile)

        return self.findProfile(userId)
      } catch (err) {
        return err
      }
    },
    pushProfile(profile) {
      self.profiles.push(profile)
    }
  }))


export default ProfileFactory
