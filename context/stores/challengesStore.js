import { getRoot, types } from "mobx-state-tree"
import { api_get_challenges, api_get_my_challenges } from "../../queries/challenge"
import Challenge from "../models/Challenge"
import { filter, map } from "lodash"
import { CHALLENGE_STATUS } from "../../constants/types"

const ChallengesStore = types
  .model('ChallengesStore', {
    challenges: types.optional(
      types.array(types.reference(Challenge)), []
    ),
    loading: true
  })
  .views(self => ({
    get token() {
      return getRoot(self).authStore.token
    },
    get accountId() {
      return getRoot(self).accountStore.user?.id
    },
    get myChallenges() {
      return filter(self.challenges, ch => ch.createdBy === self.accountId && 
                        ch.status !== CHALLENGE_STATUS.DRAFT && ch.status !== CHALLENGE_STATUS.HIDDEN 
                        && ch.status !== CHALLENGE_STATUS.PAST )
    },
    get relevantChallenges() {
      return filter(self.challenges, ch => ch.status === CHALLENGE_STATUS.ACTIVE)
    },
    get birthdayChallenge() {
      return filter(self.challenges, ch => ch.isMyBirthdayMonth)[0]
    },
    get challengesFactory() {
      return getRoot(self).challengesFactory
    }
  }))
  .actions(self => ({
    async getChallenges() {
      try {
        self.set('loading', true)

        const res = await api_get_challenges(self.token)
        if (res.error) throw res
        const ids = self.challengesFactory.addUpdateChallenges(res.data)

        const resMy = await api_get_my_challenges(self.token)
        if (resMy.error) throw resMy
        const myIds = self.challengesFactory.addUpdateChallenges(resMy.data)

        let chIds = [...new Set([...ids ,...myIds])]

        self.set('challenges', chIds)

        self.set('loading', false)
        return res.data

      } catch (err) {
        self.set('loading', false)
        return err
      }
    },
    addToTheTop(id) {
      self.challenges.unshift(id)
    },
    set(key, value) {
      self[key] = value
    }
  }))

export default ChallengesStore