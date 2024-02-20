import { detach, getRoot, types } from "mobx-state-tree"
import { ASSET_TYPE, CHALLENGE_STATUS } from "../../constants/types"
import { api_create_challenge, api_update_challenge } from "../../queries/challenge"
import Asset from "../models/Asset"

const CreateChallengeStore = types
  .model('CreateChallengeStore', {
    video: types.optional(
      Asset, {}
    ),
    challengeId: types.maybeNull(types.number),
    challengeHashId: types.maybeNull(types.string),
    description: types.optional(types.string, ''),
    title: types.optional(types.string, ''),
    tags: types.optional(types.array(types.string), []),
    
    termsAgreement: false,
    termsError: false,
    loading: false,
    uploadingError: false
  })
  .views(self => ({
    get token() {
      return getRoot(self).authStore.token
    },
    get publishing() {
      return self.loading || self.video.loading
    },
    get uploadingVideo() {
      return self.video.loading
    },
    get challengesFactory() {
      return getRoot(self).challengesFactory
    },
    get challengesStore() {
      return getRoot(self).challengesStore
    },
    get validPublish() {
      return !self.uploadingVideo && self.description && self.title && self.video.id
    }
  }))
  .actions(self => ({
    async createChallenge() {
      try {
        const res = await api_create_challenge(self.token, {
          challenge: {
            title: self.title,
            dueDate: new Date(),
            status: CHALLENGE_STATUS.DRAFT,
            descripton: self.description,
            videoId: self.video?.id
          }
        })
        
        if (res.error) throw res

        self.set('challengeId', res.data.id)
        self.set('challengeHashId', res.data.hashId)

        return res.data
      } catch (err) {
        return err
      }
    },
    async updateChallenge() {
      try {
        self.set('loading', true)

        const res = await api_update_challenge(self.token, {
          challenge: {
            id: self.challengeId,
            title: self.title,
            dueDate: new Date(),
            description: self.description,
            status: CHALLENGE_STATUS.REVIEW,
            videoId: self.video?.id,
            tags: self.tags
          }
        })
        const id = self.challengesFactory.addUpdateChallenge(res.data)
        self.challengesStore.addToTheTop(id)

        self.set('loading', false)

        return res.data
      } catch (err) {
        self.set('loading', false)
        return err
      }
    },
    async upload(file) {
      try {
        self.set('loading', true)
        self.set('uploadingError', false)

        const data = await self.createChallenge()
        if (data.error) throw data

        const video = Asset.create({})
        self.set('video', video)

        const res = await video.upload(self.challengeId, self.challengeHashId, self.token, file, ASSET_TYPE.CHALLENGE_VIDEO)
        
        self.set('loading', false)

        if (res.error) throw res
      } catch (err) {
        self.set('uploadingError', true)
        self.set('loading', false)
        return err
      }
    },
    removeVideo() {
      if (self.video) detach(self.video)
    },
    clear() {
      self.set('challengeId', null)
      self.set('video', {})
      self.set('description', '')
      self.set('title', '')
      self.set('tags', [])
      self.set('termsError', false)
    },
    set(key, value) {
      self[key] = value
    }
  }))

export default CreateChallengeStore