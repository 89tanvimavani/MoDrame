import { types, getRoot } from "mobx-state-tree"
import ProfileStore from "../stores/profileStore"
import find from 'lodash/find'
import ChallengeStore from "../stores/challengeStore"

const ChallengeScreenFactory = types
  .model("ChallengeScreenFactory", {
    challengeScreens: types.optional(
      types.array(ChallengeStore), []
    )
  })
  .views(self => ({
    get accountStore() {
      return getRoot(self).accountStore
    },
    get challengesFactory() {
      return getRoot(self).challengesFactory
    }
  }))
  .actions(self => ({
    findChallengeScreen(challengeId) {
      return find(self.challengeScreens, cs => cs.challenge?.id === challengeId)
    },
    async getChallengeScreen(challengeId) {
      try {

        const existing = self.findChallengeScreen(challengeId)
        if (existing) return existing

        const u = self.challengesFactory.getChallenge(challengeId)

        if (u) {
          self.pushChallengeScreen({
            challenge: challengeId
          })
          return self.findChallengeScreen(challengeId)
        } else {
          const res = await self.challengesFactory.fetch(challengeId)

          const challengeScreen = ChallengeStore.create({
            challenge: challengeId
          })

          self.pushChallengeScreen(challengeScreen)
          return challengeScreen
        }
      } catch (err) {
        return null
      }
    },
    pushChallengeScreen(challengeScreen) {
      self.challengeScreens.push(challengeScreen)
    }
  }))


export default ChallengeScreenFactory
