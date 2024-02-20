import { getRoot, types } from "mobx-state-tree"
import Challenge from "../models/Challenge"

const ChallengeStore = types
  .model('ChallengeStore', {
    challenge: types.maybeNull(
      types.reference(
        Challenge
      )
    ),
    loading: false
  })
  .views(self => ({
    get challengesFactory() {
      return getRoot(self).challengesFactory
    },
    get dramasFactory() {
      return getRoot(self).dramasFactory
    },
    get homeStore() {
      return getRoot(self).homeStore
    },
    get firstNine() {
      return self.dramas.slice(0, 9)
    },
    get token() {
      return getRoot(self).authStore.token
    }
  }))
  .actions(self => ({
    set(key, value) {
      self[key] = value
    }
  }))

export default ChallengeStore