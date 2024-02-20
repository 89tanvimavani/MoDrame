import { detach, getRoot, types } from "mobx-state-tree"
import { api_create_drama, api_update_drama } from "../../queries/drama"
import { api_create_post } from "../../queries/channels"
import Asset from "../models/Asset"
import { ASSET_TYPE } from "../../constants/types"

const UploadChannelStore = types
  .model('UploadChannelStore', {
    video: types.optional(
      Asset, {}
    ),
    id: types.maybeNull(types.number),
    hashId: types.maybeNull(types.string),
    description: types.optional(types.string, ''),
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
    get dramasFactory() {
      return getRoot(self).dramasFactory
    },
    get channelStore() {
      return getRoot(self).channelStore
    },
    get challengesStore() {
      return getRoot(self).challengesStore
    },
    get validPublish() {
      return !self.uploadingVideo && self.description && self.video.id
    }
  }))
  .actions(self => ({
    async createPost() {
      try {
        const res = await api_create_post(self.token, {
          channelId: self.channelStore.channel?.id 
        })
        
        if (res.error) throw res

        self.set('id', res.data.id)
        self.set('hashId', res.data.hashId)

        return res.data
      } catch (err) {
        return err
      }
    },
    async updatePost() {
      try {
        self.set('loading', true)

        const res = await api_update_drama(self.token, {
          drama: {
            id: self.id,
            channelId: self.channelStore.channel?.id,
            description: self.description,
            videoId: self.video?.id,
            tags: self.tags
          }
        })

        const id = self.dramasFactory.addUpdateDrama(res.data)
        self.channelStore.attachPost(id)

        self.set('loading', false)
        self.clear()
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

        const data = await self.createPost()
        if (data.error) throw data

        const video = Asset.create({})
        self.set('video', video)

        const res = await video.upload(self.id, self.hashId, self.token, file)
        
        self.set('loading', false)

        if (res.error) throw res

        return res
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

export default UploadChannelStore