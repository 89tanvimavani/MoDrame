import { getRoot, types } from "mobx-state-tree"
import User from "../models/User"
import differenceBy from 'lodash/differenceBy'
import intersectionBy from 'lodash/intersectionBy'
import filter from 'lodash/filter'
import find from 'lodash/find'
import map from 'lodash/map'

const UsersFactory = types
  .model('UsersFactory', {
    users: types.optional(
      types.array(User), []
    )
  })
  .views(self => ({

  }))
  .actions(self => ({
    addUpdateUsers(users) {
      const add = differenceBy(users, self.users, 'id')
      const update = intersectionBy(self.users, users, 'id')
      map(update, u => u.update(
        filter(users, usr => usr.id === u.id)[0]
      ))
      self.users.push(...add);
      return map(users, a => a.id)
    },
    addUpdateUser(user) {
      const ids = self.addUpdateUsers([user])
      return ids[0]
    },
    getUser(id) {
      return find(self.users, u => u.id === id)
    },
    async fetch(id) {
      // try {
      //   const res = await api_get_user(id)
      //   if (res.error) throw res
      //   self.addUpdateUser(res.data)
      //   return self.getUser(id)
      // } catch (err) {
      // }
    }
  }))

export default UsersFactory