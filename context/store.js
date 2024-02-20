import { types } from "mobx-state-tree"
import ChallengesFactory from "./factories/challengesFactory"
import DramasFactory from "./factories/dramasFactory"
import ProfileFactory from "./factories/profileFactory"
import UsersFactory from "./factories/usersFactory"
import AccountStore from "./stores/accountStore"
import AuthStore from "./stores/authStore"
import ChallengesStore from "./stores/challengesStore"
import ChallengeStore from "./stores/challengeStore"
import HomeStore from "./stores/homeStore"
import OnboardingStore from "./stores/onboardingStore"
import PublishDramaStore from "./stores/publishDramaStore"
import ReactionStore from "./stores/reactionStore"
import SettingsStore from "./stores/settingsStore"
import NotificationsStore from "./stores/notificationsStore"
import GuiStore from "./stores/guiStore"
import TutorialStore from "./stores/tutorialStore"
import SearchStore from "./stores/searchStore"
import CreateChallengeStore from "./stores/createChallengeStore"
import ChannelStore from "./stores/channelStore"
import ChannelsFactory from "./factories/channelsFactory"
import UploadChannelStore from "./stores/uploadChannelStore"

const Store = types
  .model({
    authStore: types.optional(AuthStore, {}),
    onboardingStore: types.optional(OnboardingStore, {}),
    accountStore: types.optional(AccountStore, {}),
    publishDramaStore: types.optional(PublishDramaStore, {}),
    homeStore: types.optional(HomeStore, {}),
    reactionStore: types.optional(ReactionStore, {}),
    challengesStore: types.optional(ChallengesStore, {}),
    challengeStore: types.optional(ChallengeStore, {}),
    settingsStore: types.optional(SettingsStore, {}),
    channelStore: types.optional(ChannelStore, {}),
    notificationsStore: types.optional(NotificationsStore, {}),
    guiStore: types.optional(GuiStore, {}),
    tutorialStore: types.optional(TutorialStore, {}),
    searchStore: types.optional(SearchStore, {}),
    createChallengeStore: types.optional(CreateChallengeStore, {}),
    uploadChannelStore: types.optional(UploadChannelStore, {}),
    // factories
    profileFactory: types.optional(ProfileFactory, {}),
    usersFactory: types.optional(UsersFactory, {}),
    challengesFactory: types.optional(ChallengesFactory, {}),
    dramasFactory: types.optional(DramasFactory, {}),
    channelsFactory: types.optional(ChannelsFactory, {}),

    // onesignal
    oneSignalId: types.maybeNull(types.string),
    onDeviceVideoCompression: true,

    hydrated: false
  })
  .views(self => ({

  }))
  .actions(self => ({
    getInitialData() {
      self.accountStore.getWinningDramas()
      self.challengesStore.getChallenges()
    },
    resetStore() {

      // resetting all stores

      const authS = AuthStore.create({})
      const onbStore = OnboardingStore.create({})
      const accStore = AccountStore.create({})
      const pubDramS = PublishDramaStore.create({})
      const hS = HomeStore.create({})
      const reactStore = ReactionStore.create({})
      const chalStore = ChallengesStore.create({})
      const chaStore = ChallengeStore.create({})
      const setStore = SettingsStore.create({})
      const notifStore = NotificationsStore.create({})
      const profileFactory = ProfileFactory.create({
        profiles: []
      })
      const usersFactory = UsersFactory.create({})
      const chalFactory = ChallengesFactory.create({})
      const dramasFactory = DramasFactory.create({})

      // self.set('onboardingStore', onbStore)

      self.onboardingStore.clear()

      self.set('publishDramaStore', pubDramS)
      self.set('homeStore', hS)
      self.set('reactionStore', reactStore)
      self.set('challengesStore', chalStore)
      self.set('settingsStore', setStore)
      self.set('challengeStore', chaStore)
      self.set('notificationsStore', notifStore)
      // self.set('profileFactory', profileFactory)
      self.set('accountStore', accStore)
      self.authStore.clear()
      // self.set('usersFactory', usersFactory)
      // self.set('challengesFactory', chalFactory)
      // self.set('dramasFactory', dramasFactory)
    },
    set(key, value) {
      self[key] = value
    }
  }))

export default Store