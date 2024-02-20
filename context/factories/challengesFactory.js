import { getRoot, types } from "mobx-state-tree"
import differenceBy from 'lodash/differenceBy'
import intersectionBy from 'lodash/intersectionBy'
import filter from 'lodash/filter'
import find from 'lodash/find'
import map from 'lodash/map'
import Challenge from "../models/Challenge"
import { api_get_challenge } from "../../queries/challenge"

const ChallengesFactory = types
  .model('ChallengesFactory', {
    challenges: types.optional(
      types.array(Challenge), []
    )
  })
  .views(self => ({
    get token() {
      return getRoot(self).authStore.token
    }
  }))
  .actions(self => ({
    addUpdateChallenges(challenges) {
      const add = differenceBy(challenges, self.challenges, 'id')
      const update = intersectionBy(self.challenges, challenges, 'id')
      map(update, u => u.update(
        filter(challenges, ch => ch.id === u.id)[0]
      ))
      self.challenges.push(...add);
      return map(challenges, a => a.id)
    },
    addUpdateChallenge(challenge) {
      const ids = self.addUpdateChallenges([challenge])
      return ids[0]
    },
    async getChallenge(cId) {
      try {
        const id = parseInt(cId)

        let ch = find(self.challenges, c => c.id === id)
        if (ch) return ch

        const res = await self.fetch(id)
        if (res.error) throw res

        return find(self.challenges, c => c.id === id)
      } catch (err) {
        return {
          ...err,
          error: true
        }
      }
    },
    async fetch(id) {
      try {
        const res = await api_get_challenge(self.token, id)
        if (res.error) throw res
        self.addUpdateChallenge(res.data)
        return res
      } catch (err) {
        return err
      }
    }
  }))

export default ChallengesFactory