import { getRoot, types } from "mobx-state-tree"
import differenceBy from 'lodash/differenceBy'
import intersectionBy from 'lodash/intersectionBy'
import filter from 'lodash/filter'
import find from 'lodash/find'
import map from 'lodash/map'
import Drama from "../models/Drama"
import { api_get_drama } from "../../queries/drama"
import { REACTION_TYPES } from "../../constants/types"

const DramasFactory = types
  .model('DramasFactory', {
    dramas: types.optional(
      types.array(Drama), []
    )
  })
  .views(self => ({
    get usersFactory() {
      return getRoot(self).usersFactory
    },
    get challengesFactory() {
      return getRoot(self).challengesFactory
    },
    get channelsFactory() {
      return getRoot(self).channelsFactory
    },
    get token() {
      return getRoot(self).authStore.token
    }
  }))
  .actions(self => ({
    addUpdateDramas(dramas) {
      const add = differenceBy(dramas, self.dramas, 'id')
      const update = intersectionBy(self.dramas, dramas, 'id')
      map(update, u => u.update(
        filter(dramas, d => d.id === u.id)[0]
      ))
      const parsed = map(add, d => {
        return (self.parseDrama(d))
      })
      self.dramas.push(...parsed)
      return map(dramas, a => a.id)
    },
    addUpdateDrama(drama) {
      const ids = self.addUpdateDramas([drama])
      return ids[0]
    },
    async getDrama(dramaId) {
      try {

        const id = parseInt(dramaId)

        let drama = find(self.dramas, u => u.id === id)

        if (drama) return drama

        const res = await self.fetch(id)
        if (res.error) throw res

        return find(self.dramas, u => u.id === id)

      } catch (err) {
        return {
          ...err,
          error: true
        }
      }      
    },
    parseDrama(d) {
      return ({
        ...d,
        user: d.user && self.usersFactory.addUpdateUser(d.user),
        challenge: d.challenge && self.challengesFactory.addUpdateChallenge(d.challenge),
        reactions: [
          {
            counter: 0,
            liked: false,
            type: REACTION_TYPES.NICE
          },
          {
            counter: 0,
            liked: false,
            type: REACTION_TYPES.ANGRY
          },
          {
            counter: 0,
            liked: false,
            type: REACTION_TYPES.SAD
          },
          {
            counter: 0,
            liked: false,
            type: REACTION_TYPES.OH
          }
        ]
      })
    },
    async fetch(id) {
      try {

        const res = await api_get_drama(self.token, id)
        if (res.error) throw res

        self.addUpdateDrama(res.data)

        return res.data

      } catch (err) {
        return err
      }
    },
    pushDrama(drama) {
      self.dramas.push(drama)
    }
  }))

export default DramasFactory