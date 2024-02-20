import { types } from "mobx-state-tree"

const TutorialStore = types
  .model('TutorialStore', {
    introTutorial: true,
    homeChallengeTutorial: true,
    challengeScreenTutorial: true
  })
  .views(self => ({

  }))
  .actions(self => ({
    seenIntroTutorial() {
      self.set('introTutorial', false)
    },
    seenHomeChallengeTutorial() {
      self.set('homeChallengeTutorial', false)
    },
    seenChallengeScreenTutorial() {
      self.set('challengeScreenTutorial', false)
    },
    set(key, value) {
      self[key] = value
    }
  }))

export default TutorialStore